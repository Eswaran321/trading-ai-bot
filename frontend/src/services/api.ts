import axios from 'axios';
import { 
  MarketItem, 
  OHLCVBar, 
  AIMarketSummary, 
  OpportunitySignal, 
  PortfolioSummary, 
  Order, 
  SystemHealth 
} from '../types';

const API_BASE = '/api/v1';

// Attach JWT Bearer token to all outgoing requests automatically
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('quantai_jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Auth & Session
  login: async (email: string, password: string) => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    return res.data;
  },

  register: async (email: string, password: string, full_name: string) => {
    const res = await axios.post(`${API_BASE}/auth/register`, { email, password, full_name });
    return res.data;
  },

  getMe: async (token: string) => {
    const res = await axios.get(`${API_BASE}/auth/me`, { params: { token } });
    return res.data;
  },

  // System Health
  getHealth: async (): Promise<SystemHealth> => {
    const res = await axios.get(`${API_BASE}/system/health`);
    return res.data;
  },

  // Market Data
  getMarketOverview: async (): Promise<MarketItem[]> => {
    const res = await axios.get(`${API_BASE}/market/overview`);
    return res.data;
  },

  getChartData: async (symbol: string): Promise<{ symbol: string; bars: OHLCVBar[]; latest_price: number }> => {
    const res = await axios.get(`${API_BASE}/market/chart/${encodeURIComponent(symbol)}`);
    return res.data;
  },

  // AI Scanner
  getOpportunities: async (): Promise<OpportunitySignal[]> => {
    const res = await axios.get(`${API_BASE}/scanner/opportunities`);
    return res.data;
  },

  getAISummary: async (): Promise<AIMarketSummary> => {
    const res = await axios.get(`${API_BASE}/scanner/summary`);
    return res.data;
  },

  // Portfolio & Orders
  getPortfolioSummary: async (): Promise<PortfolioSummary> => {
    const res = await axios.get(`${API_BASE}/portfolio/summary`);
    return res.data;
  },

  getOrders: async (): Promise<Order[]> => {
    const res = await axios.get(`${API_BASE}/portfolio/orders`);
    return res.data;
  },

  submitOrder: async (orderReq: {
    symbol: string;
    side: 'BUY' | 'SELL';
    quantity: number;
    price: number;
    stop_loss?: number;
    take_profit?: number;
  }): Promise<Order> => {
    const res = await axios.post(`${API_BASE}/portfolio/orders`, orderReq);
    return res.data;
  },

  updateRiskProfile: async (riskData: Partial<PortfolioSummary['risk_profile']>) => {
    const res = await axios.put(`${API_BASE}/portfolio/risk`, riskData);
    return res.data;
  },

  // AI Assistant
  askAssistant: async (query: string): Promise<{ query: string; response: string; category: string }> => {
    const res = await axios.post(`${API_BASE}/assistant/chat`, { query });
    return res.data;
  }
};
