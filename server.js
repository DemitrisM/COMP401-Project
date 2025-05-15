/**
 * server.js – serves files from the project root
 * DB file : dreamweaver_db.sqlite
 * Schema  : dreamweaver_db.sql  (run once)
 */
const getDB = require('./db');   // new helper
const path     = require('path');
const express  = require('express');
const bcrypt   = require('bcrypt');
const sqlite3  = require('sqlite3');
const { open } = require('sqlite');

// ──────────────────────────────────────────────────────────────
// Helper: absolute path to this folder
// ──────────────────────────────────────────────────────────────
const ROOT = __dirname;           // e.g. /home/.../COMP401-Project

// ──────────────────────────────────────────────────────────────
// Async IIFE so we can use await
// ──────────────────────────────────────────────────────────────
(async () => {
  // Open / create SQLite DB
  const db = await open({
    filename: path.join(ROOT, 'dreamweaver_db.sqlite'),
    driver  : sqlite3.Database
  });

  // ───── Express app ─────────────────────────────────────────
  const app = express();
  app.use(express.json());

  /*  Serve ALL static files that live directly in the repo
      (html, css, js, images, etc.)
  */
  app.use(express.static(ROOT));            // ← key change

  // OPTIONAL: if you keep images in /images sub-folder, the line above
  // already serves them, but you can also be explicit:
  // app.use('/images', express.static(path.join(ROOT, 'images')));

  // ───── POST /signup  (buyers + sellers) ────────────────────
  app.post('/signup', async (req, res) => {
    const { username, email, password, role } = req.body || {};

    if (!username || !email || !password ||
        !['CUSTOMER','SELLER'].includes(role)) {
      return res.status(400).send('Bad request');
    }

    const exists = await db.get('SELECT 1 FROM USERS WHERE Email = ?', email);
    if (exists) return res.status(409).send('Email already registered');

    const hash = await bcrypt.hash(password, 10);
    await db.run(
      `INSERT INTO USERS (Email,Password,Username,Role)
       VALUES (?,?,?,?)`,
      email.trim(), hash, username.trim(), role
    );

    res.sendStatus(201);
  });

  // ─── LOGIN route ─────────────────────────────────────────────
app.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).send('Bad request');

  // fetch user row
  const user = await db.get('SELECT * FROM USERS WHERE Email = ?', email.trim());
  if (!user) return res.sendStatus(401); // unknown e-mail

  // compare hashed password
  const ok = await bcrypt.compare(password, user.Password);
  if (!ok) return res.sendStatus(401);

  // success – you could generate a token or just reply 200
  res.json({ role: user.Role, username: user.Username });
});

/* GET /api/products  –  1 row per visible title */
app.get('/api/products', async (_req, res) => {
  const rows = await db.all(`
    SELECT
        MIN(s.SKUID)                AS SKUID,      -- a stable representative
        p.Name,
        MIN(s.Price)                AS Price,      -- choose cheapest variant
        MIN('/images/'||s.Picture)  AS Picture,    -- any picture will do
        MIN(s.Description)          AS Description
    FROM   PRODUCTS p
    JOIN   SKU      s  ON s.ProdID = p.ProdID
    GROUP  BY p.Name                              -- ★ collapse the triples
    ORDER  BY p.Name
  `);
  res.json(rows);
});



/* ─────────────────────────────────────────────
   POST /api/cart           { userId? } → returns cartId
────────────────────────────────────────────── */
app.post('/api/cart', async (req, res) => {
  const db = await getDB();

  /* 1️⃣  pick a valid UserID:
        – if client sent one -> use it
        – otherwise fall back to *demo/guest* user with id 1              */
  const uid = req.body?.userId ?? 1;          // ← Just one added line!

  const x = await db.run(
    `INSERT INTO CARTS (UserID) VALUES (?)`,
    uid
  );
  res.status(201).json({ cartId: x.lastID });
});

/* ─────────────────────────────────────────────
   POST /api/cart/:id/items   { skuId, qty }
────────────────────────────────────────────── */
app.post('/api/cart/:id/items', async (req, res) => {
  const db    = await getDB();
  const cartId = +req.params.id;
  const { skuId, qty = 1 } = req.body || {};

  // upsert line-item
  await db.run(`
    INSERT INTO CARTPRODUCTS (CartID, SKUID, Qty)
         VALUES (?,?,?)
    ON CONFLICT (CartID,SKUID)
       DO UPDATE SET Qty = Qty + excluded.Qty
  `, cartId, skuId, qty);

  // return new total
  const { total } = await db.get(
    `SELECT COALESCE(SUM(Qty),0) AS total
       FROM CARTPRODUCTS
      WHERE CartID=?`,
    cartId
  );
  res.json({ totalQty: total });
});

/* ─────────────────────────────────────────────
   GET /api/cart/:id/items  → all SKUs in cart with pricing
────────────────────────────────────────────── */
app.get('/api/cart/:id/items', async (req, res) => {
  const db     = await getDB();
  const cartId = +req.params.id;

  try {
    const rows = await db.all(`
      SELECT
          c.SKUID,
          p.Name,                    -- ← pull the product name from PRODUCTS
          c.Qty,
          s.Price,
          (c.Qty * s.Price) AS lineTotal,
          '/images/' || s.Picture    AS Picture
      FROM   CARTPRODUCTS  c
      JOIN   SKU           s ON s.SKUID  = c.SKUID
      JOIN   PRODUCTS      p ON p.ProdID = s.ProdID
      WHERE  c.CartID = ?
    `, cartId);

    res.json(rows);
  } catch (err) {
    console.error('Cart query error\n', err);
    res.sendStatus(500);
  }
});


  // ───── Start server ───────────────────────────────────────
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
})();
