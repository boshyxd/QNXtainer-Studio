import React, { useState } from 'react';
import './App.css';
import Header from '@/components/Header';
import Dashboard from '@/components/dashboard/Dashboard';
import CreateContainer from '@/components/dashboard/CreateContainer';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'create'>('dashboard');

  const handleNavigate = (view: 'dashboard' | 'create') => {
    setCurrentView(view);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={handleNavigate} />
      <main className="pt-4">
        {currentView === 'dashboard' ? (
          <Dashboard />
        ) : (
          <CreateContainer />
        )}
      </main>
    </div>
  );
};

export default App;