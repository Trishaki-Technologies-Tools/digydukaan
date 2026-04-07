
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/*
  SECURE MSG91 FLOW PROXY (VERIFY)
  Checks the generated OTP against the Supabase otp_verifications table.
*/

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { mobile, otp } = req.query;

  if (!mobile || !otp) {
    return res.status(400).json({ success: false, message: 'Mobile and OTP required' });
  }

  try {
    // 1. Fetch OTP record from Supabase
    const { data, error } = await supabase
       .from('otp_verifications')
       .select('*')
       .eq('phone', mobile)
       .single();

    if (error || !data) {
       return res.status(401).json({ success: false, message: 'No OTP record found' });
    }

    // 2. Check Expiry
    if (new Date(data.expires_at) < new Date()) {
       return res.status(401).json({ success: false, message: 'OTP Expired' });
    }

    // 3. Verify OTP
    if (data.otp === otp) {
       // Match! Delete the record (one-time use)
       await supabase.from('otp_verifications').delete().eq('phone', mobile);
       return res.status(200).json({ success: true, message: 'Verified' });
    } else {
       return res.status(401).json({ success: false, message: 'Invalid OTP code' });
    }
  } catch (error) {
    console.error('Verify Proxy Error:', error);
    return res.status(500).json({ success: false, message: 'Verification error' });
  }
}
