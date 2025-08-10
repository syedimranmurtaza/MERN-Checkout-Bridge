import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import checkout from './routes/checkout.js';
import order from './routes/order.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin, credentials: true }));

// very important, but we will preserve raw body later when we sign
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, site_id: process.env.SITE_ID });
});

app.post('/api/checkout/verify', checkout);
app.post('/api/order/confirm', order);

app.listen(PORT, () => {
  console.log(`Delta MERN server listening on http://localhost:${PORT}`);
});
