import React from 'react';
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

interface HeaderProps {
  onNavigate?: (view: 'dashboard' | 'create') => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-qnx mr-6 cursor-pointer" onClick={() => onNavigate && onNavigate('dashboard')}>QNXtainer</h1>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-qnx">Containers</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[400px]">
                    <li>
                      <NavigationMenuLink className="block p-2 hover:bg-gray-100 rounded cursor-pointer" onClick={() => onNavigate && onNavigate('dashboard')}>
                        All Containers
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink className="block p-2 hover:bg-gray-100 rounded cursor-pointer">
                        Running
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink className="block p-2 hover:bg-gray-100 rounded cursor-pointer">
                        Stopped
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-gray-700 hover:text-qnx">Images</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[400px]">
                    <li>
                      <NavigationMenuLink className="block p-2 hover:bg-gray-100 rounded cursor-pointer">
                        Local Images
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink className="block p-2 hover:bg-gray-100 rounded cursor-pointer">
                        Registry
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-gray-700 hover:text-qnx cursor-pointer">
                  Networks
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink className="text-gray-700 hover:text-qnx cursor-pointer">
                  Volumes
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            className="border-qnx text-qnx hover:bg-qnx hover:text-white"
            onClick={() => onNavigate && onNavigate('create')}
          >
            Create Container
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <span className="sr-only">Open menu</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help</DropdownMenuItem>
              <DropdownMenuItem>About</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
