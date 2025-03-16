import { useState, useEffect, useCallback, useRef } from 'react';
import QNXtainerApiClient, { ServerState, Container, Image } from '../../api_client';
import { loadApiConfig, saveApiConfig } from '../../api_client/config';
import { ApiConfig } from '../../api_client';

interface UseQNXtainerApiReturn {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  serverState: ServerState | null;
  apiConfig: ApiConfig;
  updateApiConfig: (newConfig: ApiConfig) => void;
  refreshState: () => Promise<void>;
  uploadImage: (file: File, name: string, tag?: string) => Promise<void>;
  createContainer: (imageId: string, name: string) => Promise<void>;
  startContainer: (imageId: string) => Promise<void>;
  stopContainer: (containerId: string) => Promise<void>;
  setPollingEnabled: (enabled: boolean) => void;
  pollingEnabled: boolean;
  pollingInterval: number;
  setPollingInterval: (interval: number) => void;
}

const DEFAULT_POLLING_INTERVAL = 10000;

export function useQNXtainerApi(): UseQNXtainerApiReturn {
  const [apiClient, setApiClient] = useState<QNXtainerApiClient | null>(null);
  const [apiConfig, setApiConfig] = useState<ApiConfig>(loadApiConfig());
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [serverState, setServerState] = useState<ServerState | null>(null);
  const [pollingEnabled, setPollingEnabled] = useState<boolean>(true);
  const [pollingInterval, setPollingInterval] = useState<number>(DEFAULT_POLLING_INTERVAL);
  
  const pollingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const client = new QNXtainerApiClient(apiConfig);
    setApiClient(client);
    
    setIsLoading(true);
    setError(null);
    
    client.getState()
      .then(state => {
        setServerState(state);
        setIsConnected(true);
      })
      .catch(err => {
        setError(`Failed to connect to QNXtainer Server: ${err.message}`);
        setIsConnected(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [apiConfig]);

  const refreshState = useCallback(async () => {
    if (!apiClient) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const state = await apiClient.getState();
      setServerState(state);
      setIsConnected(true);
    } catch (err) {
      setError(`Failed to fetch server state: ${err instanceof Error ? err.message : String(err)}`);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [apiClient]);

  useEffect(() => {
    if (pollingTimerRef.current) {
      clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    }
    
    if (pollingEnabled && apiClient) {
      pollingTimerRef.current = setInterval(() => {
        if (!isLoading) {
          refreshState();
        }
      }, pollingInterval);
    }
    
    return () => {
      if (pollingTimerRef.current) {
        clearInterval(pollingTimerRef.current);
      }
    };
  }, [pollingEnabled, pollingInterval, apiClient, refreshState, isLoading]);

  const updateApiConfig = useCallback((newConfig: ApiConfig) => {
    saveApiConfig(newConfig);
    setApiConfig(newConfig);
  }, []);

  const uploadImage = useCallback(async (file: File, name: string, tag: string = 'latest') => {
    if (!apiClient) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.uploadImage(file, name, tag);
      await refreshState();
    } catch (err) {
      setError(`Failed to upload image: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiClient, refreshState]);

  const createContainer = useCallback(async (imageId: string, name: string) => {
    if (!apiClient) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.createContainer(imageId, name);
      await refreshState();
    } catch (err) {
      setError(`Failed to create container: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiClient, refreshState]);

  const startContainer = useCallback(async (imageId: string) => {
    if (!apiClient) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.startContainer(imageId);
      await refreshState();
    } catch (err) {
      setError(`Failed to start container: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiClient, refreshState]);

  const stopContainer = useCallback(async (containerId: string) => {
    if (!apiClient) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await apiClient.stopContainer(containerId);
      await refreshState();
    } catch (err) {
      setError(`Failed to stop container: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiClient, refreshState]);

  return {
    isConnected,
    isLoading,
    error,
    serverState,
    apiConfig,
    updateApiConfig,
    refreshState,
    uploadImage,
    createContainer,
    startContainer,
    stopContainer,
    setPollingEnabled,
    pollingEnabled,
    pollingInterval,
    setPollingInterval
  };
} 