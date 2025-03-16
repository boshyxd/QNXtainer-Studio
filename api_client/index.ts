
export interface Container {
  id: string;
  name: string;
  status: string;
  cpu: number;
  memory: number;
  image?: {
    id: string;
    name: string;
    tag: string;
  };
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
    this.baseUrl = `${config.serverUrl}`;
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
      formData.append('file', imageFile);
      formData.append('name', imageName);
      formData.append('tag', imageTag);
      
      const response = await fetch(`${this.baseUrl}/upload-image`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      return await JSON.parse(JSON.stringify(response));
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  }

  async createContainer(imageId: string, name: string): Promise<{ status: string, container_id: string }> {
    try {
      const formData = new FormData();
      formData.append("image_id", imageId);
      formData.append("name", name);

      const response = await fetch(`${this.baseUrl}/create-container`, {
        method: 'POST',
        mode: 'cors',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
        console.error('Failed to create container:', error);
      throw error;
    }
  }

  async startContainerFromImage(imageId: string): Promise<{ status: string, container_id: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/start-from-image/${imageId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to start container from image:', error);
      throw error;
    }
  }

  async startContainer(containerId: string): Promise<{ status: string, container_id: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/start/${containerId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to start container:', error);
      throw error;
    }
  }

  async stopContainer(containerId: string): Promise<{ status: string, container_id: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/stop/${containerId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to stop container:', error);
      throw error;
    }
  }
}

export default QNXtainerApiClient; 