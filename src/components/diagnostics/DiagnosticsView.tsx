import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for charts
const cpuData = [
  { time: '00:00', value: 25 },
  { time: '01:00', value: 30 },
  { time: '02:00', value: 45 },
  { time: '03:00', value: 40 },
  { time: '04:00', value: 35 },
  { time: '05:00', value: 55 },
  { time: '06:00', value: 60 },
  { time: '07:00', value: 45 },
  { time: '08:00', value: 40 },
  { time: '09:00', value: 45 },
];

const memoryData = [
  { time: '00:00', value: 512 },
  { time: '01:00', value: 600 },
  { time: '02:00', value: 750 },
  { time: '03:00', value: 800 },
  { time: '04:00', value: 700 },
  { time: '05:00', value: 650 },
  { time: '06:00', value: 900 },
  { time: '07:00', value: 850 },
  { time: '08:00', value: 700 },
  { time: '09:00', value: 750 },
];

const DiagnosticsView: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Diagnostics</h1>
        <p className="text-muted-foreground">System resource monitoring and diagnostics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <CardDescription>Current: 45%</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45%</div>
            <Progress value={45} className="h-2 mt-2 bg-muted [&>div]:bg-qnx" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <CardDescription>512MB / 2GB</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25%</div>
            <Progress value={25} className="h-2 mt-2 bg-muted [&>div]:bg-qnx" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <CardDescription>5GB / 20GB</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25%</div>
            <Progress value={25} className="h-2 mt-2 bg-muted [&>div]:bg-qnx" />
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resource History</CardTitle>
          <CardDescription>Historical resource usage</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cpu" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-muted">
              <TabsTrigger value="cpu" className="data-[state=active]:bg-qnx data-[state=active]:text-white">CPU</TabsTrigger>
              <TabsTrigger value="memory" className="data-[state=active]:bg-qnx data-[state=active]:text-white">Memory</TabsTrigger>
            </TabsList>
            <TabsContent value="cpu" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={cpuData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="CPU %" stroke="#ff443b" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="memory" className="mt-4">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={memoryData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" name="Memory (MB)" stroke="#ff443b" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>QNX system details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">QNX System</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">OS Version:</span>
                  <span>QNX SDP 8.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kernel:</span>
                  <span>8.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Architecture:</span>
                  <span>ARM64</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hostname:</span>
                  <span>qnx-device</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Hardware</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPU:</span>
                  <span>ARM Cortex-A72</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cores:</span>
                  <span>4</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Memory:</span>
                  <span>2 GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Storage:</span>
                  <span>20 GB</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DiagnosticsView; 