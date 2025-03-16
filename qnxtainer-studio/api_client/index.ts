
export interface Container {
  id: string;
  status: string;
  cpu: number;
  memory: number;
  image?: string;
}

export interface Image {
  id: string;
  name: string;
  tag: string;
  created_at: string;
}

export interface ServerState {
  images: Image[];
  containers: Container[];
}

export interface ApiConfig {
  serverUrl: string;
  port: number;
}

class QNXtainerApiClient {
  private baseUrl: string;
  
  constructor(config: ApiConfig) {
    this.baseUrl = `http://${config.serverUrl}:${config.port}`;
  }

  async getState(): Promise<ServerState> {
    try {
      const response = await fetch(`${this.baseUrl}/state`);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch server state:', error);
      throw error;
    }
  }

  async uploadImage(imageFile: File, imageName: string, imageTag: string = 'latest'): Promise<{ status: string }> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('name', imageName);
      formData.append('tag', imageTag);
      
      const response = await fetch(`${this.baseUrl}/upload-image`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  }

  async startContainer(imageId: string): Promise<{ status: string, image_id: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/start/${imageId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to start container:', error);
      throw error;
    }
  }

  async stopContainer(containerId: string): Promise<{ status: string, image_id: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/stop/${containerId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to stop container:', error);
      throw error;
    }
  }
}

export default QNXtainerApiClient; 