import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Single QNX OS image that will be used for all containers
const qnxImage = {
  id: 'qnx-base',
  name: 'qnx-base',
  tag: 'latest',
  size: '450MB',
  created: 'System default',
  description: 'Official QNX OS base image for containerization'
};

const ImagesView: React.FC = () => {
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">System Image</h1>
          <p className="text-muted-foreground">QNX base image used for containerization</p>
        </div>
      </div>

      <Alert className="mb-6">
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <AlertTitle>System Image</AlertTitle>
        <AlertDescription>
          QNXtainer uses a single system image for containerization. You don't need to upload or manage OS images.
          Instead, upload your application code in the Containers tab.
        </AlertDescription>
      </Alert>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">{qnxImage.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-muted/50">
                    {qnxImage.tag}
                  </Badge>
                </TableCell>
                <TableCell>{qnxImage.size}</TableCell>
                <TableCell>{qnxImage.created}</TableCell>
                <TableCell className="max-w-[300px] truncate">{qnxImage.description}</TableCell>
                <TableCell>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20 hover:text-blue-600"
                    onClick={() => setIsInfoDialogOpen(true)}
                  >
                    <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                    Info
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>QNX Base Image Details</DialogTitle>
            <DialogDescription>
              Information about the system QNX image used for containerization.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 items-start gap-4">
              <div className="font-medium text-right">Name:</div>
              <div className="col-span-2">{qnxImage.name}</div>
            </div>
            <div className="grid grid-cols-3 items-start gap-4">
              <div className="font-medium text-right">Tag:</div>
              <div className="col-span-2">{qnxImage.tag}</div>
            </div>
            <div className="grid grid-cols-3 items-start gap-4">
              <div className="font-medium text-right">Size:</div>
              <div className="col-span-2">{qnxImage.size}</div>
            </div>
            <div className="grid grid-cols-3 items-start gap-4">
              <div className="font-medium text-right">Created:</div>
              <div className="col-span-2">{qnxImage.created}</div>
            </div>
            <div className="grid grid-cols-3 items-start gap-4">
              <div className="font-medium text-right">Description:</div>
              <div className="col-span-2">{qnxImage.description}</div>
            </div>
            <div className="grid grid-cols-3 items-start gap-4">
              <div className="font-medium text-right">Architecture:</div>
              <div className="col-span-2">ARM64</div>
            </div>
            <div className="grid grid-cols-3 items-start gap-4">
              <div className="font-medium text-right">QNX Version:</div>
              <div className="col-span-2">QNX SDP 8.0</div>
            </div>
            <div className="grid grid-cols-3 items-start gap-4">
              <div className="font-medium text-right">Features:</div>
              <div className="col-span-2">
                <ul className="list-disc pl-5 space-y-1">
                  <li>POSIX-compliant API</li>
                  <li>Real-time scheduling</li>
                  <li>Resource management</li>
                  <li>Process isolation</li>
                  <li>Standard C/C++ libraries</li>
                </ul>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsInfoDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImagesView; 