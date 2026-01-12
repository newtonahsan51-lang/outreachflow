const API_URL = '/api.php'; 

export const apiService = {
  async request(action: string, method: string = 'GET', body: any = null) {
    const url = `${API_URL}?action=${action}`;
    const options: RequestInit = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };
    if (body) options.body = JSON.stringify(body);
    
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('API request failed');
      return await response.json();
    } catch (error) {
      console.error(`API Error (${action}):`, error);
      throw error;
    }
  },

  // Users
  getUsers: () => apiService.request('get_users'),
  updateUserStatus: (id: number, status: string) => apiService.request('update_user_status', 'POST', { id, status }),
  deleteUser: (id: number) => apiService.request(`delete_user&id=${id}`, 'DELETE'),

  // Config & Security
  getConfig: () => apiService.request('get_config'),
  saveConfig: (config: any) => apiService.request('save_config', 'POST', config),
  getWhitelist: () => apiService.request('get_whitelist'),
  saveWhitelist: (ips: string[]) => apiService.request('save_whitelist', 'POST', ips),

  // Logs
  getLogs: () => apiService.request('get_logs'),
  addLog: (log: any) => apiService.request('add_log', 'POST', log),

  // Plans
  getPlans: () => apiService.request('get_plans'),
  
  // Leads & Campaigns
  getLeads: () => apiService.request('get_leads'),
  
  // Inboxes
  getInboxes: () => apiService.request('get_inboxes'),
  
  // CRM
  getDeals: () => apiService.request('get_deals'),
  addDeal: (deal: any) => apiService.request('add_deal', 'POST', deal),
};
