import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useQNXtainerApi } from '@/hooks/useQNXtainerApi';
import { Image } from '../../../api_client';

const qnxImage = {
  id: 'qnx-base',
  name: 'qnx-base',
  tag: 'latest',
  size: '450MB',
  created: 'System default',
  description: 'Official QNX OS base image for containerization'
};

interface UIImage {
  id: string;
  name: string;
  tag: string;
  size: string;
  created: string;
  description: string;
}

const ImagesView: React.FC = () => {
  const { serverState, isConnected, isLoading, error, uploadImage } = useQNXtainerApi();
  const [images, setImages] = useState<UIImage[]>([qnxImage]);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [imageName, setImageName] = useState('');
  const [imageTag, setImageTag] = useState('latest');

  useEffect(() => {
    if (serverState && serverState.images && serverState.images.length > 0) {
      const apiImages = serverState.images.map(image => ({
        id: image.id,
        name: image.name,
        tag: image.tag,
        size: 'Unknown',
        created: new Date(image.created_at).toLocaleString(),
        description: `${image.name}:${image.tag} container image`
      }));

      setImages([qnxImage, ...apiImages]);
    } else {
      setImages([qnxImage]);
    }
  }, [serverState]);

  const handleUploadImage = async () => {
    if (!uploadFile || !imageName) return;

    try {
      await uploadImage(uploadFile, imageName, imageTag);
      setIsUploadDialogOpen(false);
      setUploadFile(null);
      setImageName('');
      setImageTag('latest');
    } catch (error) {
      console.error('Failed to upload image:', error);
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
          <h1 className="text-2xl font-bold">System Images</h1>
          <p className="text-muted-foreground">QNX base image and custom container images</p>
        </div>

        <Button onClick={() => setIsUploadDialogOpen(true)}>
          Upload Image
        </Button>
      </div>

      <Alert className="mb-6">
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <AlertTitle>System Image</AlertTitle>
        <AlertDescription>
          QNXtainer uses a base QNX system image for containerization. You can also upload custom container images.
        </AlertDescription>
      </Alert>

      {isLoading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-qnx"></div>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Tag</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.map((image) => (
                <TableRow key={image.id}>
                  <TableCell>{image.id}</TableCell>
                  <TableCell className="font-medium">{image.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{image.tag}</Badge>
                  </TableCell>
                  <TableCell>{image.size}</TableCell>
                  <TableCell>{image.created}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsInfoDialogOpen(true)}
                    >
                      Info
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {}
      <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Image Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">QNX Base Image</h3>
              <p className="text-sm text-muted-foreground">
                This is the official QNX OS base image used for containerization. It provides the core
                QNX Neutrino RTOS environment for your containerized applications.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Features</h3>
              <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                <li>QNX Neutrino RTOS kernel</li>
                <li>POSIX-compliant API</li>
                <li>Real-time scheduling</li>
                <li>Resource management</li>
                <li>Minimal footprint</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsInfoDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Container Image</DialogTitle>
            <DialogDescription>
              Upload a container image archive (.tar.gz) to use with QNXtainer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="imageName" className="text-sm font-medium">
                Image Name
              </label>
              <input
                type="text"
                id="imageName"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={imageName}
                onChange={(e) => setImageName(e.target.value)}
                placeholder="my-app"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="imageTag" className="text-sm font-medium">
                Tag
              </label>
              <input
                type="text"
                id="imageTag"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={imageTag}
                onChange={(e) => setImageTag(e.target.value)}
                placeholder="latest"
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <label htmlFor="imageFile" className="text-sm font-medium">
                Image File
              </label>
              <input
                type="file"
                id="imageFile"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                accept=".tar.gz"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUploadImage}
              disabled={!uploadFile || !imageName}
            >
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImagesView; 
