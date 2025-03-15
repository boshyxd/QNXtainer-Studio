import React from 'react';

const ImagesView: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Images</h1>
        <p className="text-muted-foreground">Manage container images</p>
      </div>
      
      <div className="flex items-center justify-center h-64 border border-dashed border-border rounded-lg">
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium">Images View Coming Soon</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            This feature is under development.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImagesView; 