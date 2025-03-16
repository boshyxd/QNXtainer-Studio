import React from 'react';

const TestComponent: React.FC = () => {
  return (
    <div className="p-4 m-4 bg-card border border-border text-foreground rounded-lg">
      <h2 className="text-2xl font-bold text-qnx">Test Component</h2>
      <p className="mt-2">This is a test component to check if Tailwind CSS is working.</p>
      <button className="mt-4 px-4 py-2 bg-qnx text-white rounded hover:bg-qnx-dark transition-colors">
        Test Button
      </button>
    </div>
  );
};

export default TestComponent; 