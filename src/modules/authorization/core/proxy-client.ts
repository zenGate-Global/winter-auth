import type {
  WinterAuthConfig,
  ImageQualityResult,
  ImageVerificationResult,
  LiveVideoVerificationResult,
  SecurityStrength,
  WinterAuthError
} from '../types';
import { ERROR_CODES } from '../constants';

/**
 * Proxy client for Winter Authenticator
 * Sends requests to backend API routes instead of using providers directly
 */
export class WinterAuthProxyClient {
  private config: WinterAuthConfig;
  private baseUrl: string;

  constructor(config: WinterAuthConfig) {
    this.config = config;
    
    if (!config.apiBaseUrl) {
      throw new Error('apiBaseUrl is required when using proxy mode');
    }
    
    this.baseUrl = config.apiBaseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  async initialize(): Promise<void> {
    // Test connection to the API
    try {
      const response = await this.makeRequest('/health', { method: 'GET' });
      if (!response.ok) {
        throw new Error(`API health check failed: ${response.status}`);
      }
      
      if (this.config.enableConsoleLogging) {
        console.log('✅ Winter Authenticator proxy client connected to backend API');
      }
    } catch (error) {
      throw new Error(`Failed to connect to Winter Auth API at ${this.baseUrl}: ${error}`);
    }
  }

  async checkImageQuality(
    imageInput: string | HTMLCanvasElement | HTMLImageElement | File | Blob
  ): Promise<ImageQualityResult> {
    const imageData = await this.processImageInput(imageInput);
    
    const response = await this.makeRequest('', {
      method: 'POST',
      body: JSON.stringify({ 
        method: 'checkImageQuality',
        params: { image: imageData }
      }),
    });

    const result = await this.handleResponse<{ result: ImageQualityResult }>(response);
    return result.result;
  }

  async compareByImage(
    referenceImage: string | HTMLCanvasElement | HTMLImageElement | File | Blob,
    targetImage: string | HTMLCanvasElement | HTMLImageElement | File | Blob,
    options?: { securityLevel?: SecurityStrength }
  ): Promise<ImageVerificationResult> {
    const refImageData = await this.processImageInput(referenceImage);
    const targetImageData = await this.processImageInput(targetImage);
    
    const response = await this.makeRequest('', {
      method: 'POST',
      body: JSON.stringify({
        method: 'compareByImage',
        params: {
          referenceImage: refImageData,
          targetImage: targetImageData,
          securityLevel: options?.securityLevel || this.config.securityLevel
        }
      }),
    });

    const result = await this.handleResponse<{ result: ImageVerificationResult }>(response);
    return result.result;
  }

  async compareByLiveVideo(
    referenceImage: string | HTMLCanvasElement | HTMLImageElement | File | Blob,
    videoElement: HTMLVideoElement,
    options?: {
      securityLevel?: SecurityStrength;
      enableLivenessCheck?: boolean;
      enableChallenges?: boolean;
      onProgress?: (progress: { stage: string; progress: number; feedback: string }) => void;
    }
  ): Promise<LiveVideoVerificationResult> {
    const refImageData = await this.processImageInput(referenceImage);
    
    // Capture frame from video
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(videoElement, 0, 0);
    const videoFrameData = canvas.toDataURL('image/jpeg', 0.8);
    
    const response = await this.makeRequest('', {
      method: 'POST',
      body: JSON.stringify({
        method: 'compareByLiveVideo',
        params: {
          referenceImage: refImageData,
          videoFrame: videoFrameData,
          securityLevel: options?.securityLevel || this.config.securityLevel,
          enableLivenessCheck: options?.enableLivenessCheck,
          enableChallenges: options?.enableChallenges
        }
      }),
    });

    const result = await this.handleResponse<{ result: LiveVideoVerificationResult }>(response);
    return result.result;
  }

  getProviderInfo(): { name: string; isInitialized: boolean } | null {
    return { name: 'Proxy Client', isInitialized: true };
  }

  async dispose(): Promise<void> {
    // Nothing to dispose for proxy client
  }

  private async processImageInput(
    imageInput: string | HTMLCanvasElement | HTMLImageElement | File | Blob
  ): Promise<string> {
    if (typeof imageInput === 'string') {
      return imageInput;
    }

    if (imageInput instanceof HTMLCanvasElement) {
      return imageInput.toDataURL('image/jpeg', 0.8);
    }

    if (imageInput instanceof HTMLImageElement) {
      const canvas = document.createElement('canvas');
      canvas.width = imageInput.naturalWidth;
      canvas.height = imageInput.naturalHeight;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(imageInput, 0, 0);
      return canvas.toDataURL('image/jpeg', 0.8);
    }

    if (imageInput instanceof File || imageInput instanceof Blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageInput);
      });
    }

    throw new Error('Unsupported image input type');
  }

  private async makeRequest(endpoint: string, options: RequestInit): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    return response;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: WinterAuthError = {
        code: errorData.code || ERROR_CODES.API_ERROR,
        message: errorData.message || `API request failed: ${response.status}`,
        details: errorData.details,
        timestamp: Date.now()
      };
      throw error;
    }

    return response.json();
  }
}