import dotenv from 'dotenv';
import { b64urlToUtf8, hmacHex } from '../lib/crypto.js';

dotenv.config();

export default function checkoutVerify(req, res) {
  try {
    const { payloadB64, sig, siteId } = req.body || {};

    if (!payloadB64 || !sig || !siteId) {
      return res.status(400).json({ ok:false, error: 'missing_params' });
    }
    if (siteId !== process.env.SITE_ID) {
      return res.status(400).json({ ok:false, error: 'wrong_site' });
    }

    const rawJson = b64urlToUtf8(payloadB64);
    const expected = hmacHex(rawJson, process.env.SITE_SECRET);

    if (!Buffer.from(expected, 'hex').equals(Buffer.from(sig, 'hex'))) {
      return res.status(400).json({ ok:false, error: 'bad_sig' });
    }

    const data = JSON.parse(rawJson);
    return res.json({ ok:true, payload: data });
  } catch (e) {
    console.error('verify error', e);
    return res.status(500).json({ ok:false, error:'server_error' });
  }
}
