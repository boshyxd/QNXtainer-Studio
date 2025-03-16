import React, { useState, useEffect } from 'react';
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
import { toast } from 'sonner';
import { useQNXtainerApi } from '@/hooks/useQNXtainerApi';
import { PlusCircle, AlertCircle } from 'lucide-react';

const initialContainers = [
  { id: 'c1', name: 'hello-world', status: 'running', cpu: 15, memory: 128, created: '2 hours ago', appType: 'C Program' },
  { id: 'c2', name: 'sensor-monitor', status: 'running', cpu: 5, memory: 64, created: '3 hours ago', appType: 'C++ Application' },
  { id: 'c3', name: 'data-processor', status: 'stopped', cpu: 0, memory: 0, created: '1 day ago', appType: 'C Program' },
];

interface Container {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'prepared';
  cpu: number;
  memory: number;
  created: string;
  appType: string;
}

interface NewContainer {
  name: string;
  description: string;
  id: string;
}

const ContainersView: React.FC = () => {
  const { serverState, isConnected, isLoading, error, startContainer, stopContainer, createContainer } = useQNXtainerApi();

  const [containers, setContainers] = useState<Container[]>(() => {
    const savedContainers = localStorage.getItem('qnxtainer-containers');
    return savedContainers ? JSON.parse(savedContainers) : initialContainers;
  });

  useEffect(() => {
    if (serverState && serverState.containers) {
      const apiContainers = serverState.containers.map(container => ({
        id: container.id,
        name: container.name || container.id.substring(0, 8),
        status: container.status as 'running' | 'stopped',
        cpu: container.cpu,
        memory: container.memory,
        created: new Date().toLocaleString(),
        appType: container.image ? `${container.image.name}:${container.image.tag}` : 'QNX Container'
      }));

      setContainers(apiContainers);
    }
  }, [serverState]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'running' | 'stopped'>('all');
  const [selectedContainers, setSelectedContainers] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [newContainer, setNewContainer] = useState<NewContainer>({
    name: '',
    description: '',
    id: '',
  });
  const [uploadMethod, setUploadMethod] = useState<'tarball' | 'editor'>('tarball');
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    file?: string;
    sourceCode?: string;
  }>({});

  useEffect(() => {
    localStorage.setItem('qnxtainer-containers', JSON.stringify(containers));
  }, [containers]);

  useEffect(() => {
    const handleOpenDialog = () => {
      setIsCreateDialogOpen(true);
    };

    window.addEventListener('open-container-dialog', handleOpenDialog);

    return () => {
      window.removeEventListener('open-container-dialog', handleOpenDialog);
    };
  }, []);

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
    setTimeout(() => {
      switch (action) {
        case 'start':
          setContainers(containers.map(container =>
            selectedContainers.includes(container.id) && container.status === 'stopped'
              ? { ...container, status: 'running', cpu: Math.floor(Math.random() * 20) + 5, memory: Math.floor(Math.random() * 200) + 50 }
              : container
          ));
          toast.success(`Started ${selectedContainers.length} container(s)`);
          break;
        case 'stop':
          setContainers(containers.map(container =>
            selectedContainers.includes(container.id) && container.status === 'running'
              ? { ...container, status: 'stopped', cpu: 0, memory: 0 }
              : container
          ));
          toast.success(`Stopped ${selectedContainers.length} container(s)`);
          break;
        case 'restart':
          setContainers(containers.map(container =>
            selectedContainers.includes(container.id)
              ? { ...container, status: 'running', cpu: Math.floor(Math.random() * 20) + 5, memory: Math.floor(Math.random() * 200) + 50 }
              : container
          ));
          toast.success(`Restarted ${selectedContainers.length} container(s)`);
          break;
        case 'kill':
          setContainers(containers.map(container =>
            selectedContainers.includes(container.id)
              ? { ...container, status: 'stopped', cpu: 0, memory: 0 }
              : container
          ));
          toast.success(`Killed ${selectedContainers.length} container(s)`);
          break;
        case 'remove':
          setContainers(containers.filter(container => !selectedContainers.includes(container.id)));
          setSelectedContainers([]);
          setSelectAll(false);
          toast.success(`Removed ${selectedContainers.length} container(s)`);
          break;
        case 'logs':
          toast.info(`Viewing logs for ${containers.find(c => c.id === selectedContainers[0])?.name}`);
          break;
        default:
          break;
      }
    }, 1000);
  };

  const validateForm = () => {
    const errors: {
      name?: string;
      file?: string;
      sourceCode?: string;
    } = {};

    if (!newContainer.name.trim()) {
      errors.name = "Container name is required";
    } else if (!/^[a-zA-Z0-9_-]+$/.test(newContainer.name)) {
      errors.name = "Name can only contain letters, numbers, hyphens and underscores";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateContainer = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      if (isConnected && serverState && serverState.images.length > 0) {
        const imageId = serverState.images[0].id;
        await createContainer(imageId, newContainer.name);
        toast.success(`Container "${newContainer.name}" created successfully`);
      } else {
        const newCont: Container = {
          id: `c${Math.floor(Math.random() * 1000)}`,
          name: newContainer.name,
          status: 'stopped',
          cpu: 0,
          memory: 0,
          created: new Date().toLocaleDateString(),
          appType: uploadMethod === 'editor' ? 'C Program' : 'Container Image'
        };

        setContainers(prev => [...prev, newCont]);
        toast.success(`Container "${newContainer.name}" created (mock)`);
      }

      setIsCreateDialogOpen(false);
      setNewContainer({
        name: '',
        description: '',
        id: ''
      });
      setFormErrors({});
    } catch (error) {
      toast.error(`Failed to create container: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const hasRunningSelected = selectedContainers.some(id =>
    containers.find(c => c.id === id)?.status === 'running'
  );

  const hasStoppedSelected = selectedContainers.some(id =>
    containers.find(c => c.id === id)?.status === 'stopped'
  );

  const isPreparedSelected = selectedContainers.some(id =>
    containers.find(c => c.id === id)?.status === 'prepared'
  );


  const handleStartContainer = async (containerId: string) => {
    try {
      if (isConnected) {
        await startContainer(containerId);
        toast.success(`Container ${containerId} started successfully`);
      } else {
        setContainers(prevContainers =>
          prevContainers.map(container =>
            container.id === containerId
              ? { ...container, status: 'running', cpu: 5, memory: 64 }
              : container
          )
        );
        toast.success(`Container ${containerId} started (mock)`);
      }
    } catch (error) {
      toast.error(`Failed to start container: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleStopContainer = async (containerId: string) => {
    try {
      if (isConnected) {
        await stopContainer(containerId);
        toast.success(`Container ${containerId} stopped successfully`);
      } else {
        setContainers(prevContainers =>
          prevContainers.map(container =>
            container.id === containerId
              ? { ...container, status: 'stopped', cpu: 0, memory: 0 }
              : container
          )
        );
        toast.success(`Container ${containerId} stopped (mock)`);
      }
    } catch (error) {
      toast.error(`Failed to stop container: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Containers</h1>
          <p className="text-muted-foreground">Manage your QNX containers</p>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="mr-4 bg-[#FF443B] hover:bg-[#E03A32] text-white"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            New Container
          </Button>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedFilter('all')}
              className={selectedFilter === 'all' ? 'bg-muted' : ''}
            >
              All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedFilter('running')}
              className={selectedFilter === 'running' ? 'bg-muted' : ''}
            >
              Running
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedFilter('stopped')}
              className={selectedFilter === 'stopped' ? 'bg-muted' : ''}
            >
              Stopped
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          className="bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 hover:text-green-600"
          disabled={!(!hasRunningSelected || isPreparedSelected) || isLoading}
          onClick={() => handleStartContainer(selectedContainers[0])}
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
          disabled={!hasRunningSelected || isLoading}
          onClick={() => handleStopContainer(selectedContainers[0])}
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
          disabled={(!hasRunningSelected || isPreparedSelected) || isLoading}
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
          disabled={!hasRunningSelected || isLoading}
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
          disabled={!hasRunningSelected || isLoading}
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
          disabled={selectedContainers.length === 0 || isLoading}
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
                    disabled={isLoading}
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
                  onClick={() => !isLoading && handleSelectContainer(container.id)}
                >
                  <TableCell className="w-[40px]">
                    <Checkbox
                      checked={selectedContainers.includes(container.id)}
                      onCheckedChange={() => handleSelectContainer(container.id)}
                      aria-label={`Select ${container.name}`}
                      onClick={(e) => e.stopPropagation()}
                      disabled={isLoading}
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
                  <TableCell>172.17.0.{parseInt(container.id.replace(/\D/g, '')) % 100 + 1}</TableCell>
                  <TableCell>{container.cpu}%</TableCell>
                  <TableCell>{container.memory} MB</TableCell>
                  <TableCell>{container.created}</TableCell>
                </TableRow>
              ))}
              {filteredContainers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center">
                    {isLoading ? (
                      <div className="flex justify-center items-center">
                        <svg className="animate-spin h-5 w-5 mr-3 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading containers...
                      </div>
                    ) : (
                      'No containers found. Create a container to get started.'
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-qnx"></div>
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Create Containerized Application</DialogTitle>
            <DialogDescription>
              After uploading your C/C++ application image on QNX, you can start it here by giving its id.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="tarball" className="w-full" onValueChange={(value) => setUploadMethod(value as 'tarball' | 'editor')}>
            <TabsContent value="tarball" className="space-y-4 mt-4">

              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="app-name" className="text-right">
                    Application Name
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input
                      id="app-name"
                      placeholder="e.g., hello-world"
                      className={formErrors.name ? "border-red-500" : ""}
                      value={newContainer.name}
                      onChange={(e) => {
                        setNewContainer({ ...newContainer, name: e.target.value });
                        if (formErrors.name) {
                          setFormErrors({ ...formErrors, name: undefined });
                        }
                      }}
                    />
                    {formErrors.name && (
                      <p className="text-xs text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="app-file" className="text-right pt-2">
                    Image ID
                  </Label>
                  <div className="col-span-3 space-y-1">
                    <Input
                      id="image-id"
                      placeholder="ID"
                      value={newContainer.description}
                      onChange={(e) => setNewContainer({ ...newContainer, description: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      See Images for a list of images
                    </p>
                    {formErrors.file && (
                      <p className="text-xs text-red-500 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {formErrors.file}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="editor" className="space-y-4 mt-4">
              <Alert>
                <AlertDescription>
                  Write or paste your C/C++ code directly. For simple applications only.
                </AlertDescription>
              </Alert>


              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="editor-app-description" className="text-right">
                  Description
                </Label>
                <div className="col-span-3">
                  <Input
                    id="editor-app-description"
                    placeholder="Optional description"
                    value={newContainer.description}
                    onChange={(e) => setNewContainer({ ...newContainer, description: e.target.value })}
                  />
                </div>
              </div>

            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateContainer}
              disabled={isLoading || !newContainer.name}
              className="bg-[#FF443B] hover:bg-[#E03A32] text-white"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Create & Deploy'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContainersView; 
