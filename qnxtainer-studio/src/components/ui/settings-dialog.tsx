import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Switch } from './switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { useQNXtainerApi } from '@/hooks/useQNXtainerApi';
import { ApiConfig } from '../../../api_client';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { 
    apiConfig, 
    updateApiConfig, 
    isConnected, 
    pollingEnabled, 
    setPollingEnabled, 
    pollingInterval, 
    setPollingInterval 
  } = useQNXtainerApi();
  
  const [serverUrl, setServerUrl] = useState<string>(apiConfig.serverUrl);
  const [port, setPort] = useState<number>(apiConfig.port);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testError, setTestError] = useState<string | null>(null);
  const [testSuccess, setTestSuccess] = useState<boolean>(false);
  const [localPollingEnabled, setLocalPollingEnabled] = useState<boolean>(pollingEnabled);
  const [localPollingInterval, setLocalPollingInterval] = useState<number>(pollingInterval);
  
  const handleSave = () => {
    const newConfig: ApiConfig = {
      serverUrl,
      port
    };
    
    updateApiConfig(newConfig);
    setPollingEnabled(localPollingEnabled);
    setPollingInterval(localPollingInterval);
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
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure QNXtainer Studio settings
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="connection">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="polling">Polling</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection" className="space-y-4 py-4">
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
          </TabsContent>
          
          <TabsContent value="polling" className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="polling-toggle">Auto-refresh</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically refresh container status
                </p>
              </div>
              <Switch
                id="polling-toggle"
                checked={localPollingEnabled}
                onCheckedChange={setLocalPollingEnabled}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="polling-interval" className="text-right">
                Interval (ms)
              </Label>
              <Input
                id="polling-interval"
                type="number"
                value={localPollingInterval}
                onChange={(e) => setLocalPollingInterval(parseInt(e.target.value, 10))}
                className="col-span-3"
                placeholder="5000"
                disabled={!localPollingEnabled}
                min={1000}
                max={60000}
              />
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Recommended: 5000ms (5 seconds)</p>
              <p>Minimum: 1000ms (1 second)</p>
              <p>Maximum: 60000ms (60 seconds)</p>
            </div>
          </TabsContent>
        </Tabs>
        
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