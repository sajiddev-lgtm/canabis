/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import {
  PRODUCTS_DATA,
  BRANDS_DIRECTORY,
  BLOG_POSTS,
  CATEGORIES_DATA,
} from '../data/cannabisData';

// Ensure data directory exists
const DATA_DIR = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'canabishub.db');
export const db = new DatabaseSync(DB_PATH);

// Helper for secure password hashing using node:crypto PBKDF2
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, combinedHash: string): boolean {
  try {
    const [salt, originalHash] = combinedHash.split(':');
    if (!salt || !originalHash) return false;
    const testHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch {
    return false;
  }
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Initialize tables and run migrations
export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'customer',
      status TEXT NOT NULL DEFAULT 'active',
      phone TEXT DEFAULT '',
      address TEXT DEFAULT '',
      created_at TEXT NOT NULL,
      last_login TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      brand_slug TEXT NOT NULL,
      category TEXT NOT NULL,
      category_slug TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'informational',
      price REAL DEFAULT 0.0,
      in_stock INTEGER DEFAULT 1,
      description TEXT NOT NULL,
      short_description TEXT DEFAULT '',
      image TEXT NOT NULL,
      thc TEXT DEFAULT '',
      cbd TEXT DEFAULT '',
      terpenes_json TEXT DEFAULT '[]',
      effects_json TEXT DEFAULT '[]',
      aroma TEXT DEFAULT '',
      lab_batch TEXT DEFAULT '',
      origin TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'published',
      seo_title TEXT DEFAULT '',
      seo_description TEXT DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS categories (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      count_label TEXT DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS brands (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category_key TEXT NOT NULL,
      category_label TEXT NOT NULL,
      location TEXT NOT NULL,
      tagline TEXT NOT NULL,
      specialty TEXT NOT NULL,
      description TEXT NOT NULL,
      founded TEXT NOT NULL,
      signature_products_json TEXT DEFAULT '[]',
      lab_verified INTEGER DEFAULT 1,
      organic_certified INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS blog_posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      author TEXT NOT NULL,
      read_time TEXT NOT NULL,
      date TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      image TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'published',
      seo_title TEXT DEFAULT '',
      seo_description TEXT DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      order_ref TEXT UNIQUE NOT NULL,
      items_json TEXT NOT NULL,
      subtotal REAL NOT NULL,
      shipping REAL NOT NULL,
      total REAL NOT NULL,
      status TEXT NOT NULL DEFAULT 'processing',
      payment_status TEXT NOT NULL DEFAULT 'paid',
      payment_method TEXT NOT NULL,
      shipping_address_json TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS payment_settings (
      id TEXT PRIMARY KEY,
      provider TEXT NOT NULL,
      is_enabled INTEGER DEFAULT 1,
      mode TEXT DEFAULT 'test',
      public_key TEXT DEFAULT '',
      webhook_secret TEXT DEFAULT '',
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS saved_items (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      item_type TEXT NOT NULL,
      item_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(user_id, item_type, item_id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      user_id TEXT DEFAULT '',
      is_admin INTEGER DEFAULT 0,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      action TEXT NOT NULL,
      target_type TEXT NOT NULL,
      target_id TEXT NOT NULL,
      details TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
  `);

  // Seed default admin and user if not exists
  const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@canabishub.de');
  if (!existingAdmin) {
    const adminId = 'usr-admin-1';
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, status, phone, address, created_at, last_login)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      adminId,
      'Canabis Hub Super Admin',
      'admin@canabishub.de',
      hashPassword('Admin@CanabisHub2026!'),
      'super_admin',
      'active',
      '+49 30 8920 4401',
      'Friedrichstraße 120, 10117 Berlin',
      now,
      now
    );

    // Seed Demo User
    const userId = 'usr-demo-1';
    db.prepare(`
      INSERT INTO users (id, name, email, password_hash, role, status, phone, address, created_at, last_login)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      'Maximilian Weber',
      'user@canabishub.de',
      hashPassword('User@CanabisHub2026!'),
      'customer',
      'active',
      '+49 171 4920 182',
      'Kantstraße 42, 10625 Berlin',
      now,
      now
    );

    // Initial Welcome Notification
    db.prepare(`
      INSERT INTO notifications (id, user_id, is_admin, type, title, message, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'notif-1',
      userId,
      0,
      'welcome',
      'Welcome to Canabis Hub Germany',
      'Your verified member account is ready. Discover German cultivars, lab batch reports, and store saved monographs.',
      0,
      now
    );

    db.prepare(`
      INSERT INTO notifications (id, user_id, is_admin, type, title, message, is_read, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'notif-admin-1',
      '',
      1,
      'system',
      'System Audit Initialized',
      'Canabis Hub Central Registry database successfully migrated and verified under German CanG standards.',
      0,
      now
    );

    // Seed audit log
    db.prepare(`
      INSERT INTO audit_logs (id, user_id, user_name, action, target_type, target_id, details, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'log-1',
      adminId,
      'Canabis Hub Super Admin',
      'SYSTEM_INITIALIZATION',
      'Database',
      'system',
      'Initial platform schema migrated and seeded.',
      now
    );
  }

  // Seed Categories
  const catCount = db.prepare('SELECT COUNT(*) as count FROM categories').get() as { count: number };
  if (catCount.count === 0) {
    const insertCat = db.prepare(`
      INSERT INTO categories (id, name, slug, description, image, count_label)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    for (const cat of CATEGORIES_DATA) {
      insertCat.run(cat.id, cat.name, cat.slug, cat.description, cat.image, cat.count);
    }
  }

  // Seed Brands
  const brandCount = db.prepare('SELECT COUNT(*) as count FROM brands').get() as { count: number };
  if (brandCount.count === 0) {
    const insertBrand = db.prepare(`
      INSERT INTO brands (id, name, slug, category_key, category_label, location, tagline, specialty, description, founded, signature_products_json, lab_verified, organic_certified)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const b of BRANDS_DIRECTORY) {
      insertBrand.run(
        b.id,
        b.name,
        b.id,
        b.category,
        b.categoryLabel,
        b.location,
        b.tagline,
        b.specialty,
        b.description,
        b.founded,
        JSON.stringify(b.signatureProducts),
        b.labVerified ? 1 : 0,
        b.organicCertified ? 1 : 0
      );
    }
  }

  // Seed Products (Informational Cannabis Monographs + Permitted Non-Cannabis Merchandise)
  const prodCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  if (prodCount.count === 0) {
    const insertProd = db.prepare(`
      INSERT INTO products (
        id, sku, name, brand, brand_slug, category, category_slug, type, price, in_stock,
        description, short_description, image, thc, cbd, terpenes_json, effects_json,
        aroma, lab_batch, origin, status, seo_title, seo_description, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const now = new Date().toISOString();

    // 1. Seed Informational Cannabis Products
    for (const p of PRODUCTS_DATA) {
      insertProd.run(
        p.id,
        `SKU-${p.id.toUpperCase()}`,
        p.name,
        p.brand,
        p.brandSlug,
        p.category,
        p.categorySlug,
        'informational',
        0.0,
        1,
        p.description,
        `${p.strainType} · THC ${p.thc}`,
        p.image,
        p.thc,
        p.cbd,
        JSON.stringify(p.terpenes),
        JSON.stringify(p.effects),
        p.aroma,
        p.labBatch,
        p.origin,
        'published',
        `${p.name} Monograph | Canabis Hub`,
        `Complete lab certificate and terpene breakdown for ${p.name}.`,
        now
      );
    }

    // 2. Seed Lawful Non-Cannabis Merchandise & Botanical Accessories (Permitted for transaction)
    const permittedItems = [
      {
        id: 'acc-1',
        sku: 'ACC-GLASS-JAR-3PK',
        name: 'German Botanical Violet Glass Curing Jars (3-Pack)',
        brand: 'Canabis Hub Hardware',
        brandSlug: 'canabis-hub-hardware',
        category: 'Accessories & Storage',
        categorySlug: 'accessories',
        type: 'permitted_merchandise',
        price: 34.50,
        in_stock: 45,
        description: 'Biophotonic Miron violet glass containers blocking the complete visible light spectrum while admitting beneficial UV-A and infrared frequencies for optimal terpene aging.',
        short_description: '3x 250ml Miron violet glass curing jars with airtight seal.',
        image: '/src/assets/images/product_premium_flower_1793700802879.jpg',
        labBatch: 'DE-ACC-2026-01',
        origin: 'Bavaria, Germany',
      },
      {
        id: 'acc-2',
        sku: 'ACC-BOVEDA-62',
        name: 'Terpene Shield Humidity Packs 62% RH (10-Pack)',
        brand: 'Boveda Scientific',
        brandSlug: 'boveda-scientific',
        category: 'Accessories & Storage',
        categorySlug: 'accessories',
        type: 'permitted_merchandise',
        price: 18.90,
        in_stock: 120,
        description: 'Patented 2-way humidity control technology creating a monolayer of purified water vapor over trichomes to prevent evaporation of volatile terpenes.',
        short_description: 'Size 8g humidity regulators for curing containers.',
        image: '/src/assets/images/product_extract_concentrate_1793700803077.jpg',
        labBatch: 'DE-ACC-2026-02',
        origin: 'Hamburg, Germany',
      },
      {
        id: 'acc-3',
        sku: 'ACC-SCALE-DIGITAL',
        name: 'Precision Analytical Botanical Scale 0.01g',
        brand: 'Stuttgart Precision',
        brandSlug: 'stuttgart-precision',
        category: 'Accessories & Storage',
        categorySlug: 'accessories',
        type: 'permitted_merchandise',
        price: 49.00,
        in_stock: 35,
        description: 'High-precision strain gauge sensor with backlit LCD, stainless steel platform, tare function, and 100g calibration weight for accurate botanical compounding.',
        short_description: '0.01g to 500g digital pocket laboratory scale.',
        image: '/src/assets/images/hero_lab_testing_1793700802431.jpg',
        labBatch: 'DE-ACC-2026-03',
        origin: 'Stuttgart, Germany',
      },
      {
        id: 'acc-4',
        sku: 'ACC-TOTE-ORGANIC',
        name: 'Canabis Hub Heavyweight Organic Hemp Tote',
        brand: 'Canabis Hub Apparel',
        brandSlug: 'canabis-hub-apparel',
        category: 'Apparel & Lifestyle',
        categorySlug: 'apparel',
        type: 'permitted_merchandise',
        price: 24.00,
        in_stock: 80,
        description: 'Crafted from 100% European unbleached organic hemp canvas with reinforced cross-stitching and screenprinted botanical typography.',
        short_description: 'Heavyweight organic hemp canvas tote with internal zippered pocket.',
        image: '/src/assets/images/delivery_fleet_retail_1793700802596.jpg',
        labBatch: 'DE-ACC-2026-04',
        origin: 'Berlin, Germany',
      },
    ];

    for (const acc of permittedItems) {
      insertProd.run(
        acc.id,
        acc.sku,
        acc.name,
        acc.brand,
        acc.brandSlug,
        acc.category,
        acc.categorySlug,
        acc.type,
        acc.price,
        acc.in_stock,
        acc.description,
        acc.short_description,
        acc.image,
        '0.0%',
        '0.0%',
        JSON.stringify([]),
        JSON.stringify([]),
        'Clean non-botanical accessory',
        acc.labBatch,
        acc.origin,
        'published',
        `${acc.name} | Canabis Hub Store`,
        acc.short_description,
        now
      );
    }
  }

  // Seed Blog Posts
  const postCount = db.prepare('SELECT COUNT(*) as count FROM blog_posts').get() as { count: number };
  if (postCount.count === 0) {
    const insertPost = db.prepare(`
      INSERT INTO blog_posts (id, title, slug, category, author, read_time, date, excerpt, content, image, status, seo_title, seo_description, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    for (const p of BLOG_POSTS) {
      insertPost.run(
        p.id,
        p.title,
        p.slug,
        p.category,
        p.author,
        p.readTime,
        p.date,
        p.excerpt,
        p.content,
        p.image,
        'published',
        p.title,
        p.excerpt,
        now
      );
    }
  }

  // Seed Payment Settings (Stripe, SEPA, Bank Transfer for permitted merchandise)
  const payCount = db.prepare('SELECT COUNT(*) as count FROM payment_settings').get() as { count: number };
  if (payCount.count === 0) {
    const insertPay = db.prepare(`
      INSERT INTO payment_settings (id, provider, is_enabled, mode, public_key, webhook_secret, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    insertPay.run('pay-stripe', 'Stripe (Credit / Debit / Apple Pay)', 1, 'test', 'pk_test_sample_51O9...canabis', 'whsec_sample_secret', now);
    insertPay.run('pay-sepa', 'SEPA Direct Debit (EU / Germany)', 1, 'production', 'DE89370400440532013000', '', now);
    insertPay.run('pay-bank', 'Direct Bank Wire (IBAN Transfer)', 1, 'production', 'DE44100500001092837465', '', now);
  }

  // Seed a sample order for Demo User
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get() as { count: number };
  if (orderCount.count === 0) {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO orders (id, user_id, order_ref, items_json, subtotal, shipping, total, status, payment_status, payment_method, shipping_address_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'ord-1001',
      'usr-demo-1',
      'CH-2026-89104',
      JSON.stringify([
        {
          id: 'acc-1',
          name: 'German Botanical Violet Glass Curing Jars (3-Pack)',
          price: 34.50,
          quantity: 1,
        },
        {
          id: 'acc-2',
          name: 'Terpene Shield Humidity Packs 62% RH (10-Pack)',
          price: 18.90,
          quantity: 2,
        },
      ]),
      72.30,
      4.90,
      77.20,
      'delivered',
      'paid',
      'stripe',
      JSON.stringify({
        fullName: 'Maximilian Weber',
        address: 'Kantstraße 42',
        city: 'Berlin',
        postalCode: '10625',
        country: 'Germany',
      }),
      now
    );
  }
}

// Auto-run initialization
initDatabase();
