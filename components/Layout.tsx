
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Send, Mail, FileText, 
  Workflow, Sparkles, Kanban, BarChart3, Users2, 
  Settings, CreditCard, LogOut, Menu, X, Sun, Moon,
  Layers, ChevronRight, Search, Bell, ShieldAlert,
  ShieldCheck, Activity
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, active }: any) => (
  <Link 
    to={path}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
      active 
      ? 'bg-blue-600 text-white shadow-sm' 
      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
    }`}
  >
    <Icon size={18} />
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Users, label: 'Leads', path: '/leads' },
    { icon: Send, label: 'Campaigns', path: '/campaigns' },
    { icon: Mail, label: 'Inboxes', path: '/inboxes' },
    { icon: FileText, label: 'Templates', path: '/templates' },
    { icon: Workflow, label: 'Sequences', path: '/sequences' },
    { icon: Sparkles, label: 'AI Writer', path: '/ai-writer' },
    { icon: Kanban, label: 'CRM', path: '/crm' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: ShieldCheck, label: 'Deliverability', path: '/deliverability' },
    { icon: Users2, label: 'Team', path: '/team' },
    { icon: Layers, label: 'Integrations', path: '/integrations' },
    { icon: CreditCard, label: 'Billing', path: '/billing' },
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: ShieldAlert, label: 'Control Center', path: '/admin' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">O</div>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">OutreachFlow</span>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
            {navItems.map((item) => (
              <SidebarItem 
                key={item.path}
                {...item} 
                active={location.pathname === item.path}
              />
            ))}
          </nav>

          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => {}} 
              className="flex items-center gap-3 w-full px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <LogOut size={18} />
              <span className="font-medium text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2 text-slate-500">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 w-64">
              <Search size={16} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search leads, campaigns..." 
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-600 dark:text-slate-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-none">Alex Rivera</p>
                <p className="text-xs text-slate-500 mt-1">Growth Agency</p>
              </div>
              <img 
                src="https://picsum.photos/seed/alex/40/40" 
                alt="User" 
                className="w-9 h-9 rounded-full border border-slate-200 dark:border-slate-700"
              />
            </div>
          </div>
        </header>

        <div className="p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </main>
    </div>
  );
};
