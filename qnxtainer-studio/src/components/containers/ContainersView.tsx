import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for containers
const containers = [
  { id: 'c1', name: 'qnx-app-1', status: 'running', cpu: 15, memory: 128, created: '2 hours ago', image: 'qnx-base:latest' },
  { id: 'c2', name: 'qnx-app-2', status: 'running', cpu: 5, memory: 64, created: '3 hours ago', image: 'qnx-runtime:8.0' },
  { id: 'c3', name: 'qnx-app-3', status: 'stopped', cpu: 0, memory: 0, created: '1 day ago', image: 'qnx-dev:latest' },
  { id: 'c4', name: 'qnx-app-4', status: 'running', cpu: 25, memory: 256, created: '5 hours ago', image: 'qnx-base:latest' },
];

const ContainersView: React.FC = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'running' | 'stopped'>('all');

  const filteredContainers = containers.filter(container => {
    if (selectedFilter === 'all') return true;
    return container.status === selectedFilter;
  });

  const handleAction = (action: string, containerId: string) => {
    console.log(`Performing ${action} on container ${containerId}`);
    // Here you would implement the actual container management logic
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Containers</h1>
          <p className="text-muted-foreground">Manage your QNX containers</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedFilter} onValueChange={(value) => setSelectedFilter(value as any)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Containers</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-qnx hover:bg-qnx-dark">
                <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
                Create Container
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create Container</DialogTitle>
                <DialogDescription>
                  Deploy a new containerized application on QNX.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input id="name" placeholder="my-qnx-app" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="image" className="text-right">
                    Image
                  </Label>
                  <Select defaultValue="qnx-base">
                    <SelectTrigger className="col-span-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qnx-base">qnx-base:latest</SelectItem>
                      <SelectItem value="qnx-runtime">qnx-runtime:8.0</SelectItem>
                      <SelectItem value="qnx-dev">qnx-dev:latest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="command" className="text-right">
                    Command
                  </Label>
                  <Input id="command" placeholder="Optional startup command" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-qnx hover:bg-qnx-dark" onClick={() => setIsCreateDialogOpen(false)}>
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContainers.map((container) => (
                <TableRow key={container.id}>
                  <TableCell className="font-medium">{container.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={container.status === 'running' ? 'default' : 'secondary'}
                      className={container.status === 'running' ? 'bg-qnx hover:bg-qnx-dark' : 'bg-muted hover:bg-muted/80'}
                    >
                      {container.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{container.image}</TableCell>
                  <TableCell>{container.cpu}%</TableCell>
                  <TableCell>{container.memory} MB</TableCell>
                  <TableCell>{container.created}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {container.status === 'running' ? (
                          <DropdownMenuItem onClick={() => handleAction('stop', container.id)}>
                            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="6" y="6" width="12" height="12" />
                            </svg>
                            Stop
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleAction('start', container.id)}>
                            <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                            Start
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => handleAction('restart', container.id)}>
                          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 2v6h-6" />
                            <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                            <path d="M3 22v-6h6" />
                            <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
                          </svg>
                          Restart
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('logs', container.id)}>
                          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          Logs
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleAction('delete', container.id)} className="text-red-500 hover:text-red-500">
                          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          </svg>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContainersView; 