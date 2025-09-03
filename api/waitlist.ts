import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const { name, email, instagram, ref } = req.body || {};
  if (!email) return res.status(400).json({ ok: false, reason: 'missing_email' });

  const { error } = await supabase.from('waitlist').insert({
    name: name || null,
    email,
    instagram: instagram || null,
    ref_code: ref || null,
  });
  if (error) return res.status(500).json({ ok: false, reason: 'db_error' });

  res.json({ ok: true });
}
