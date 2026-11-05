/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import {
  db,
  hashPassword,
  verifyPassword,
  generateToken,
  initDatabase,
} from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize DB schema & seeds
initDatabase();

// --- Auth Middleware Helper ---
interface AuthRequest extends Request {
  user?: {
    id: string;
    username?: string;
    name: string;
    email: string;
    role: string;
    status: string;
    phone: string;
    address: string;
  };
  token?: string;
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }
  const token = authHeader.split(' ')[1];
  const session = db
    .prepare('SELECT user_id, expires_at FROM sessions WHERE token = ?')
    .get(token) as { user_id: string; expires_at: number } | undefined;

  if (!session || session.expires_at < Date.now()) {
    if (session) {
      db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
    }
    res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
    return;
  }

  const user = db
    .prepare('SELECT id, username, name, email, role, status, phone, address FROM users WHERE id = ?')
    .get(session.user_id) as AuthRequest['user'];

  if (!user || user.status !== 'active') {
    res.status(403).json({ error: 'Account is suspended or inactive' });
    return;
  }

  req.user = user;
  req.token = token;
  next();
}

function adminMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  authMiddleware(req, res, () => {
    if (!req.user || !['super_admin', 'admin', 'content_manager', 'support_agent'].includes(req.user.role)) {
      res.status(403).json({ error: 'Forbidden: Admin privilege required' });
      return;
    }
    next();
  });
}

function superAdminMiddleware(req: AuthRequest, res: Response, next: NextFunction): void {
  authMiddleware(req, res, () => {
    if (!req.user || req.user.role !== 'super_admin') {
      res.status(403).json({ error: 'Access denied: Super Administrator privilege required' });
      return;
    }
    next();
  });
}

function logAudit(userId: string, userName: string, action: string, targetType: string, targetId: string, details: string) {
  try {
    const id = `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, user_name, action, target_type, target_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, userId, userName, action, targetType, targetId, details, now);
  } catch (err) {
    console.error('Failed to log audit:', err);
  }
}

// ==========================================
// 1. AUTHENTICATION & USER ROUTES
// ==========================================

// Register
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, address } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      res.status(409).json({ error: 'An account with this email address already exists' });
      return;
    }

    const userId = `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date().toISOString();
    const passwordHash = hashPassword(password);

    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, status, phone, address, created_at, last_login)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, name, cleanEmail, passwordHash, 'customer', 'active', phone || '', address || '', now, now);

    // Create session token
    const token = generateToken();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
    db.prepare(`INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`).run(token, userId, expiresAt);

    // Welcome Notification
    db.prepare(`
      INSERT INTO notifications (id, user_id, is_admin, type, title, message, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `notif-${Date.now()}`,
      userId,
      0,
      'welcome',
      'Welcome to Canabis Hub Germany',
      `Hello ${name}, your member account has been verified. Discover German botanical monographs, lab reports, and accessories.`,
      0,
      now
    );

    // Admin Notification
    db.prepare(`
      INSERT INTO notifications (id, user_id, is_admin, type, title, message, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `notif-adm-${Date.now()}`,
      '',
      1,
      'registration',
      'New Member Registered',
      `${name} (${cleanEmail}) created a new account.`,
      0,
      now
    );

    logAudit(userId, name, 'USER_REGISTERED', 'User', userId, `Registered account with email ${cleanEmail}`);

    res.status(201).json({
      token,
      user: {
        id: userId,
        name,
        email: cleanEmail,
        role: 'customer',
        status: 'active',
        phone: phone || '',
        address: address || '',
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = db
      .prepare('SELECT id, name, email, password_hash, role, status, phone, address FROM users WHERE email = ?')
      .get(cleanEmail) as any;

    if (!user || !verifyPassword(password, user.password_hash)) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    if (user.status !== 'active') {
      res.status(403).json({ error: 'Account is suspended. Please contact compliance@canabishub.de' });
      return;
    }

    const now = new Date().toISOString();
    db.prepare('UPDATE users SET last_login = ? WHERE id = ?').run(now, user.id);

    const token = generateToken();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000;
    db.prepare(`INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)`).run(token, user.id, expiresAt);

    logAudit(user.id, user.name, 'USER_LOGIN', 'User', user.id, 'Logged in to Canabis Hub platform');

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Login failed' });
  }
});

// Logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  }
  res.json({ message: 'Logged out successfully' });
});

// Get Current User
app.get('/api/auth/me', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({ user: req.user });
});

// Update Profile
app.put('/api/auth/profile', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { name, phone, address } = req.body;
    db.prepare(`
      UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), address = COALESCE(?, address)
      WHERE id = ?
    `).run(name, phone, address, req.user!.id);

    const updated = db
      .prepare('SELECT id, name, email, role, status, phone, address FROM users WHERE id = ?')
      .get(req.user!.id);

    logAudit(req.user!.id, req.user!.name, 'PROFILE_UPDATE', 'User', req.user!.id, 'Updated profile information');
    res.json({ user: updated });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update profile' });
  }
});

// Password Reset Request
app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }
  // Respond with success to prevent user enumeration
  res.json({
    message: 'If an account exists for this email, password reset instructions have been dispatched.',
  });
});

// ==========================================
// 2. PRODUCTS & LISTINGS API
// ==========================================

// Get All Products (with filters)
app.get('/api/products', (req: Request, res: Response) => {
  try {
    const { category, brand, type, status, search, sort } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'all') {
      query += ' AND (category = ? OR category_slug = ?)';
      params.push(category, category);
    }
    if (brand && brand !== 'all') {
      query += ' AND (brand = ? OR brand_slug = ?)';
      params.push(brand, brand);
    }
    if (type && type !== 'all') {
      query += ' AND type = ?';
      params.push(type);
    }
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (name LIKE ? OR brand LIKE ? OR description LIKE ? OR sku LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }

    if (sort === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY price DESC';
    } else if (sort === 'name_asc') {
      query += ' ORDER BY name ASC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const rows = db.prepare(query).all(...params) as any[];
    const formatted = rows.map((r) => ({
      ...r,
      terpenes: JSON.parse(r.terpenes_json || '[]'),
      effects: JSON.parse(r.effects_json || '[]'),
      specifications: JSON.parse(r.specifications_json || '{}'),
      gallery: JSON.parse(r.gallery_json || '[]'),
      isFeatured: Boolean(r.is_featured),
      badge: r.badge || '',
      inStock: Boolean(r.in_stock),
    }));

    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch products' });
  }
});

// Create Product (Admin)
app.post('/api/products', adminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const p = req.body;
    const id = p.id || `prod-${Date.now()}`;
    const sku = p.sku || `SKU-${Date.now()}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO products (
        id, sku, name, brand, brand_slug, category, category_slug, type, price, in_stock,
        description, short_description, image, thc, cbd, terpenes_json, effects_json,
        aroma, lab_batch, origin, status, is_featured, badge, specifications_json, gallery_json,
        seo_title, seo_description, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      sku,
      p.name || 'Untitled Product',
      p.brand || 'Canabis Hub Brand',
      p.brand_slug || 'brand',
      p.category || 'Accessories & Storage',
      p.category_slug || 'accessories',
      p.type || 'permitted_merchandise',
      p.price || 0.0,
      p.in_stock ? 1 : 0,
      p.description || '',
      p.short_description || '',
      p.image || '/src/assets/images/acc_violet_glass_jars_1793782404345.jpg',
      p.thc || '',
      p.cbd || '',
      JSON.stringify(p.terpenes || []),
      JSON.stringify(p.effects || []),
      p.aroma || '',
      p.lab_batch || 'DE-ACC-2026-NEW',
      p.origin || 'Germany',
      p.status || 'published',
      p.is_featured ? 1 : 0,
      p.badge || '',
      JSON.stringify(p.specifications || {}),
      JSON.stringify(p.gallery || [p.image || '/src/assets/images/acc_violet_glass_jars_1793782404345.jpg']),
      p.seo_title || p.name,
      p.seo_description || p.short_description,
      now
    );

    logAudit(req.user!.id, req.user!.name, 'PRODUCT_CREATE', 'Product', id, `Created listing: ${p.name}`);
    res.status(201).json({ id, message: 'Product created successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create product' });
  }
});

// Update Product (Admin)
app.put('/api/products/:id', adminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const p = req.body;

    db.prepare(`
      UPDATE products SET
        name = COALESCE(?, name),
        sku = COALESCE(?, sku),
        brand = COALESCE(?, brand),
        category = COALESCE(?, category),
        price = COALESCE(?, price),
        in_stock = COALESCE(?, in_stock),
        description = COALESCE(?, description),
        short_description = COALESCE(?, short_description),
        image = COALESCE(?, image),
        thc = COALESCE(?, thc),
        cbd = COALESCE(?, cbd),
        status = COALESCE(?, status),
        is_featured = COALESCE(?, is_featured),
        badge = COALESCE(?, badge),
        specifications_json = COALESCE(?, specifications_json),
        seo_title = COALESCE(?, seo_title),
        seo_description = COALESCE(?, seo_description)
      WHERE id = ?
    `).run(
      p.name,
      p.sku,
      p.brand,
      p.category,
      p.price,
      p.in_stock !== undefined ? (p.in_stock ? 1 : 0) : (p.inStock !== undefined ? (p.inStock ? 1 : 0) : null),
      p.description,
      p.short_description,
      p.image,
      p.thc,
      p.cbd,
      p.status,
      p.is_featured !== undefined ? (p.is_featured ? 1 : 0) : (p.isFeatured !== undefined ? (p.isFeatured ? 1 : 0) : null),
      p.badge !== undefined ? p.badge : null,
      p.specifications ? JSON.stringify(p.specifications) : null,
      p.seo_title,
      p.seo_description,
      id
    );

    logAudit(req.user!.id, req.user!.name, 'PRODUCT_UPDATE', 'Product', id, `Updated product id: ${id}`);
    res.json({ message: 'Product updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update product' });
  }
});

// Delete Product (Admin)
app.delete('/api/products/:id', adminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    logAudit(req.user!.id, req.user!.name, 'PRODUCT_DELETE', 'Product', id, `Deleted product id: ${id}`);
    res.json({ message: 'Product deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete product' });
  }
});

// ==========================================
// 3. CATEGORIES & BRANDS API
// ==========================================

app.get('/api/categories', (_req: Request, res: Response) => {
  const cats = db.prepare('SELECT * FROM categories').all();
  res.json(cats);
});

app.get('/api/brands', (_req: Request, res: Response) => {
  const brands = db.prepare('SELECT * FROM brands').all() as any[];
  const formatted = brands.map((b) => ({
    ...b,
    signatureProducts: JSON.parse(b.signature_products_json || '[]'),
    labVerified: Boolean(b.lab_verified),
    organicCertified: Boolean(b.organic_certified),
  }));
  res.json(formatted);
});

// ==========================================
// 4. BLOG & EDITORIAL CMS API
// ==========================================

app.get('/api/blog', (_req: Request, res: Response) => {
  const posts = db.prepare('SELECT * FROM blog_posts ORDER BY created_at DESC').all();
  res.json(posts);
});

app.post('/api/blog', adminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const p = req.body;
    const id = p.id || `post-${Date.now()}`;
    const slug = p.slug || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO blog_posts (id, title, slug, category, author, read_time, date, excerpt, content, image, status, seo_title, seo_description, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      p.title,
      slug,
      p.category || 'SCIENCE & BOTANY',
      p.author || req.user!.name,
      p.read_time || '5 min read',
      p.date || 'March 2026',
      p.excerpt || '',
      p.content || '',
      p.image || '/src/assets/images/hero_cannabis_dispensary_1793700801902.jpg',
      p.status || 'published',
      p.seo_title || p.title,
      p.seo_description || p.excerpt,
      now
    );

    logAudit(req.user!.id, req.user!.name, 'BLOG_POST_CREATE', 'Blog', id, `Published blog post: ${p.title}`);
    res.status(201).json({ id, message: 'Article created successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create blog post' });
  }
});

app.put('/api/blog/:id', adminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    const p = req.body;
    db.prepare(`
      UPDATE blog_posts SET
        title = COALESCE(?, title),
        category = COALESCE(?, category),
        excerpt = COALESCE(?, excerpt),
        content = COALESCE(?, content),
        status = COALESCE(?, status),
        image = COALESCE(?, image)
      WHERE id = ?
    `).run(p.title, p.category, p.excerpt, p.content, p.status, p.image, id);

    logAudit(req.user!.id, req.user!.name, 'BLOG_POST_UPDATE', 'Blog', id, `Updated article id: ${id}`);
    res.json({ message: 'Article updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update post' });
  }
});

app.delete('/api/blog/:id', adminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    db.prepare('DELETE FROM blog_posts WHERE id = ?').run(id);
    logAudit(req.user!.id, req.user!.name, 'BLOG_POST_DELETE', 'Blog', id, `Deleted article id: ${id}`);
    res.json({ message: 'Article deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete post' });
  }
});

// ==========================================
// 5. ORDERS FOR PERMITTED NON-CANNABIS ITEMS
// ==========================================

// Get user orders or all orders (if admin)
app.get('/api/orders', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    let rows: any[];
    if (['super_admin', 'admin', 'content_manager', 'support_agent'].includes(req.user!.role)) {
      rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    } else {
      rows = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user!.id);
    }

    const formatted = rows.map((o) => ({
      ...o,
      items: JSON.parse(o.items_json || '[]'),
      shippingAddress: JSON.parse(o.shipping_address_json || '{}'),
    }));
    res.json(formatted);
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch orders' });
  }
});

// Create order for permitted merchandise
app.post('/api/orders', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    if (!items || !items.length) {
      res.status(400).json({ error: 'Order must contain at least one permitted item' });
      return;
    }

    // Verify all items are strictly permitted merchandise, not cannabis
    for (const item of items) {
      const prod = db.prepare('SELECT type FROM products WHERE id = ?').get(item.id) as { type: string } | undefined;
      if (prod && prod.type === 'informational') {
        res.status(400).json({
          error: 'Transactional orders for controlled botanical products are prohibited under German law. Items must be non-cannabis accessories.',
        });
        return;
      }
    }

    const subtotal = items.reduce((acc: number, curr: any) => acc + (curr.price || 0) * (curr.quantity || 1), 0);
    const shipping = subtotal > 50 ? 0.0 : 4.90;
    const total = subtotal + shipping;
    const orderId = `ord-${Date.now()}`;
    const orderRef = `CH-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO orders (id, user_id, order_ref, items_json, subtotal, shipping, total, status, payment_status, payment_method, shipping_address_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      req.user!.id,
      orderRef,
      JSON.stringify(items),
      subtotal,
      shipping,
      total,
      'processing',
      'paid',
      paymentMethod || 'stripe',
      JSON.stringify(shippingAddress || {}),
      now
    );

    // Create User Notification
    db.prepare(`
      INSERT INTO notifications (id, user_id, is_admin, type, title, message, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `notif-${Date.now()}`,
      req.user!.id,
      0,
      'order',
      'Order Confirmed',
      `Your order ${orderRef} for botanical accessories has been confirmed and scheduled for packaging.`,
      0,
      now
    );

    // Admin Notification
    db.prepare(`
      INSERT INTO notifications (id, user_id, is_admin, type, title, message, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      `notif-adm-${Date.now()}`,
      '',
      1,
      'order',
      'New Merchandise Order Received',
      `Order ${orderRef} placed by ${req.user!.name} (€${total.toFixed(2)}).`,
      0,
      now
    );

    logAudit(req.user!.id, req.user!.name, 'ORDER_PLACED', 'Order', orderId, `Placed order ${orderRef} total: €${total.toFixed(2)}`);

    res.status(201).json({
      orderId,
      orderRef,
      total,
      message: 'Order created successfully',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create order' });
  }
});

// Update Order Status (Admin)
app.put('/api/orders/:id/status', adminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { status, payment_status } = req.body;
    db.prepare(`
      UPDATE orders SET
        status = COALESCE(?, status),
        payment_status = COALESCE(?, payment_status)
      WHERE id = ?
    `).run(status, payment_status, req.params.id);

    logAudit(req.user!.id, req.user!.name, 'ORDER_STATUS_UPDATE', 'Order', req.params.id, `Status set to ${status}`);
    res.json({ message: 'Order status updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update order status' });
  }
});

// ==========================================
// 6. PAYMENT SETTINGS DASHBOARD
// ==========================================

app.get('/api/payment-settings', adminMiddleware, (_req: AuthRequest, res: Response) => {
  const rows = db.prepare('SELECT id, provider, is_enabled, mode, public_key, webhook_secret, updated_at FROM payment_settings').all() as any[];
  const formatted = rows.map((r) => ({
    ...r,
    isEnabled: Boolean(r.is_enabled),
  }));
  res.json(formatted);
});

app.put('/api/payment-settings/:id', adminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { is_enabled, mode, public_key, webhook_secret } = req.body;
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE payment_settings SET
        is_enabled = COALESCE(?, is_enabled),
        mode = COALESCE(?, mode),
        public_key = COALESCE(?, public_key),
        webhook_secret = COALESCE(?, webhook_secret),
        updated_at = ?
      WHERE id = ?
    `).run(is_enabled !== undefined ? (is_enabled ? 1 : 0) : null, mode, public_key, webhook_secret, now, req.params.id);

    logAudit(req.user!.id, req.user!.name, 'PAYMENT_SETTING_UPDATE', 'Payment', req.params.id, 'Updated payment gateway config');
    res.json({ message: 'Payment gateway configuration updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update payment setting' });
  }
});

// ==========================================
// 7. SAVED CONTENT & BOOKMARKS
// ==========================================

app.get('/api/saved', authMiddleware, (req: AuthRequest, res: Response) => {
  const items = db.prepare('SELECT item_type, item_id, created_at FROM saved_items WHERE user_id = ?').all(req.user!.id);
  res.json(items);
});

app.post('/api/saved/toggle', authMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { itemType, itemId } = req.body;
    if (!itemType || !itemId) {
      res.status(400).json({ error: 'itemType and itemId are required' });
      return;
    }

    const existing = db
      .prepare('SELECT id FROM saved_items WHERE user_id = ? AND item_type = ? AND item_id = ?')
      .get(req.user!.id, itemType, itemId) as { id: string } | undefined;

    if (existing) {
      db.prepare('DELETE FROM saved_items WHERE id = ?').run(existing.id);
      res.json({ saved: false, message: 'Removed from saved items' });
    } else {
      const id = `saved-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const now = new Date().toISOString();
      db.prepare('INSERT INTO saved_items (id, user_id, item_type, item_id, created_at) VALUES (?, ?, ?, ?, ?)').run(
        id,
        req.user!.id,
        itemType,
        itemId,
        now
      );
      res.json({ saved: true, message: 'Added to saved items' });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to toggle saved item' });
  }
});

// ==========================================
// 8. NOTIFICATIONS API
// ==========================================

app.get('/api/notifications', authMiddleware, (req: AuthRequest, res: Response) => {
  const isAdmin = ['super_admin', 'admin', 'content_manager', 'support_agent'].includes(req.user!.role);
  let rows: any[];
  if (isAdmin) {
    rows = db.prepare('SELECT * FROM notifications WHERE is_admin = 1 OR user_id = ? ORDER BY created_at DESC LIMIT 50').all(req.user!.id);
  } else {
    rows = db.prepare('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').all(req.user!.id);
  }
  res.json(rows);
});

app.put('/api/notifications/:id/read', authMiddleware, (req: Request, res: Response) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(req.params.id);
  res.json({ message: 'Notification marked as read' });
});

// ==========================================
// 9. ADMIN PANEL & AUDIT LOGS API
// ==========================================

app.get('/api/admin/stats', adminMiddleware, (_req: AuthRequest, res: Response) => {
  try {
    const totalUsers = (db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c;
    const activeUsers = (db.prepare("SELECT COUNT(*) as c FROM users WHERE status = 'active'").get() as any).c;
    const totalProducts = (db.prepare('SELECT COUNT(*) as c FROM products').get() as any).c;
    const informationalListings = (db.prepare("SELECT COUNT(*) as c FROM products WHERE type = 'informational'").get() as any).c;
    const permittedMerchandise = (db.prepare("SELECT COUNT(*) as c FROM products WHERE type = 'permitted_merchandise'").get() as any).c;
    const publishedArticles = (db.prepare("SELECT COUNT(*) as c FROM blog_posts WHERE status = 'published'").get() as any).c;
    const draftArticles = (db.prepare("SELECT COUNT(*) as c FROM blog_posts WHERE status = 'draft'").get() as any).c;
    const totalOrders = (db.prepare('SELECT COUNT(*) as c FROM orders').get() as any).c;
    const totalRevenue = (db.prepare("SELECT SUM(total) as s FROM orders WHERE payment_status = 'paid'").get() as any).s || 0;
    const totalAuditLogs = (db.prepare('SELECT COUNT(*) as c FROM audit_logs').get() as any).c;

    res.json({
      totalUsers,
      activeUsers,
      totalProducts,
      informationalListings,
      permittedMerchandise,
      publishedArticles,
      draftArticles,
      totalOrders,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalAuditLogs,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch admin stats' });
  }
});

// Admin Users Management
app.get('/api/admin/users', adminMiddleware, (_req: AuthRequest, res: Response) => {
  const users = db.prepare('SELECT id, name, email, role, status, phone, address, created_at, last_login FROM users ORDER BY created_at DESC').all();
  res.json(users);
});

app.put('/api/admin/users/:id/role', adminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { role, status } = req.body;
    const target = db.prepare('SELECT id, role, email FROM users WHERE id = ?').get(req.params.id) as any;
    if (!target) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Protection: regular admins CANNOT modify Super Admin or promote to Super Admin
    if (target.role === 'super_admin' && req.user!.role !== 'super_admin') {
      res.status(403).json({ error: 'Forbidden: Regular administrators cannot modify Super Administrator accounts.' });
      return;
    }
    if (role === 'super_admin' && req.user!.role !== 'super_admin') {
      res.status(403).json({ error: 'Forbidden: Only the Super Administrator can assign Super Admin privileges.' });
      return;
    }

    db.prepare('UPDATE users SET role = COALESCE(?, role), status = COALESCE(?, status) WHERE id = ?').run(role, status, req.params.id);
    logAudit(req.user!.id, req.user!.name, 'USER_ROLE_CHANGE', 'User', req.params.id, `Updated role to ${role}, status to ${status}`);
    res.json({ message: 'User updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update user' });
  }
});

// Admin Audit Logs
app.get('/api/admin/audit-logs', adminMiddleware, (_req: AuthRequest, res: Response) => {
  const logs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100').all();
  res.json(logs);
});

// ==========================================
// 10. SUPER ADMIN PRIVATE PORTAL API
// ==========================================

// Super Admin Login (Private route with rate limiting, temporary lockout, generic error messages)
app.post('/api/super-admin/login', (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      res.status(400).json({ error: 'Username or email and password are required' });
      return;
    }

    const cleanIdentifier = String(identifier).trim().toLowerCase();
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const userAgent = (req.headers['user-agent'] as string) || 'Unknown Browser';
    const now = new Date().toISOString();

    const user = db
      .prepare('SELECT id, username, name, email, password_hash, role, status, failed_login_attempts, locked_until FROM users WHERE LOWER(email) = ? OR LOWER(username) = ?')
      .get(cleanIdentifier, cleanIdentifier) as any;

    // Check account lockout
    if (user && user.locked_until && user.locked_until > Date.now()) {
      const remainingMinutes = Math.ceil((user.locked_until - Date.now()) / 60000);
      db.prepare(`
        INSERT INTO login_history (id, user_id, identifier, ip_address, user_agent, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(`lh-${Date.now()}`, user.id, cleanIdentifier, ip, userAgent, 'locked', now);

      res.status(429).json({
        error: `Account is temporarily locked due to repeated failed login attempts. Please try again in ${remainingMinutes} minute(s).`
      });
      return;
    }

    // Validate credentials and super_admin role
    const isValid = user && user.role === 'super_admin' && verifyPassword(password, user.password_hash);

    if (!isValid) {
      if (user && user.role === 'super_admin') {
        const nextFailed = (user.failed_login_attempts || 0) + 1;
        const lockDuration = nextFailed >= 5 ? Date.now() + 15 * 60 * 1000 : 0;
        db.prepare('UPDATE users SET failed_login_attempts = ?, locked_until = ? WHERE id = ?').run(
          nextFailed,
          lockDuration,
          user.id
        );
      }

      db.prepare(`
        INSERT INTO login_history (id, user_id, identifier, ip_address, user_agent, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(`lh-${Date.now()}`, user?.id || 'unknown', cleanIdentifier, ip, userAgent, 'failed', now);

      // Generic error message: does not reveal if account exists
      res.status(401).json({ error: 'Invalid credentials. Please verify your username or email and password.' });
      return;
    }

    if (user.status !== 'active') {
      res.status(403).json({ error: 'Account is deactivated. Contact security compliance.' });
      return;
    }

    // Reset failed attempts upon successful login
    db.prepare('UPDATE users SET failed_login_attempts = 0, locked_until = 0, last_login = ? WHERE id = ?').run(now, user.id);

    // Create session token with 12 hour expiry
    const token = generateToken();
    const expiresAt = Date.now() + 12 * 60 * 60 * 1000;
    db.prepare(`
      INSERT INTO sessions (token, user_id, ip_address, user_agent, created_at, last_active, expires_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(token, user.id, ip, userAgent, now, now, expiresAt);

    // Record login history
    db.prepare(`
      INSERT INTO login_history (id, user_id, identifier, ip_address, user_agent, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(`lh-${Date.now()}`, user.id, cleanIdentifier, ip, userAgent, 'success', now);

    logAudit(user.id, user.username || user.name, 'SUPER_ADMIN_LOGIN', 'SuperAdmin', user.id, `Super Admin authenticated successfully from ${ip}`);

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username || 'Admin',
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Authentication processing error' });
  }
});

// Super Admin Forgot Password
app.post('/api/super-admin/forgot-password', (req: Request, res: Response) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      res.status(400).json({ error: 'Username or email is required' });
      return;
    }

    const cleanIdentifier = String(identifier).trim().toLowerCase();
    const user = db
      .prepare('SELECT id, username, email, role FROM users WHERE (LOWER(email) = ? OR LOWER(username) = ?) AND role = "super_admin"')
      .get(cleanIdentifier, cleanIdentifier) as any;

    let recoveryCode = '';
    if (user) {
      recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 15 * 60 * 1000;
      db.prepare('UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?').run(recoveryCode, expires, user.id);
      logAudit(user.id, user.username || 'Admin', 'SUPER_ADMIN_PASSWORD_RESET_REQUESTED', 'SuperAdmin', user.id, 'Identity verification reset code generated');
    }

    // Generic response with recovery verification assistance
    res.json({
      message: 'If the provided username or email corresponds to an authorized Super Admin account, identity verification instructions have been dispatched.',
      verificationHint: recoveryCode ? recoveryCode : undefined,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Recovery request error' });
  }
});

// Super Admin Reset Password with Identity Verification Code
app.post('/api/super-admin/reset-password', (req: Request, res: Response) => {
  try {
    const { identifier, verificationCode, newPassword } = req.body;
    if (!identifier || !verificationCode || !newPassword) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    const cleanIdentifier = String(identifier).trim().toLowerCase();
    const user = db
      .prepare('SELECT id, username, password_hash, reset_token, reset_token_expires FROM users WHERE (LOWER(email) = ? OR LOWER(username) = ?) AND role = "super_admin"')
      .get(cleanIdentifier, cleanIdentifier) as any;

    if (!user || user.reset_token !== String(verificationCode).trim() || user.reset_token_expires < Date.now()) {
      res.status(400).json({ error: 'Invalid or expired identity verification code. Please request a new code.' });
      return;
    }

    // Strong password check
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      res.status(400).json({
        error: 'Password does not meet complexity requirements: Minimum 8 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character.'
      });
      return;
    }

    const newHash = hashPassword(newPassword);
    db.prepare('UPDATE users SET password_hash = ?, reset_token = "", reset_token_expires = 0, failed_login_attempts = 0, locked_until = 0 WHERE id = ?').run(
      newHash,
      user.id
    );

    // Invalidate all existing sessions
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(user.id);

    logAudit(user.id, user.username || 'Admin', 'SUPER_ADMIN_PASSWORD_RESET_COMPLETED', 'SuperAdmin', user.id, 'Super Admin password successfully reset; all active sessions revoked.');

    res.json({ message: 'Password has been updated successfully. Please authenticate with your new credentials.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to reset password' });
  }
});

// Super Admin Profile & Current Session Info
app.get('/api/super-admin/me', superAdminMiddleware, (req: AuthRequest, res: Response) => {
  const currentSession = db.prepare('SELECT ip_address, user_agent, created_at, last_active, expires_at FROM sessions WHERE token = ?').get(req.token!) as any;
  res.json({
    user: req.user,
    session: currentSession,
  });
});

// Super Admin Overview Dashboard Statistics
app.get('/api/super-admin/overview', superAdminMiddleware, (_req: AuthRequest, res: Response) => {
  try {
    const totalUsers = (db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c;
    const totalAdmins = (db.prepare("SELECT COUNT(*) as c FROM users WHERE role IN ('super_admin', 'admin', 'content_manager', 'support_agent')").get() as any).c;
    const activeSessions = (db.prepare('SELECT COUNT(*) as c FROM sessions WHERE expires_at > ?').get(Date.now()) as any).c;
    const recentLogins = db.prepare('SELECT * FROM login_history ORDER BY created_at DESC LIMIT 6').all();
    const failedLogins = (db.prepare("SELECT COUNT(*) as c FROM login_history WHERE status != 'success'").get() as any).c;
    const totalAuditLogs = (db.prepare('SELECT COUNT(*) as c FROM audit_logs').get() as any).c;

    res.json({
      totalUsers,
      totalAdmins,
      activeSessions,
      failedLogins,
      totalAuditLogs,
      recentLogins,
      systemStatus: 'Operational & Hardened (PBKDF2/SHA-512, Role-Based Access Control, CanG § 5)',
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to fetch overview metrics' });
  }
});

// Super Admin Active Sessions
app.get('/api/super-admin/sessions', superAdminMiddleware, (req: AuthRequest, res: Response) => {
  const sessions = db.prepare('SELECT token, ip_address, user_agent, created_at, last_active, expires_at FROM sessions WHERE user_id = ? ORDER BY expires_at DESC').all(req.user!.id) as any[];
  const formatted = sessions.map((s) => ({
    token: s.token,
    ip_address: s.ip_address || '127.0.0.1',
    user_agent: s.user_agent || 'Chrome / macOS (Super Admin Console)',
    created_at: s.created_at || new Date().toISOString(),
    last_active: s.last_active || new Date().toISOString(),
    expires_at: s.expires_at,
    isCurrent: s.token === req.token,
  }));
  res.json(formatted);
});

// Terminate a single session
app.delete('/api/super-admin/sessions/:token', superAdminMiddleware, (req: AuthRequest, res: Response) => {
  db.prepare('DELETE FROM sessions WHERE token = ? AND user_id = ?').run(req.params.token, req.user!.id);
  logAudit(req.user!.id, req.user!.username || req.user!.name, 'SUPER_ADMIN_SESSION_TERMINATED', 'Session', req.params.token, 'Terminated active session');
  res.json({ message: 'Session terminated successfully' });
});

// Terminate all other sessions except current
app.post('/api/super-admin/sessions/terminate-others', superAdminMiddleware, (req: AuthRequest, res: Response) => {
  db.prepare('DELETE FROM sessions WHERE user_id = ? AND token != ?').run(req.user!.id, req.token!);
  logAudit(req.user!.id, req.user!.username || req.user!.name, 'SUPER_ADMIN_OTHER_SESSIONS_REVOKED', 'Session', req.user!.id, 'Revoked all other active sessions');
  res.json({ message: 'All other active sessions have been terminated.' });
});

// Super Admin Login History
app.get('/api/super-admin/login-history', superAdminMiddleware, (_req: AuthRequest, res: Response) => {
  const logs = db.prepare('SELECT * FROM login_history ORDER BY created_at DESC LIMIT 50').all();
  res.json(logs);
});

// Super Admin Audit Logs
app.get('/api/super-admin/audit-logs', superAdminMiddleware, (_req: AuthRequest, res: Response) => {
  const logs = db.prepare('SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 100').all();
  res.json(logs);
});

// Super Admin Update Username
app.put('/api/super-admin/credentials/username', superAdminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { newUsername, currentPassword } = req.body;
    if (!newUsername || !currentPassword) {
      res.status(400).json({ error: 'New username and current password are required' });
      return;
    }

    const cleanUsername = String(newUsername).trim();
    if (cleanUsername.length < 3 || cleanUsername.length > 30 || !/^[a-zA-Z0-9_-]+$/.test(cleanUsername)) {
      res.status(400).json({ error: 'Username must be between 3 and 30 characters and contain only letters, numbers, hyphens, and underscores.' });
      return;
    }

    // Verify current password
    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user!.id) as any;
    if (!verifyPassword(currentPassword, user.password_hash)) {
      res.status(401).json({ error: 'Incorrect current password. Verification failed.' });
      return;
    }

    // Verify uniqueness
    const existing = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?) AND id != ?').get(cleanUsername, req.user!.id);
    if (existing) {
      res.status(409).json({ error: 'This username is already taken by another account.' });
      return;
    }

    db.prepare('UPDATE users SET username = ? WHERE id = ?').run(cleanUsername, req.user!.id);
    logAudit(req.user!.id, cleanUsername, 'SUPER_ADMIN_USERNAME_CHANGED', 'SuperAdmin', req.user!.id, `Username updated to ${cleanUsername}`);

    res.json({ success: true, username: cleanUsername, message: 'Super Admin username updated successfully.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update username' });
  }
});

// Super Admin Request Email Verification Code
app.post('/api/super-admin/credentials/email/request-verification', superAdminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { newEmail, currentPassword } = req.body;
    if (!newEmail || !currentPassword) {
      res.status(400).json({ error: 'New email address and current password are required' });
      return;
    }

    const cleanEmail = String(newEmail).trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      res.status(400).json({ error: 'Please enter a valid email address format.' });
      return;
    }

    // Verify current password
    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user!.id) as any;
    if (!verifyPassword(currentPassword, user.password_hash)) {
      res.status(401).json({ error: 'Incorrect current password. Verification failed.' });
      return;
    }

    // Check uniqueness
    const existing = db.prepare('SELECT id FROM users WHERE LOWER(email) = ? AND id != ?').get(cleanEmail, req.user!.id);
    if (existing) {
      res.status(409).json({ error: 'This email address is already associated with another account.' });
      return;
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    db.prepare('UPDATE users SET email_verification_pending = ?, email_verification_code = ? WHERE id = ?').run(
      cleanEmail,
      code,
      req.user!.id
    );

    logAudit(req.user!.id, req.user!.username || req.user!.name, 'SUPER_ADMIN_EMAIL_VERIFICATION_REQUESTED', 'SuperAdmin', req.user!.id, `Verification code dispatched for new email: ${cleanEmail}`);

    res.json({
      success: true,
      pendingEmail: cleanEmail,
      verificationCode: code,
      message: `Identity verification code generated for ${cleanEmail}. Please enter the code to confirm the update.`
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to initiate email verification' });
  }
});

// Super Admin Confirm Email Update
app.put('/api/super-admin/credentials/email/confirm', superAdminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { verificationCode } = req.body;
    if (!verificationCode) {
      res.status(400).json({ error: 'Verification code is required' });
      return;
    }

    const user = db.prepare('SELECT email_verification_pending, email_verification_code FROM users WHERE id = ?').get(req.user!.id) as any;
    if (!user || !user.email_verification_pending || user.email_verification_code !== String(verificationCode).trim()) {
      res.status(400).json({ error: 'Invalid verification code. Please check your code and try again.' });
      return;
    }

    const newEmail = user.email_verification_pending;
    db.prepare('UPDATE users SET email = ?, email_verification_pending = "", email_verification_code = "" WHERE id = ?').run(
      newEmail,
      req.user!.id
    );

    // Invalidate other active sessions for security
    db.prepare('DELETE FROM sessions WHERE user_id = ? AND token != ?').run(req.user!.id, req.token!);

    logAudit(req.user!.id, req.user!.username || req.user!.name, 'SUPER_ADMIN_EMAIL_CHANGED', 'SuperAdmin', req.user!.id, `Super Admin email updated to ${newEmail}`);

    res.json({
      success: true,
      email: newEmail,
      message: 'Email address updated successfully. All other active sessions have been invalidated.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to confirm email update' });
  }
});

// Super Admin Update Password
app.put('/api/super-admin/credentials/password', superAdminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400).json({ error: 'Current password, new password, and confirmation are required.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      res.status(400).json({ error: 'New password and confirmation do not match.' });
      return;
    }

    // Verify current password
    const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user!.id) as any;
    if (!verifyPassword(currentPassword, user.password_hash)) {
      res.status(401).json({ error: 'Current password is incorrect. Verification failed.' });
      return;
    }

    // Strong password validation
    if (newPassword.length < 8 || !/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[^A-Za-z0-9]/.test(newPassword)) {
      res.status(400).json({
        error: 'Password does not meet requirements: Minimum 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character.'
      });
      return;
    }

    const newHash = hashPassword(newPassword);
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, req.user!.id);

    // Invalidate all other sessions
    db.prepare('DELETE FROM sessions WHERE user_id = ? AND token != ?').run(req.user!.id, req.token!);

    logAudit(req.user!.id, req.user!.username || req.user!.name, 'SUPER_ADMIN_PASSWORD_CHANGED', 'SuperAdmin', req.user!.id, 'Super Admin password updated; other sessions revoked');

    res.json({
      success: true,
      message: 'Password successfully changed. All other active sessions have been invalidated.'
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to change password' });
  }
});

// Super Admin Management of Other Administrators (RBAC)
app.get('/api/super-admin/admins', superAdminMiddleware, (_req: AuthRequest, res: Response) => {
  const admins = db
    .prepare('SELECT id, username, name, email, role, status, phone, created_at, last_login FROM users WHERE role IN ("super_admin", "admin", "content_manager", "support_agent") ORDER BY created_at ASC')
    .all();
  res.json(admins);
});

// Super Admin Create New Sub-Admin
app.post('/api/super-admin/admins', superAdminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const { name, username, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      res.status(400).json({ error: 'Name, email, password, and role are required' });
      return;
    }

    if (role === 'super_admin') {
      res.status(400).json({ error: 'Additional Super Administrator accounts cannot be created.' });
      return;
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanUsername = username ? String(username).trim() : null;

    const existingEmail = db.prepare('SELECT id FROM users WHERE LOWER(email) = ?').get(cleanEmail);
    if (existingEmail) {
      res.status(409).json({ error: 'An account with this email address already exists.' });
      return;
    }

    if (cleanUsername) {
      const existingUser = db.prepare('SELECT id FROM users WHERE LOWER(username) = ?').get(cleanUsername.toLowerCase());
      if (existingUser) {
        res.status(409).json({ error: 'This username is already taken.' });
        return;
      }
    }

    const adminId = `usr-admin-${Date.now()}`;
    const hash = hashPassword(password);
    const now = new Date().toISOString();

    db.prepare(`
      INSERT INTO users (id, username, name, email, password_hash, role, status, created_at, last_login)
      VALUES (?, ?, ?, ?, ?, ?, "active", ?, ?)
    `).run(adminId, cleanUsername, name, cleanEmail, hash, role, now, now);

    logAudit(req.user!.id, req.user!.username || req.user!.name, 'ADMIN_ACCOUNT_CREATED', 'Admin', adminId, `Created ${role} account for ${cleanEmail}`);

    res.status(201).json({ message: 'Administrator account created successfully', id: adminId });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to create administrator' });
  }
});

// Super Admin Update Sub-Admin
app.put('/api/super-admin/admins/:id', superAdminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const target = db.prepare('SELECT id, role FROM users WHERE id = ?').get(req.params.id) as any;
    if (!target) {
      res.status(404).json({ error: 'Administrator account not found' });
      return;
    }

    if (target.id === req.user!.id) {
      res.status(400).json({ error: 'Use Account Security settings to update your Super Admin profile.' });
      return;
    }

    const { role, status } = req.body;
    if (role === 'super_admin') {
      res.status(400).json({ error: 'Cannot promote account to Super Admin.' });
      return;
    }

    db.prepare('UPDATE users SET role = COALESCE(?, role), status = COALESCE(?, status) WHERE id = ?').run(
      role,
      status,
      req.params.id
    );

    logAudit(req.user!.id, req.user!.username || req.user!.name, 'ADMIN_ACCOUNT_UPDATED', 'Admin', req.params.id, `Updated role to ${role}, status to ${status}`);

    res.json({ message: 'Administrator status updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to update administrator' });
  }
});

// Super Admin Delete Sub-Admin
app.delete('/api/super-admin/admins/:id', superAdminMiddleware, (req: AuthRequest, res: Response) => {
  try {
    const target = db.prepare('SELECT id, role, email FROM users WHERE id = ?').get(req.params.id) as any;
    if (!target) {
      res.status(404).json({ error: 'Administrator account not found' });
      return;
    }

    if (target.role === 'super_admin' || target.id === req.user!.id) {
      res.status(403).json({ error: 'The Super Administrator account cannot be deleted.' });
      return;
    }

    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(target.id);
    db.prepare('DELETE FROM notifications WHERE user_id = ?').run(target.id);
    db.prepare('DELETE FROM users WHERE id = ?').run(target.id);

    logAudit(req.user!.id, req.user!.username || req.user!.name, 'ADMIN_ACCOUNT_DELETED', 'Admin', target.id, `Deleted admin account ${target.email}`);

    res.json({ message: 'Administrator account deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to delete administrator' });
  }
});

// ==========================================
// 10. VITE MOUNT & SERVER START
// ==========================================

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Canabis Hub Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
