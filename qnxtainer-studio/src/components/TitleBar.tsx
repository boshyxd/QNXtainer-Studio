import React from 'react';

// Declare the electron interface on the window object
declare global {
  interface Window {
    electron?: {
      windowControls: {
        minimize: () => void;
        maximize: () => void;
        close: () => void;
      };
      appInfo: {
        version: string;
        platform: string;
      };
      receive: (channel: string, func: (...args: any[]) => void) => void;
      send: (channel: string, data: any) => void;
    };
  }
}

const TitleBar: React.FC = () => {
  const handleMinimize = () => {
    window.electron?.windowControls.minimize();
  };

  const handleMaximize = () => {
    window.electron?.windowControls.maximize();
  };

  const handleClose = () => {
    window.electron?.windowControls.close();
  };

  return (
    <div className="h-9 bg-sidebar border-b border-border flex items-center justify-between px-2 select-none app-drag">
      <div className="flex items-center">
        <img src="/qnx-logo.svg" alt="QNX Logo" className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium">QNXtainer Studio</span>
      </div>
      <div className="flex items-center space-x-1 app-no-drag">
        <button 
          onClick={handleMinimize}
          className="h-7 w-7 flex items-center justify-center rounded-sm hover:bg-muted/50 transition-colors"
        >
          <svg width="10" height="1" viewBox="0 0 10 1" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="10" height="1" fill="currentColor" />
          </svg>
        </button>
        <button 
          onClick={handleMaximize}
          className="h-7 w-7 flex items-center justify-center rounded-sm hover:bg-muted/50 transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="0.5" width="9" height="9" stroke="currentColor" />
          </svg>
        </button>
        <button 
          onClick={handleClose}
          className="h-7 w-7 flex items-center justify-center rounded-sm hover:bg-red-500 hover:text-white transition-colors"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TitleBar; 