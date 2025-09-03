import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    return res.json({ 
      ok: true, 
      env_check: {
        has_url: !!url,
        has_key: !!key,
        url_preview: url ? url.substring(0, 30) + '...' : 'missing'
      }
    });
  } catch (error: any) {
    return res.status(500).json({ 
      ok: false, 
      error: error.message,
      stack: error.stack 
    });
  }
}