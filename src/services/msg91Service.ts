
/* 
  MSG91 SMS SERVICE BRIDGE (SECURE PROXY VERSION)
  Calls local /api endpoints to bypass CORS and protect AuthKeys.
*/

export const msg91Service = {
  /**
   * Sends an OTP via the secure Vercel API Proxy.
   */
  async sendOtp(mobile: string, name: string = 'Customer') {
    try {
      const isDev = import.meta.env.DEV;
      const response = await fetch(`/api/send-otp?mobile=${mobile}&name=${encodeURIComponent(name)}`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        // Fallback for local development when vercel dev is NOT running
        if (isDev && (response.status === 502 || response.status === 404)) {
          console.warn('--- DEV MODE OTP FALLBACK ---');
          console.log(`To: ${mobile}`);
          console.log(`Message: Hello ${name}, your mock OTP is 1234. (No SMS was actually sent)`);
          console.warn('To test real SMS, run "vercel dev" instead of "npm run dev".');
          return { success: true, message: 'OTP sent (Dev Mock)' };
        }

        if (response.status === 404) {
          return { success: false, message: 'SMS Proxy not found. Are you running "vercel dev"?' };
        }
        return { success: false, message: `Proxy Error (${response.status})` };
      }

      const data = await response.json();
      if (data.type === 'success' || data.success) {
        return { success: true, message: 'OTP sent successfully' };
      } else {
        return { success: false, message: data.message || 'Failed to send OTP' };
      }
    } catch (error) {
      console.error('Proxy Fetch Error:', error);
      // Even if network fails entirely, allow mock in dev
      if (import.meta.env.DEV) {
          return { success: true, message: 'OTP sent (Mock - Network Error)' };
      }
      return { success: false, message: 'Network error through SMS Proxy' };
    }
  },

  /**
   * Verifies the OTP via the secure Vercel API Proxy.
   */
  async verifyOtp(mobile: string, otp: string) {
    try {
      const isDev = import.meta.env.DEV;
      const response = await fetch(`/api/verify-otp?mobile=${mobile}&otp=${otp}`, {
        method: 'POST'
      });

      if (!response.ok) {
        if (isDev && (response.status === 502 || response.status === 404)) {
            // In dev mode, if we used the mock 1234, verify it
            if (otp === '1234') return { success: true, message: 'Verified (Dev Mock)' };
            return { success: false, message: 'Invalid OTP (Mock expects 1234)' };
        }
        return { success: false, message: `Proxy Error (${response.status})` };
      }

      const data = await response.json();

      if (data.type === 'success' || data.success) {
        return { success: true, message: 'OTP verified successfully' };
      } else {
        return { success: false, message: data.message || 'Invalid OTP' };
      }
    } catch (error) {
      console.error('Proxy Verify Fetch Error:', error);
      if (import.meta.env.DEV && otp === '1234') {
          return { success: true, message: 'Verified (Mock - Network Error)' };
      }
      return { success: false, message: 'Network error during proxy verification' };
    }
  }
};
