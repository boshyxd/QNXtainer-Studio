import React from 'react';

const VolumesView: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Volumes</h1>
        <p className="text-muted-foreground">Manage container volumes</p>
      </div>
      
      <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-lg">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="mt-2 text-sm font-medium">Volumes View Coming Soon</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            This feature is under development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VolumesView; 