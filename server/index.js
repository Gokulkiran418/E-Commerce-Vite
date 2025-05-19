const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
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

let cart = [];

app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (err) {
    console.error(err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/cart', (req, res) => {
  res.json({ cart });
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res.status(400).json({ error: 'Product ID and quantity required' });
  }
  cart.push({ productId, quantity });
  res.json({ message: 'Added to cart', cart });
});

app.post('/api/checkout', (req, res) => {
  if (cart.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }
  const order = { items: cart, timestamp: new Date() };
  cart = [];
  res.json({ message: 'Checkout successful', order });
});

app.get('/', (req, res) => {

});



app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});