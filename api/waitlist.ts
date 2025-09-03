import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return res.status(500).json({ ok: false, reason: 'missing_env', missing: {
      NEXT_PUBLIC_SUPABASE_URL: !!url, 
      SUPABASE_ANON_KEY: !!anon
    }});
  }
  const supabase = createClient(url, anon);

  const { name, email, instagram, ref } = (req.body || {}) as any;
  if (!email) return res.status(400).json({ ok: false, reason: 'missing_email' });

  const { error } = await supabase.from('waitlist').insert({
    name: name || null,
    email,
    instagram: instagram || null,
    ref_code: ref || null,
  });
  if (error) return res.status(500).json({ ok: false, reason: 'db_error', detail: error.message });

  return res.json({ ok: true });
}
