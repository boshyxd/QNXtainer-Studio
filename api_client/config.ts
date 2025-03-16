import { ApiConfig } from './index';

const defaultConfig: ApiConfig = {
  serverUrl: 'https://kontrakti.com',
  port: 80
};

export function loadApiConfig(): ApiConfig {
  try {
    const savedConfig = localStorage.getItem('qnxtainer-api-config');
    if (savedConfig) {
      return JSON.parse(savedConfig);
    }
  } catch (error) {
    console.error('Failed to load API config from localStorage:', error);
  }
  
  return defaultConfig;
}

export function saveApiConfig(config: ApiConfig): void {
  try {
    localStorage.setItem('qnxtainer-api-config', JSON.stringify(config));
  } catch (error) {
    console.error('Failed to save API config to localStorage:', error);
  }
}

export default defaultConfig; 