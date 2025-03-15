import React from 'react';

const NetworksView: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Networks</h1>
        <p className="text-muted-foreground">Manage container networks</p>
      </div>
      
      <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-lg">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          <h3 className="mt-2 text-sm font-medium">Networks View Coming Soon</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            This feature is under development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NetworksView; 