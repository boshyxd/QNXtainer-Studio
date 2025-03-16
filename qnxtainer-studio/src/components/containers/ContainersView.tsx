import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Mock data for containers
const containers = [
  { id: 'c1', name: 'hello-world', status: 'running', cpu: 15, memory: 128, created: '2 hours ago', appType: 'C Program' },
  { id: 'c2', name: 'sensor-monitor', status: 'running', cpu: 5, memory: 64, created: '3 hours ago', appType: 'C++ Application' },
  { id: 'c3', name: 'data-processor', status: 'stopped', cpu: 0, memory: 0, created: '1 day ago', appType: 'C Program' },
  { id: 'c4', name: 'system-monitor', status: 'running', cpu: 25, memory: 256, created: '5 hours ago', appType: 'C Program' },
];

const ContainersView: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'running' | 'stopped'>('all');
  const [selectedContainers, setSelectedContainers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [newApp, setNewApp] = useState({
    name: '',
    description: '',
    file: null as File | null,
    buildCommand: '',
    runCommand: '',
    sourceCode: ''
  });
  const [uploadMethod, setUploadMethod] = useState<'tarball' | 'editor'>('tarball');

  const filteredContainers = containers.filter(container => {
    if (selectedFilter === 'all') return true;
    return container.status === selectedFilter;
  });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedContainers([]);
    } else {
      setSelectedContainers(filteredContainers.map(container => container.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectContainer = (containerId: string) => {
    if (selectedContainers.includes(containerId)) {
      setSelectedContainers(selectedContainers.filter(id => id !== containerId));
      setSelectAll(false);
    } else {
      setSelectedContainers([...selectedContainers, containerId]);
      if (selectedContainers.length + 1 === filteredContainers.length) {
        setSelectAll(true);
      }
    }
  };

  const handleAction = (action: string) => {
    console.log(`Performing ${action} on containers:`, selectedContainers);
    // Here you would implement the actual container management logic
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewApp({
        ...newApp,
        file: e.target.files[0]
      });
    }
  };

  const handleCreateContainer = () => {
    console.log('Creating container with:', newApp);
    // Here you would implement the actual container creation logic
    // This would involve sending the tarball or source code to the server
    // where a bash script would compile, containerize, and run it
    setIsCreateDialogOpen(false);
    setNewApp({
      name: '',
      description: '',
      file: null,
      buildCommand: '',
      runCommand: '',
      sourceCode: ''
    });
  };

  // Check if any selected containers are running/stopped
  const hasRunningSelected = selectedContainers.some(id => 
    containers.find(c => c.id === id)?.status === 'running'
  );
  
  const hasStoppedSelected = selectedContainers.some(id => 
    containers.find(c => c.id === id)?.status === 'stopped'
  );

  const isCreateButtonDisabled = 
    (uploadMethod === 'tarball' && (!newApp.name || !newApp.file)) || 
    (uploadMethod === 'editor' && (!newApp.name || !newApp.sourceCode));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Container list</h1>
          <p className="text-muted-foreground">Manage your QNX containerized applications</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            className="bg-background border rounded-md px-3 py-2 text-sm"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as any)}
          >
            <option value="all">All Containers</option>
            <option value="running">Running</option>
            <option value="stopped">Stopped</option>
          </select>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-qnx hover:bg-qnx-dark">
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Add container
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Create Containerized Application</DialogTitle>
                <DialogDescription>
                  Upload your C/C++ application to be containerized and run on QNX.
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="tarball" className="w-full" onValueChange={(value) => setUploadMethod(value as 'tarball' | 'editor')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tarball">Upload Tarball</TabsTrigger>
                  <TabsTrigger value="editor">Code Editor</TabsTrigger>
                </TabsList>
                
                <TabsContent value="tarball" className="space-y-4 mt-4">
                  <Alert>
                    <AlertDescription>
                      Upload a tarball (.tar.gz) containing your C/C++ application source code. The server will compile and containerize it.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="app-name" className="text-right">
                        Application Name
                      </Label>
                      <Input 
                        id="app-name" 
                        placeholder="e.g., hello-world" 
                        className="col-span-3"
                        value={newApp.name}
                        onChange={(e) => setNewApp({...newApp, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="app-description" className="text-right">
                        Description
                      </Label>
                      <Input 
                        id="app-description" 
                        placeholder="Optional description" 
                        className="col-span-3"
                        value={newApp.description}
                        onChange={(e) => setNewApp({...newApp, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="app-file" className="text-right pt-2">
                        Application Tarball
                      </Label>
                      <div className="col-span-3">
                        <Input 
                          id="app-file" 
                          type="file" 
                          accept=".tar,.tar.gz,.tgz"
                          onChange={handleFileChange}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Accepted formats: .tar, .tar.gz, .tgz
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="build-command" className="text-right">
                        Build Command
                      </Label>
                      <Input 
                        id="build-command" 
                        placeholder="e.g., make or gcc -o myapp main.c" 
                        className="col-span-3"
                        value={newApp.buildCommand}
                        onChange={(e) => setNewApp({...newApp, buildCommand: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="run-command" className="text-right">
                        Run Command
                      </Label>
                      <Input 
                        id="run-command" 
                        placeholder="e.g., ./myapp" 
                        className="col-span-3"
                        value={newApp.runCommand}
                        onChange={(e) => setNewApp({...newApp, runCommand: e.target.value})}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="editor" className="space-y-4 mt-4">
                  <Alert>
                    <AlertDescription>
                      Write or paste your C/C++ code directly. For simple applications only.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid gap-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="editor-app-name" className="text-right">
                        Application Name
                      </Label>
                      <Input 
                        id="editor-app-name" 
                        placeholder="e.g., hello-world" 
                        className="col-span-3"
                        value={newApp.name}
                        onChange={(e) => setNewApp({...newApp, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="editor-app-description" className="text-right">
                        Description
                      </Label>
                      <Input 
                        id="editor-app-description" 
                        placeholder="Optional description" 
                        className="col-span-3"
                        value={newApp.description}
                        onChange={(e) => setNewApp({...newApp, description: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label htmlFor="source-code" className="text-right pt-2">
                        Source Code
                      </Label>
                      <Textarea 
                        id="source-code" 
                        placeholder={'#include <stdio.h>\n\nint main() {\n    printf("Hello, QNX!\\n");\n    return 0;\n}'}
                        className="col-span-3 font-mono h-64"
                        value={newApp.sourceCode}
                        onChange={(e) => setNewApp({...newApp, sourceCode: e.target.value})}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  className="bg-qnx hover:bg-qnx-dark" 
                  onClick={handleCreateContainer}
                  disabled={isCreateButtonDisabled}
                >
                  Create & Deploy
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 hover:text-green-600"
          disabled={!hasStoppedSelected}
          onClick={() => handleAction('start')}
        >
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Start
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 hover:text-red-600"
          disabled={!hasRunningSelected}
          onClick={() => handleAction('stop')}
        >
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="6" y="6" width="12" height="12" />
          </svg>
          Stop
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 hover:text-red-600"
          disabled={selectedContainers.length === 0}
          onClick={() => handleAction('kill')}
        >
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 9l6 6M15 9l-6 6" />
          </svg>
          Kill
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20 hover:text-blue-600"
          disabled={!hasRunningSelected}
          onClick={() => handleAction('restart')}
        >
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
          </svg>
          Restart
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20 hover:text-blue-600"
          disabled={selectedContainers.length !== 1}
          onClick={() => handleAction('logs')}
        >
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Logs
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          className="bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 hover:text-red-600"
          disabled={selectedContainers.length === 0}
          onClick={() => handleAction('remove')}
        >
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
          Remove
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">
                  <Checkbox 
                    checked={selectAll} 
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all containers"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Application Type</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContainers.map((container) => (
                <TableRow 
                  key={container.id}
                  className={selectedContainers.includes(container.id) ? "bg-muted/50" : ""}
                  onClick={() => handleSelectContainer(container.id)}
                >
                  <TableCell className="w-[40px]">
                    <Checkbox 
                      checked={selectedContainers.includes(container.id)} 
                      onCheckedChange={() => handleSelectContainer(container.id)}
                      aria-label={`Select ${container.name}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{container.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={container.status === 'running' ? 'default' : 'secondary'}
                      className={container.status === 'running' ? 'bg-green-500 hover:bg-green-600' : 'bg-muted hover:bg-muted/80'}
                    >
                      {container.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{container.appType}</TableCell>
                  <TableCell>172.17.0.{Math.floor(Math.random() * 100) + 1}</TableCell>
                  <TableCell>{container.cpu}%</TableCell>
                  <TableCell>{container.memory} MB</TableCell>
                  <TableCell>{container.created}</TableCell>
                </TableRow>
              ))}
              {filteredContainers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    No containers found. Create a container to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContainersView; 