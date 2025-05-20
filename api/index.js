const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('Database pool error:', err.stack);
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Connected to Neon PostgreSQL');
  release();
});

app.use(cors());
app.use(express.json());

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error in /api/products:', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/cart', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cart');
    console.log('GET /api/cart:', result.rows);
    res.json({ cart: result.rows.map(item => ({ productId: item.product_id, quantity: item.quantity })) });
  } catch (err) {
    console.error('Error in /api/cart:', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/cart', async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res.status(400).json({ error: 'Product ID and quantity required' });
  }
  try {
    await pool.query('INSERT INTO cart (product_id, quantity) VALUES ($1, $2)', [productId, quantity]);
    const result = await pool.query('SELECT * FROM cart');
    console.log('POST /api/cart:', result.rows);
    res.json({ message: 'Added to cart', cart: result.rows.map(item => ({ productId: item.product_id, quantity: item.quantity })) });
  } catch (err) {
    console.error('Error in /api/cart:', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/checkout', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cart');
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    const order = { items: result.rows.map(item => ({ productId: item.product_id, quantity: item.quantity })), timestamp: new Date() };
    await pool.query('DELETE FROM cart');
    console.log('POST /api/checkout:', order);
    res.json({ message: 'Checkout successful', order });
  } catch (err) {
    console.error('Error in /api/checkout:', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.send('E-commerce Platform API');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});