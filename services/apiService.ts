
const API_URL = '/api.php'; // Set relative path for CPanel

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

  // Config
  getConfig: () => apiService.request('get_config'),
  saveConfig: (config: any) => apiService.request('save_config', 'POST', config),

  // Logs
  getLogs: () => apiService.request('get_logs'),
  addLog: (log: any) => apiService.request('add_log', 'POST', log),

  // Plans
  getPlans: () => apiService.request('get_plans'),
  
  // Whitelist
  getWhitelist: () => apiService.request('get_whitelist'),
};
