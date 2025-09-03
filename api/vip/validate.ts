import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return res.status(500).json({ ok: false, reason: 'missing_env', missing: {
      NEXT_PUBLIC_SUPABASE_URL: !!url, 
      SUPABASE_SERVICE_ROLE_KEY: !!key
    }});
  }
  const supabase = createClient(url, key);

  const { code } = (req.body || {}) as { code?: string };
  if (!code) return res.status(400).json({ ok: false, reason: 'missing_code' });

  const { data, error } = await supabase
    .from('vip_passes')
    .select('code,active,expires_at')
    .eq('code', String(code))
    .single();

  if (error || !data) return res.status(404).json({ ok: false, reason: 'invalid' });
  const expired = data.expires_at && new Date(data.expires_at) < new Date();
  if (!data.active || expired) return res.status(403).json({ ok: false, reason: 'inactive' });

  return res.json({ ok: true });
}
