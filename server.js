/**
 * server.js – serves files from the project root
 * DB file : dreamweaver_db.sqlite
 * Schema  : dreamweaver_db.sql  (run once)
 */

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

  // ───── Start server ───────────────────────────────────────
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
  );
})();
