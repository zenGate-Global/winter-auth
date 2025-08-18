import type {
  ImageQualityResult,
  ImageVerificationResult,
  LiveVideoVerificationResult,
  SecurityStrength,
  WinterAuthConfig
} from '../types';

/**
 * Base interface for all face recognition providers
 * This ensures all providers implement the same methods required by the GUIDE.md
 */
export interface IFaceRecognitionProvider {
  /**
   * Provider name (e.g., 'aws', 'azure', 'kairos')
   */
  readonly name: string;

  /**
   * Initialize the provider with API credentials
   */
  initialize(config: ProviderConfig): Promise<void>;

  /**
   * Check if the provider is properly initialized
   */
  isInitialized(): boolean;

  /**
   * Image quality check - verify if image is good enough for face recognition
   * Implements checkImageQuality from GUIDE.md
   */
  checkImageQuality(
    imageInput: string | HTMLCanvasElement | HTMLImageElement | File | Blob
  ): Promise<ImageQualityResult>;

  /**
   * Compare two images for face matching
   * Implements compareByImage from GUIDE.md
   */
  compareByImage(
    referenceImage: string | HTMLCanvasElement | HTMLImageElement | File | Blob,
    targetImage: string | HTMLCanvasElement | HTMLImageElement | File | Blob,
    options?: { securityLevel?: SecurityStrength }
  ): Promise<ImageVerificationResult>;

  /**
   * Compare reference image with live video stream
   * Implements compareByLiveVideo from GUIDE.md
   */
  compareByLiveVideo(
    referenceImage: string | HTMLCanvasElement | HTMLImageElement | File | Blob,
    videoElement: HTMLVideoElement,
    options?: {
      securityLevel?: SecurityStrength;
      enableLivenessCheck?: boolean;
      enableChallenges?: boolean;
      onProgress?: (progress: { stage: string; progress: number; feedback: string }) => void;
    }
  ): Promise<LiveVideoVerificationResult>;

  /**
   * Clean up resources and dispose the provider
   */
  dispose(): Promise<void>;
}

/**
 * Base configuration for all providers
 */
export interface ProviderConfig {
  /**
   * API key or access key for the provider
   */
  apiKey: string;

  /**
   * Additional provider-specific configuration
   */
  [key: string]: any;
}

/**
 * Provider factory configuration
 */
export interface ProviderFactoryConfig {
  provider: string;
  config: ProviderConfig;
}

/**
 * Abstract base class that providers can extend
 * Provides common functionality and ensures interface compliance
 */
export abstract class BaseFaceRecognitionProvider implements IFaceRecognitionProvider {
  public abstract readonly name: string;
  protected _isInitialized = false;

  abstract initialize(config: ProviderConfig): Promise<void>;

  isInitialized(): boolean {
    return this._isInitialized;
  }

  abstract checkImageQuality(
    imageInput: string | HTMLCanvasElement | HTMLImageElement | File | Blob
  ): Promise<ImageQualityResult>;

  abstract compareByImage(
    referenceImage: string | HTMLCanvasElement | HTMLImageElement | File | Blob,
    targetImage: string | HTMLCanvasElement | HTMLImageElement | File | Blob,
    options?: { securityLevel?: SecurityStrength }
  ): Promise<ImageVerificationResult>;

  abstract compareByLiveVideo(
    referenceImage: string | HTMLCanvasElement | HTMLImageElement | File | Blob,
    videoElement: HTMLVideoElement,
    options?: {
      securityLevel?: SecurityStrength;
      enableLivenessCheck?: boolean;
      enableChallenges?: boolean;
      onProgress?: (progress: { stage: string; progress: number; feedback: string }) => void;
    }
  ): Promise<LiveVideoVerificationResult>;

  abstract dispose(): Promise<void>;

  /**
   * Helper method to ensure provider is initialized
   */
  protected ensureInitialized(): void {
    if (!this._isInitialized) {
      throw new Error(`${this.name} provider is not initialized. Call initialize() first.`);
    }
  }

  /**
   * Helper method to convert different image input types to base64
   */
  protected async imageToBase64(
    imageInput: string | HTMLCanvasElement | HTMLImageElement | File | Blob
  ): Promise<string> {
    if (typeof imageInput === 'string') {
      // If it's a URL, fetch and convert
      if (imageInput.startsWith('http') || imageInput.startsWith('data:')) {
        const response = await fetch(imageInput);
        const blob = await response.blob();
        return this.blobToBase64(blob);
      }
      // If it's already base64, return as is
      return imageInput;
    }

    if (imageInput instanceof HTMLCanvasElement) {
      return imageInput.toDataURL('image/jpeg', 0.8).split(',')[1];
    }

    if (imageInput instanceof HTMLImageElement) {
      const canvas = document.createElement('canvas');
      canvas.width = imageInput.naturalWidth;
      canvas.height = imageInput.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');
      ctx.drawImage(imageInput, 0, 0);
      return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
    }

    if (imageInput instanceof File || imageInput instanceof Blob) {
      return this.blobToBase64(imageInput);
    }

    throw new Error('Unsupported image input type');
  }

  /**
   * Helper method to convert Blob to base64
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]); // Remove data URL prefix
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}