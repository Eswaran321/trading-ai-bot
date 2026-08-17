import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { LoginModal } from './components/LoginModal';
import { useTradingStore } from './stores/useTradingStore';

import { DashboardPage } from './pages/DashboardPage';
import { ScannerPage } from './pages/ScannerPage';
import { BuilderPage } from './pages/BuilderPage';
import { BacktestPage } from './pages/BacktestPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { HealthPage } from './pages/HealthPage';

export const App: React.FC = () => {
  const { 
    activeTab, 
    selectedSymbol, 
    initAuth,
    fetchMarketData, 
    fetchChartData, 
    fetchPortfolio, 
    fetchOpportunities, 
    fetchHealth 
  } = useTradingStore();

  useEffect(() => {
    // Initial user auth & data load
    initAuth();
    fetchMarketData();
    fetchChartData(selectedSymbol);
    fetchPortfolio();
    fetchOpportunities();
    fetchHealth();

    // Polling ticker loop every 10 seconds for real-time responsiveness
    const interval = setInterval(() => {
      fetchMarketData();
      fetchChartData(selectedSymbol);
      fetchPortfolio();
    }, 10000);

    return () => clearInterval(interval);
  }, [selectedSymbol]);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans">
      
      {/* Header Bar */}
      <Header />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-6">
        {activeTab === 'dashboard' && <DashboardPage />}
        {activeTab === 'scanner' && <ScannerPage />}
        {activeTab === 'builder' && <BuilderPage />}
        {activeTab === 'backtest' && <BacktestPage />}
        {activeTab === 'portfolio' && <PortfolioPage />}
        {activeTab === 'health' && <HealthPage />}
      </main>

      {/* Sliding AI Research Assistant Drawer */}
      <AIAssistantDrawer />

      {/* Valued User Login Session Modal */}
      <LoginModal />

    </div>
  );
};

export default App;
