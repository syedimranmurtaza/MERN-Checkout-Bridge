import axios from 'axios';
import dotenv from 'dotenv';
import { signWithPrivateKey, uuid } from '../lib/crypto.js';

dotenv.config();

export default async function confirmOrder(req, res) {
  try {
    const { orderId, orderKey, callback_url, return_url, answers } = req.body || {};
    if (!orderId || !orderKey || !callback_url || !return_url) {
      return res.status(400).json({ ok:false, error:'missing_fields' });
    }

    const body = {
      v: '1.0',
      site_id: process.env.SITE_ID,
      order_id: Number(orderId),
      payment_status: 'paid',            // success signal the plugin expects
      transaction_id: 'gw_' + Date.now(),
      amount_captured: undefined,        // optionally set a string like "64.00"
      ts: Math.floor(Date.now()/1000),
      nonce: uuid(),
      event_id: uuid(),
      meta: { answers: answers || null }
    };

    // remove undefined keys so JSON is stable
    Object.keys(body).forEach(k => body[k] === undefined && delete body[k]);

    const raw = JSON.stringify(body);
    const signature = signWithPrivateKey(raw);

    const resp = await axios.post(callback_url, raw, {
      headers: {
        'Content-Type': 'application/json',
        'X-Delta-Signature': signature,
        'X-Delta-Key-Id': 'k1'
      },
      transformRequest: v => v,  // do not reserialize, sign the exact same string
      timeout: 15000,
      validateStatus: s => s >= 200 && s < 300
    });

    // Build thank you URL
    const u = new URL(return_url);
    u.searchParams.set('delta_return', '1');
    u.searchParams.set('order', String(orderId));
    u.searchParams.set('key', String(orderKey));

    return res.json({ ok:true, wp: resp.data, redirect: u.toString() });
  } catch (e) {
    console.error('confirm error', e?.response?.status, e?.response?.data || e.message);
    return res.status(500).json({ ok:false, error:'confirm_failed', detail: e?.response?.data || e.message });
  }
}
