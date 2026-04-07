
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
      // Point to local/production Vercel serverless function
      const response = await fetch(`/api/send-otp?mobile=${mobile}&name=${encodeURIComponent(name)}`, {
        method: 'POST'
      });
      const data = await response.json();
      
      if (data.type === 'success' || data.success) {
        return { success: true, message: 'OTP sent successfully' };
      } else {
        return { success: false, message: data.message || 'Failed to send OTP' };
      }
    } catch (error) {
      console.error('Proxy Fetch Error:', error);
      return { success: false, message: 'Network error through SMS Proxy' };
    }
  },

  /**
   * Verifies the OTP via the secure Vercel API Proxy.
   */
  async verifyOtp(mobile: string, otp: string) {
    try {
      // Point to local/production Vercel serverless function
      const response = await fetch(`/api/verify-otp?mobile=${mobile}&otp=${otp}`, {
        method: 'POST'
      });
      const data = await response.json();

      if (data.type === 'success' || data.success) {
        return { success: true, message: 'OTP verified successfully' };
      } else {
        return { success: false, message: data.message || 'Invalid OTP' };
      }
    } catch (error) {
      console.error('Proxy Verify Fetch Error:', error);
      return { success: false, message: 'Network error during proxy verification' };
    }
  }
};
