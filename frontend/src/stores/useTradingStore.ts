import { create } from 'zustand';
import { 
  MarketItem, 
  OHLCVBar, 
  AIMarketSummary, 
  OpportunitySignal, 
  PortfolioSummary, 
  Order, 
  SystemHealth 
} from '../types';
import { api } from '../services/api';

interface TradingState {
  activeTab: 'dashboard' | 'scanner' | 'builder' | 'backtest' | 'portfolio' | 'health';
  selectedSymbol: string;
  chartBars: OHLCVBar[];
  marketItems: MarketItem[];
  aiSummary: AIMarketSummary | null;
  opportunities: OpportunitySignal[];
  portfolio: PortfolioSummary | null;
  orders: Order[];
  systemHealth: SystemHealth | null;
  isAssistantOpen: boolean;
  assistantMessages: Array<{ sender: 'user' | 'ai'; text: string; time: string }>;
  loading: boolean;
  error: string | null;

  setActiveTab: (tab: TradingState['activeTab']) => void;
  setSelectedSymbol: (symbol: string) => void;
  toggleAssistant: () => void;
  fetchMarketData: () => Promise<void>;
  fetchChartData: (symbol: string) => Promise<void>;
  fetchPortfolio: () => Promise<void>;
  fetchOpportunities: () => Promise<void>;
  fetchHealth: () => Promise<void>;
  toggleKillSwitch: () => Promise<void>;
  sendAssistantQuery: (query: string) => Promise<void>;
  submitPaperOrder: (order: { symbol: string; side: 'BUY' | 'SELL'; quantity: number; price: number; stop_loss?: number }) => Promise<Order>;
}

export const useTradingStore = create<TradingState>((set, get) => ({
  activeTab: 'dashboard',
  selectedSymbol: 'RELIANCE.NS',
  chartBars: [],
  marketItems: [],
  aiSummary: null,
  opportunities: [],
  portfolio: null,
  orders: [],
  systemHealth: null,
  isAssistantOpen: false,
  assistantMessages: [
    {
      sender: 'ai',
      text: 'Hello! I am your AI Trading Assistant. Ask me about market regime, signal explanations, risk rejections, or high momentum setups.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ],
  loading: false,
  error: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedSymbol: async (symbol) => {
    set({ selectedSymbol: symbol });
    await get().fetchChartData(symbol);
  },

  toggleAssistant: () => set((state) => ({ isAssistantOpen: !state.isAssistantOpen })),

  fetchMarketData: async () => {
    try {
      set({ loading: true });
      const [items, summary] = await Promise.all([
        api.getMarketOverview(),
        api.getAISummary()
      ]);
      set({ marketItems: items, aiSummary: summary, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  fetchChartData: async (symbol) => {
    try {
      const data = await api.getChartData(symbol);
      set({ chartBars: data.bars });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  fetchPortfolio: async () => {
    try {
      const [pSummary, pOrders] = await Promise.all([
        api.getPortfolioSummary(),
        api.getOrders()
      ]);
      set({ portfolio: pSummary, orders: pOrders });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  fetchOpportunities: async () => {
    try {
      const opps = await api.getOpportunities();
      set({ opportunities: opps });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  fetchHealth: async () => {
    try {
      const health = await api.getHealth();
      set({ systemHealth: health });
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  toggleKillSwitch: async () => {
    const curr = get().portfolio?.risk_profile.emergency_kill_switch;
    await api.updateRiskProfile({ emergency_kill_switch: !curr });
    await get().fetchPortfolio();
  },

  sendAssistantQuery: async (query) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    set((state) => ({
      assistantMessages: [...state.assistantMessages, { sender: 'user', text: query, time: timeStr }]
    }));

    try {
      const res = await api.askAssistant(query);
      set((state) => ({
        assistantMessages: [...state.assistantMessages, { sender: 'ai', text: res.response, time: timeStr }]
      }));
    } catch (err: any) {
      set((state) => ({
        assistantMessages: [...state.assistantMessages, { sender: 'ai', text: 'Error processing assistant query.', time: timeStr }]
      }));
    }
  },

  submitPaperOrder: async (orderReq) => {
    const res = await api.submitOrder(orderReq);
    await get().fetchPortfolio();
    return res;
  }
}));
