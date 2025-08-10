import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function App() {
  const [payload, setPayload] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [orderKey, setOrderKey] = useState('');
  const [form, setForm] = useState({ q1:'Yes', q2:'Yes', q3:'Yes', q4:'Yes' });
  const API = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const payloadB64 = p.get('payload');
    const sig = p.get('sig');
    const site = p.get('site');

    async function run() {
      try {
        const r = await axios.post(`${API}/api/checkout/verify`, { payloadB64, sig, siteId: site });
        setPayload(r.data.payload);
        setOrderId(r.data.payload?.order?.id);
        setOrderKey(r.data.payload?.order?.key);
      } catch (e) {
        console.error('verify failed', e?.response?.data || e.message);
        alert('Error verifying checkout. See console.');
      }
    }
    run();
  }, []);

  function onChange(e){ setForm({ ...form, [e.target.name]: e.target.value }); }

  async function onSubmit(e){
    e.preventDefault();
    try {
      const r = await axios.post(`${API}/api/order/confirm`, {
        orderId, orderKey,
        callback_url: payload.callback_url,
        return_url: payload.return_url,
        answers: form
      });
      if (r.data?.ok && r.data?.redirect) {
        location.href = r.data.redirect;
      } else {
        alert('Unexpected response: ' + JSON.stringify(r.data));
      }
    } catch (e) {
      console.error('confirm error', e?.response?.data || e.message);
      alert('Error confirming order. Check console for details.');
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '40px auto', fontFamily: 'system-ui, Arial' }}>
      <h2>Answer the following questions:</h2>
      <form onSubmit={onSubmit}>
        {['q1','q2','q3','q4'].map((q,i) => (
          <div key={q} style={{ marginBottom: 12 }}>
            <div>Question {i+1}?</div>
            <label><input type="radio" name={q} value="Yes" checked={form[q]==='Yes'} onChange={onChange}/> Yes</label>{' '}
            <label><input type="radio" name={q} value="No"  checked={form[q]==='No'}  onChange={onChange}/> No</label>
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>

      {orderId && (
        <div style={{ marginTop: 20, color:'#555' }}>
          <div><strong>Order:</strong> {orderId}</div>
          <div><strong>Key:</strong> {orderKey}</div>
        </div>
      )}
    </div>
  );
}
