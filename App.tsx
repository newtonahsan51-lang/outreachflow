
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './views/Dashboard';
import Leads from './views/Leads';
import Campaigns from './views/Campaigns';
import AIWriter from './views/AIWriter';
import Inboxes from './views/Inboxes';
import CRM from './views/CRM';
import { AuthView } from './views/Auth';
import Templates from './views/Templates';
import Sequences from './views/Sequences';
import Analytics from './views/Analytics';
import Deliverability from './views/Deliverability';
import Team from './views/Team';
import Billing from './views/Billing';
import Settings from './views/Settings';
import Integrations from './views/Integrations';
import AdminPanel from './views/AdminPanel';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <AuthView mode="login" onAuthComplete={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/inboxes" element={<Inboxes />} />
          <Route path="/ai-writer" element={<AIWriter />} />
          <Route path="/crm" element={<CRM />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/sequences" element={<Sequences />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/deliverability" element={<Deliverability />} />
          <Route path="/team" element={<Team />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
