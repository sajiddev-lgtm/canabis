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
    name: string;
    email: string;
    role: string;
    status: string;
    phone: string;
    address: string;
  };
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
    .prepare('SELECT id, name, email, role, status, phone, address FROM users WHERE id = ?')
    .get(session.user_id) as AuthRequest['user'];

  if (!user || user.status !== 'active') {
    res.status(403).json({ error: 'Account is suspended or inactive' });
    return;
  }

  req.user = user;
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
        aroma, lab_batch, origin, status, seo_title, seo_description, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      sku,
      p.name || 'Untitled Product',
      p.brand || 'Canabis Hub Brand',
      p.brand_slug || 'brand',
      p.category || 'Premium Flower',
      p.category_slug || 'flower',
      p.type || 'informational',
      p.price || 0.0,
      p.in_stock ? 1 : 0,
      p.description || '',
      p.short_description || '',
      p.image || '/src/assets/images/product_premium_flower_1793700802879.jpg',
      p.thc || '',
      p.cbd || '',
      JSON.stringify(p.terpenes || []),
      JSON.stringify(p.effects || []),
      p.aroma || '',
      p.lab_batch || 'DE-LAB-2026-NEW',
      p.origin || 'Germany',
      p.status || 'published',
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
        seo_title = COALESCE(?, seo_title),
        seo_description = COALESCE(?, seo_description)
      WHERE id = ?
    `).run(
      p.name,
      p.sku,
      p.brand,
      p.category,
      p.price,
      p.in_stock !== undefined ? (p.in_stock ? 1 : 0) : null,
      p.description,
      p.short_description,
      p.image,
      p.thc,
      p.cbd,
      p.status,
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
