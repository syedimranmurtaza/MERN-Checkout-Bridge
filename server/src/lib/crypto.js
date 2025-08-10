import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();
export function b64urlToUtf8(b64u) {
  const b64 = (b64u || '').replace(/-/g, '+').replace(/_/g, '/');
  return Buffer.from(b64, 'base64').toString('utf8');
}

export function hmacHex(raw, secret) {
  return crypto.createHmac('sha256', secret).update(raw).digest('hex');
}

export function signWithPrivateKey(rawString) {
  const keyPath = path.resolve(process.env.RSA_PRIVATE_KEY_PATH || './keys/private.pem');
  const pem = fs.readFileSync(keyPath, 'utf8');
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(rawString);
  signer.end();
  return signer.sign(pem).toString('base64');
}

export function uuid() {
  return crypto.randomUUID();
}
