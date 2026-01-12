
export type LeadStatus = 'Cold' | 'Opened' | 'Replied' | 'Booked';

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  jobTitle: string;
  status: LeadStatus;
  source: string;
  lastActivity: string;
  score: number;
}

export interface CampaignStep {
  id: string;
  type: 'Email' | 'Wait' | 'LinkedIn' | 'SMS';
  content?: string;
  subject?: string;
  delayDays?: number;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
  sent: number;
  opened: number;
  replied: number;
  steps: CampaignStep[];
}

export interface Inbox {
  id: string;
  email: string;
  provider: 'Gmail' | 'Outlook' | 'SMTP';
  isWarmupEnabled: boolean;
  healthScore: number;
  sentToday: number;
  dailyLimit: number;
}
