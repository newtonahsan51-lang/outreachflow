
/**
 * apiService handles communication with the backend (api.php).
 * Optimized to send 'action' in both URL and Body for maximum PHP compatibility.
 */
const request = async (action: string, data?: any) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout for scans

  try {
    // 1. Prepare URL with action as query param (Standard for many PHP routers)
    const url = `/api.php?action=${action}`;
    
    // 2. Prepare Form Data (application/x-www-form-urlencoded)
    const params = new URLSearchParams();
    params.append('action', action);
    
    if (data) {
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          // Flatten objects/arrays for PHP compatibility
          const val = typeof data[key] === 'object' ? JSON.stringify(data[key]) : data[key];
          params.append(key, val);
        }
      });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString(),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    const text = await response.text();
    
    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      // Fallback for simple success messages from PHP
      if (text.toLowerCase().includes('success') || text.trim() === '1') {
        return { success: true };
      }
      return { success: true, message: text };
    }

    if (result && result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Request timed out. The server is taking too long to respond.");
    }
    console.error(`API Request Failure (${action}):`, error);
    throw error;
  }
};

export const apiService = {
  getUsers: () => request('get_users'),
  updateUserStatus: (id: number, status: string) => request('update_user_status', { id, status }),
  deleteUser: (id: number) => request('delete_user', { id }),
  getInboxes: () => request('get_inboxes'),
  addInbox: (data: any) => request('add_inbox', data),
  deleteInbox: (id: number) => request('delete_inbox', { id }),
  getLeads: () => request('get_leads'),
  addLead: (data: any) => request('add_lead', data),
  deleteLead: (id: number) => request('delete_lead', { id }),
  getDeals: () => request('get_deals'),
  addDeal: (data: any) => request('add_deal', data),
  getLogs: () => request('get_logs'),
  addLog: (data: any) => request('add_log', data),
  getPlans: () => request('get_plans'),
  getConfig: () => request('get_config'),
  saveConfig: (data: any) => request('save_config', data),
  getWhitelist: () => request('get_whitelist'),
  saveWhitelist: (ips: string[]) => request('save_whitelist', { ips }),
  getIntegrations: () => request('get_integrations'),
  connectIntegration: (id: string) => request('connect_integration', { id }),
  disconnectIntegration: (id: string) => request('disconnect_integration', { id }),
  sendEmail: (data: any) => request('send_email', data),
  checkBlacklist: () => request('check_blacklist'),
};
