import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Enter() {
  const nav = useNavigate();
  const [code, setCode] = useState('');
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setErr(null);
    const r = await fetch('/api/vip/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    });
    const j = await r.json();
    if (j.ok) nav('/vip');
    else setErr(j.reason || 'invalid');
  }

  return (
    <div className="vip-enter">
      <h2>VIP Access</h2>
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter code"
      />
      <button onClick={submit}>Enter</button>
      {err && <div className="error">{err}</div>}
    </div>
  );
}
