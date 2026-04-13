
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/*
  SECURE MSG91 FLOW PROXY (VERIFY) - PRODUCTION HARDENED
*/

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Setup
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { mobile, otp } = req.query;

  // 1. Check for Config instantly
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return res.status(500).json({ success: false, message: 'Configuration error: Vercel Environment Variables Not Found.' });
  }

  if (!mobile || !otp) {
    return res.status(400).json({ success: false, message: 'Mobile and OTP required' });
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // 2. Fetch OTP record
    const { data, error } = await supabase
       .from('otp_verifications')
       .select('*')
       .eq('phone', mobile)
       .maybeSingle();

    if (error || !data) {
       return res.status(401).json({ success: false, message: 'Invalid or Expired OTP record found' });
    }

    if (new Date(data.expires_at) < new Date()) {
       return res.status(401).json({ success: false, message: 'OTP code has expired' });
    }

    // 3. Match
    if (data.otp === otp) {
       await supabase.from('otp_verifications').delete().eq('phone', mobile);
       return res.status(200).json({ success: true, message: 'Verified successfully' });
    } else {
       return res.status(401).json({ success: false, message: 'Incorrect OTP code entered' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Verification system error' });
  }
}
