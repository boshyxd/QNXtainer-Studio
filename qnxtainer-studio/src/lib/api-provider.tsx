import React, { createContext, useContext, ReactNode } from 'react';
import { useQNXtainerApi } from '@/hooks/useQNXtainerApi';
import { ServerState, ApiConfig } from '../../api_client';

// Define the context type
interface ApiContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  serverState: ServerState | null;
  apiConfig: ApiConfig;
  updateApiConfig: (newConfig: ApiConfig) => void;
  refreshState: () => Promise<void>;
  uploadImage: (file: File, name: string, tag?: string) => Promise<void>;
  startContainer: (imageId: string) => Promise<void>;
  stopContainer: (containerId: string) => Promise<void>;
}

// Create the context with a default value
const ApiContext = createContext<ApiContextType | null>(null);

// Provider component
export function ApiProvider({ children }: { children: ReactNode }) {
  const api = useQNXtainerApi();
  
  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
}

// Custom hook to use the API context
export function useApi(): ApiContextType {
  const context = useContext(ApiContext);
  
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  
  return context;
} 