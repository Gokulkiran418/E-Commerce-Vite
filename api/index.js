const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const Stripe = require('stripe');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

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
    const result = await pool.query('SELECT cart.*, products.name, products.price FROM cart JOIN products ON cart.product_id = products.id');
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const lineItems = result.rows.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/checkout?canceled=true`,
    });

    res.json({ sessionId: session.id });
  } catch (err) {
    console.error('Error in /api/checkout:', err.stack);
    res.status(500).json({ error: 'Checkout error' });
  }
});

app.post('/api/cart/empty', async (req, res) => {
  try {
    await pool.query('DELETE FROM cart');
    res.json({ message: 'Cart emptied successfully' });
  } catch (err) {
    console.error('Error emptying cart:', err.stack);
    res.status(500).json({ error: 'Failed to empty cart' });
  }
});

app.get('/', (req, res) => {
  res.send('E-commerce Platform API');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
