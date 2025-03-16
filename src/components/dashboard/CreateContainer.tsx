import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CreateContainer: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-qnx">Create Container</CardTitle>
          <CardDescription>Deploy a new containerized application</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted">
              <TabsTrigger value="general" className="data-[state=active]:bg-qnx data-[state=active]:text-white">General</TabsTrigger>
              <TabsTrigger value="resources" className="data-[state=active]:bg-qnx data-[state=active]:text-white">Resources</TabsTrigger>
              <TabsTrigger value="networking" className="data-[state=active]:bg-qnx data-[state=active]:text-white">Networking</TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4 mt-4">
              <div className="grid w-full items-center gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Container Name</Label>
                  <Input id="name" placeholder="my-qnx-app" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an image" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="qnx-base">qnx-base:latest</SelectItem>
                      <SelectItem value="qnx-runtime">qnx-runtime:8.0</SelectItem>
                      <SelectItem value="qnx-dev">qnx-dev:latest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="command">Command</Label>
                  <Input id="command" placeholder="Optional startup command" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="resources" className="space-y-4 mt-4">
              <div className="grid w-full items-center gap-4">
                <div className="space-y-2">
                  <Label>CPU Limit (%)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider defaultValue={[50]} max={100} step={1} className="flex-1 [&>span]:bg-qnx" />
                    <span className="w-12 text-center">50%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Memory Limit (MB)</Label>
                  <div className="flex items-center space-x-4">
                    <Slider defaultValue={[512]} max={2048} step={64} className="flex-1 [&>span]:bg-qnx" />
                    <span className="w-12 text-center">512</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select defaultValue="normal">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="networking" className="space-y-4 mt-4">
              <div className="grid w-full items-center gap-4">
                <div className="space-y-2">
                  <Label htmlFor="network">Network</Label>
                  <Select defaultValue="bridge">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bridge">Bridge</SelectItem>
                      <SelectItem value="host">Host</SelectItem>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="port">Port Mappings</Label>
                  <div className="flex space-x-2">
                    <Input placeholder="Host Port" className="w-1/2" />
                    <Input placeholder="Container Port" className="w-1/2" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-qnx hover:bg-qnx-dark">Create Container</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateContainer; 