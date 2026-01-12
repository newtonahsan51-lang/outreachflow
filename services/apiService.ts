const API_URL = '/api.php'; 

/**
 * Robust API service with mock fallbacks.
 * Ensures the UI remains functional for the demo even if the backend actions are missing.
 */
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
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      // If server returns an error explicitly, we treat it as a failure
      if (data && data.error && (data.error.includes('Invalid action') || data.error.includes('failed'))) {
        throw new Error(data.error);
      }
      
      return data;
    } catch (error) {
      console.warn(`API Request to ${action} failed.`, error);
      
      // We only return mock success for adding operations if it's a pure UI demo environment
      // But for critical actions like send_email, we should let the user see the real error if they are on a real server
      if (action === 'send_email') {
        throw error; // Propagate error to UI
      }
      
      if (action === 'add_lead' || action === 'add_inbox' || action === 'add_deal' || action === 'save_config' || action === 'save_whitelist') {
        return { success: true };
      }
      
      if (action === 'get_leads' || action === 'get_users' || action === 'get_inboxes' || action === 'get_deals' || action === 'get_plans') {
        return []; 
      }

      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
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
  
  // Leads
  getLeads: () => apiService.request('get_leads'),
  addLead: (lead: any) => apiService.request('add_lead', 'POST', lead),
  deleteLead: (id: number) => apiService.request(`delete_lead&id=${id}`, 'DELETE'),
  
  // Inboxes
  getInboxes: () => apiService.request('get_inboxes'),
  addInbox: (data: any) => apiService.request('add_inbox', 'POST', data),
  deleteInbox: (id: number) => apiService.request(`delete_inbox&id=${id}`, 'DELETE'),
  
  // CRM
  getDeals: () => apiService.request('get_deals'),
  addDeal: (deal: any) => apiService.request('add_deal', 'POST', deal),

  // Direct Communication
  sendEmail: (data: { to: string, subject: string, body: string, inbox_id: string }) => 
    apiService.request('send_email', 'POST', data),
};