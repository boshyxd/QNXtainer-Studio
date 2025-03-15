import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const containers = [
  { id: 'c1', name: 'qnx-app-1', status: 'running', cpu: 15, memory: 128, created: '2 hours ago' },
  { id: 'c2', name: 'qnx-app-2', status: 'running', cpu: 5, memory: 64, created: '3 hours ago' },
  { id: 'c3', name: 'qnx-app-3', status: 'stopped', cpu: 0, memory: 0, created: '1 day ago' },
  { id: 'c4', name: 'qnx-app-4', status: 'running', cpu: 25, memory: 256, created: '5 hours ago' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Containers</CardTitle>
            <CardDescription>All containers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{containers.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Running</CardTitle>
            <CardDescription>Active containers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{containers.filter(c => c.status === 'running').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stopped</CardTitle>
            <CardDescription>Inactive containers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{containers.filter(c => c.status === 'stopped').length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>System Resources</CardTitle>
          <CardDescription>CPU and Memory usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-gray-500">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-gray-500">512MB / 2GB</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Containers</CardTitle>
          <CardDescription>Manage your containers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>CPU</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {containers.map((container) => (
                <TableRow key={container.id}>
                  <TableCell className="font-medium">{container.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={container.status === 'running' ? 'default' : 'secondary'}
                      className={container.status === 'running' ? 'bg-green-500' : 'bg-gray-500'}
                    >
                      {container.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{container.cpu}%</TableCell>
                  <TableCell>{container.memory} MB</TableCell>
                  <TableCell>{container.created}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard; 