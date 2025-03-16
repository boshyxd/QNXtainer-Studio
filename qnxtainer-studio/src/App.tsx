import React, { useState, useEffect } from 'react';
import './App.css';
import { ThemeProvider } from '@/lib/theme-provider';
import { ApiProvider } from '@/lib/api-provider';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import ContainersView from '@/components/containers/ContainersView';
import DiagnosticsView from '@/components/diagnostics/DiagnosticsView';
import ImagesView from '@/components/images/ImagesView';
import NetworksView from '@/components/networks/NetworksView';
import VolumesView from '@/components/volumes/VolumesView';
import TitleBar from '@/components/TitleBar';

const isElectron = typeof window !== 'undefined' && window.electron !== undefined;

type View = 'containers' | 'images' | 'networks' | 'volumes' | 'diagnostics';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('containers');

  useEffect(() => {
    if (isElectron && window.electron) {
      window.electron.receive('navigate', (view: string) => {
        if (view === 'containers' || view === 'images' || 
                  view === 'networks' || view === 'volumes' || 
                  view === 'diagnostics') {
          setCurrentView(view as View);
        }
      });
    }
  }, []);

  const handleNavigate = (view: 'dashboard') => {
    setCurrentView('containers');
  };

  const renderView = () => {
    switch (currentView) {
      case 'containers':
        return <ContainersView />;
      case 'diagnostics':
        return <DiagnosticsView />;
      case 'images':
        return <ImagesView />;
      case 'networks':
        return <NetworksView />;
      case 'volumes':
        return <VolumesView />;
      default:
        return <ContainersView />;
    }
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <ApiProvider>
        <div className="min-h-screen h-screen bg-background text-foreground flex flex-col">
          {isElectron && <TitleBar />}
          <div className="flex flex-1 overflow-hidden">
            <Sidebar currentView={currentView} onNavigate={setCurrentView} showTitle={!isElectron} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header onNavigate={handleNavigate} showTitle={isElectron} />
              <main className="flex-1 overflow-auto">
                {renderView()}
              </main>
            </div>
          </div>
        </div>
      </ApiProvider>
    </ThemeProvider>
  );
};

export default App;