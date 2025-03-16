import React from 'react';
import { Button } from '@/components/ui/button';

type View = 'containers' | 'images' | 'networks' | 'volumes' | 'diagnostics';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  showTitle?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, showTitle = true }) => {
  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      {showTitle && (
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-bold text-qnx">QNXtainer</h1>
        </div>
      )}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Button
              variant={currentView === 'containers' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onNavigate('containers')}
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Containers
            </Button>
          </li>
          <li>
            <Button
              variant={currentView === 'images' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onNavigate('images')}
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Images
            </Button>
          </li>
          <li>
            <Button
              variant={currentView === 'networks' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onNavigate('networks')}
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 2H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 22H5a2 2 0 0 1-2-2v-4m6 6h10a2 2 0 0 0 2-2v-4" />
              </svg>
              Networks
            </Button>
          </li>
          <li>
            <Button
              variant={currentView === 'volumes' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onNavigate('volumes')}
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              Volumes
            </Button>
          </li>
          <li>
            <Button
              variant={currentView === 'diagnostics' ? 'default' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onNavigate('diagnostics')}
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              Diagnostics
            </Button>
          </li>
        </ul>
      </nav>
      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p>QNXtainer v0.1.0</p>
          <p>QNX Neutrino RTOS</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 