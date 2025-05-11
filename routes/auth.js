const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const db       = require('../models');

const router = express.Router();
const JWT_SECRET = 'super1secret!';   // move to .env later

// ---------- REGISTER ----------
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;    // role = CUSTOMER | ADMIN
    if (!['CUSTOMER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const exists = await db.User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: 'Email in use' });

    const hash = bcrypt.hashSync(password, 10);
    await db.User.create({ username, email, passwordHash: hash, role });

    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- LOGIN ----------
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await db.User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Bad credentials' });

  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'Bad credentials' });

  const token = jwt.sign(
    { id: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
  res.json({ token, role: user.role, username: user.username });
});

module.exports = router;
