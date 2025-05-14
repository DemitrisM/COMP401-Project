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

/* GET /api/products */
app.get('/api/products', async (_req, res) => {
  const rows = await db.all(`
    SELECT SKUID,
           Name,
           Price,
           '/images/' || Picture AS Picture,   -- ← prepend folder
           Description
    FROM   SKU
    JOIN   PRODUCTS USING (ProdID)
    ORDER  BY SKUID
  `);
  res.json(rows);
});


/* ─────────────────────────────────────────────
   POST /api/cart           { userId? } → returns cartId
────────────────────────────────────────────── */
app.post('/api/cart', async (req, res) => {
  const db = await getDB();
  const { userId = null } = req.body || {};
  const x   = await db.run(
    `INSERT INTO CARTS (UserID) VALUES (?)`,
    userId
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
  const db = await getDB();
  const cartId = +req.params.id;
  const rows = await db.all(`
    SELECT c.SKUID, s.Name, c.Qty, s.Price,
           (c.Qty*s.Price) AS lineTotal, s.Picture
      FROM CARTPRODUCTS c
      JOIN SKU s ON s.SKUID = c.SKUID
     WHERE c.CartID = ?
  `, cartId);
  res.json(rows);
});

  // ───── Start server ───────────────────────────────────────
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
})();
