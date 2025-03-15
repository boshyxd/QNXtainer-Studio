import React, { useState } from 'react';
import './App.css';
import { ThemeProvider } from '@/lib/theme-provider';
import Sidebar from '@/components/Sidebar';
import ContainersView from '@/components/containers/ContainersView';
import DiagnosticsView from '@/components/diagnostics/DiagnosticsView';
import ImagesView from '@/components/images/ImagesView';
import NetworksView from '@/components/networks/NetworksView';
import VolumesView from '@/components/volumes/VolumesView';

type View = 'containers' | 'images' | 'networks' | 'volumes' | 'diagnostics';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('containers');

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
      <div className="min-h-screen bg-background text-foreground flex">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />
        <main className="flex-1 overflow-auto">
          {renderView()}
        </main>
      </div>
    </ThemeProvider>
  );
};

export default App;