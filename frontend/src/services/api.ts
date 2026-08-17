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

export const api = {
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
