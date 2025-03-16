import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { useQNXtainerApi } from '@/hooks/useQNXtainerApi';
import { ApiConfig } from '../../../api_client';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { apiConfig, updateApiConfig, isConnected } = useQNXtainerApi();
  
  const [serverUrl, setServerUrl] = useState<string>(apiConfig.serverUrl);
  const [port, setPort] = useState<number>(apiConfig.port);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [testSuccess, setTestSuccess] = useState<boolean>(false);
  
  const handleSave = () => {
    const newConfig: ApiConfig = {
      serverUrl,
      port
    };
    
    updateApiConfig(newConfig);
    onOpenChange(false);
  };
  
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestError(null);
    setTestSuccess(false);
    
    try {
      const response = await fetch(`http://${serverUrl}:${port}/state`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      await response.json();
      setTestSuccess(true);
    } catch (error) {
      setTestError(`Connection failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Server Connection Settings</DialogTitle>
          <DialogDescription>
            Configure the connection to your QNXtainer Server running on QNX OS.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="serverUrl" className="text-right">
              Server URL
            </Label>
            <Input
              id="serverUrl"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              className="col-span-3"
              placeholder="localhost or IP address"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="port" className="text-right">
              Port
            </Label>
            <Input
              id="port"
              type="number"
              value={port}
              onChange={(e) => setPort(parseInt(e.target.value, 10))}
              className="col-span-3"
              placeholder="8080"
            />
          </div>
          
          {testError && (
            <div className="bg-destructive/20 text-destructive p-2 rounded-md text-sm">
              {testError}
            </div>
          )}
          
          {testSuccess && (
            <div className="bg-green-500/20 text-green-500 p-2 rounded-md text-sm">
              Connection successful!
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <Button 
              variant="outline" 
              onClick={handleTestConnection}
              disabled={isTesting}
            >
              {isTesting ? 'Testing...' : 'Test Connection'}
            </Button>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 