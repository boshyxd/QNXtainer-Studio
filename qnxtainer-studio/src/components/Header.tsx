import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger 
} from '@/components/ui/navigation-menu';
import { SettingsDialog } from '@/components/ui/settings-dialog';
import { Settings } from 'lucide-react';
import { useQNXtainerApi } from '@/hooks/useQNXtainerApi';

interface HeaderProps {
  onNavigate?: (view: 'dashboard' | 'create') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { isConnected, refreshState } = useQNXtainerApi();

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-qnx mr-6 cursor-pointer" onClick={() => onNavigate && onNavigate('dashboard')}>QNXtainer</h1>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground hover:text-qnx">Containers</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[400px] bg-card border border-border">
                    <li>
                      <NavigationMenuLink className="block p-2 hover:bg-muted rounded cursor-pointer" onClick={() => onNavigate && onNavigate('dashboard')}>
                        All Containers
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink className="block p-2 hover:bg-muted rounded cursor-pointer">
                        Running
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink className="block p-2 hover:bg-muted rounded cursor-pointer">
                        Stopped
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-foreground hover:text-qnx">Images</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[400px] bg-card border border-border">
                    <li>
                      <NavigationMenuLink className="block p-2 hover:bg-muted rounded cursor-pointer">
                        Local Images
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink className="block p-2 hover:bg-muted rounded cursor-pointer">
                        Registry
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-foreground hover:text-qnx cursor-pointer">
                  Networks
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-foreground hover:text-qnx cursor-pointer">
                  Volumes
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center gap-2 mr-2">
            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
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
          
          <Button onClick={() => onNavigate && onNavigate('create')}>
            Create Container
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
