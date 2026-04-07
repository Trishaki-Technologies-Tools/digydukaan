
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

/*
  SECURE MSG91 FLOW PROXY (SEND) - HARDENED VERSION
*/

const AUTH_KEY = process.env.VITE_MSG91_AUTH_KEY;
const TEMPLATE_ID = process.env.VITE_MSG91_TEMPLATE_ID;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { mobile, name } = req.query;

  if (!mobile) return res.status(400).json({ success: false, message: 'Mobile required' });

  const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    // 1. Persist OTP in Supabase
    const { error: dbError } = await supabase.from('otp_verifications').upsert([
      { 
        phone: mobile, 
        otp: generatedOtp, 
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString()
      }
    ], { onConflict: 'phone' });

    if (dbError) {
       console.error('SUPABASE DB ERROR:', dbError);
       return res.status(500).json({ success: false, message: 'Vault Save Error: ' + dbError.message });
    }

    // 2. Dispatch to MSG91 FLOW API
    const flowPayload = {
      template_id: TEMPLATE_ID,
      recipients: [
        {
          mobiles: mobile,
          var1: name || 'Customer',
          var2: generatedOtp
        }
      ]
    };

    const msg91Response = await fetch('https://control.msg91.com/api/v5/flow', {
      method: 'POST',
      headers: {
        'authkey': AUTH_KEY || '',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(flowPayload)
    });

    const data = await msg91Response.json();
    return res.status(200).json({ success: true, message: 'OTP Generated and Sent' });

  } catch (error: any) {
    console.error('System Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
