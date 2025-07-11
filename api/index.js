// ✅ VERIFIED: api/index.js with per-device cartId logic
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

pool.on('error', (err) => console.error('DB pool error:', err.stack));

app.use(cors());
app.use(express.json());

// Fetch products
app.get('/api/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error in /api/products:', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch cart by cartId
app.get('/api/cart', async (req, res) => {
  const { cartId } = req.query;
  if (!cartId) return res.status(400).json({ error: 'cartId is required' });

  try {
    const result = await pool.query('SELECT * FROM cart WHERE cart_id = $1', [cartId]);
    res.json({
      cart: result.rows.map((item) => ({
        productId: item.product_id,
        quantity: item.quantity,
      })),
    });
  } catch (err) {
    console.error('Error in /api/cart:', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add item to cart
app.post('/api/cart', async (req, res) => {
  const { productId, quantity, cartId } = req.body;
  if (!productId || !quantity || !cartId) {
    return res.status(400).json({ error: 'Product ID, quantity, and cartId are required' });
  }

  try {
    await pool.query(
      'INSERT INTO cart (product_id, quantity, cart_id) VALUES ($1, $2, $3)',
      [productId, quantity, cartId]
    );
    res.json({ message: 'Added to cart' });
  } catch (err) {
    console.error('Error in /api/cart:', err.stack);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update cart item quantity
app.post('/api/cart/update', async (req, res) => {
  const { productId, quantity, cartId } = req.body;
  if (!productId || typeof quantity !== 'number' || !cartId) {
    return res.status(400).json({ error: 'Product ID, quantity, and cartId required' });
  }

  try {
    const check = await pool.query(
      'SELECT * FROM cart WHERE product_id = $1 AND cart_id = $2',
      [productId, cartId]
    );

    if (check.rows.length > 0) {
      await pool.query(
        'UPDATE cart SET quantity = $1 WHERE product_id = $2 AND cart_id = $3',
        [quantity, productId, cartId]
      );
    } else {
      await pool.query(
        'INSERT INTO cart (product_id, quantity, cart_id) VALUES ($1, $2, $3)',
        [productId, quantity, cartId]
      );
    }

    res.json({ message: 'Cart updated' });
  } catch (err) {
    console.error('Error updating cart:', err.stack);
    res.status(500).json({ error: 'Failed to update cart' });
  }
});

// Delete item from cart
app.post('/api/cart/delete', async (req, res) => {
  const { productId, cartId } = req.body;
  if (!productId || !cartId) {
    return res.status(400).json({ error: 'Product ID and cartId required' });
  }

  try {
    await pool.query('DELETE FROM cart WHERE product_id = $1 AND cart_id = $2', [productId, cartId]);
    res.json({ message: 'Item deleted from cart' });
  } catch (err) {
    console.error('Error deleting cart item:', err.stack);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// Empty the entire cart
app.post('/api/cart/empty', async (req, res) => {
  const { cartId } = req.body;
  if (!cartId) return res.status(400).json({ error: 'cartId required' });

  try {
    await pool.query('DELETE FROM cart WHERE cart_id = $1', [cartId]);
    res.json({ message: 'Cart emptied' });
  } catch (err) {
    console.error('Error emptying cart:', err.stack);
    res.status(500).json({ error: 'Failed to empty cart' });
  }
});

// Stripe Checkout
app.post('/api/checkout', async (req, res) => {
  const { cartId } = req.body;
  if (!cartId) return res.status(400).json({ error: 'cartId required' });

  try {
    const result = await pool.query(
      'SELECT c.*, p.name, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.cart_id = $1',
      [cartId]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const lineItems = result.rows.map((item) => ({
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
    console.error('Checkout error:', err.stack);
    res.status(500).json({ error: 'Checkout error' });
  }
});

app.get('/', (req, res) => {
  res.send('E-commerce Platform API');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
