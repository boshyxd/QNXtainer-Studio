import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { SettingsDialog } from '@/components/ui/settings-dialog';
import { Settings, RefreshCw } from 'lucide-react';
import { useQNXtainerApi } from '@/hooks/useQNXtainerApi';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HeaderProps {
  onNavigate?: (view: 'dashboard') => void;
  showTitle?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, showTitle = true }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isConnected, refreshState, pollingEnabled, isLoading } = useQNXtainerApi();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {showTitle && (
            <div className="flex items-center mr-6 cursor-pointer" onClick={() => onNavigate && onNavigate('dashboard')}>
              <svg className="h-8 w-8 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="#FF443B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.29 7L12 12l8.71-5" stroke="#FF443B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 22V12" stroke="#FF443B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h1 className="text-2xl font-bold text-[#FF443B]">QNXtainer</h1>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2 mr-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
            
            {pollingEnabled && isConnected && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center ml-2">
                      <RefreshCw 
                        className={`h-3 w-3 text-blue-500 ${isLoading ? 'animate-spin' : 'animate-pulse'}`} 
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Auto-refresh active</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => refreshState()}
            title="Refresh connection"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-refresh-cw">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M8 16H3v5"/>
            </svg>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            title="Server settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <SettingsDialog 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen} 
      />
    </header>
  );
};

export default Header;
