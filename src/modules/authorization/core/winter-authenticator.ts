import { ProviderFactory } from '../providers/provider-factory';
import type { IFaceRecognitionProvider } from '../providers/base-provider';
import { WinterAuthProxyClient } from './proxy-client';
import { 
  ERROR_CODES
} from '../constants';
import {
  SecurityStrength,
  VerificationStatus,
} from '../types';
import type {
  WinterAuthConfig,
  IWinterAuthenticator,
  ImageQualityResult,
  ImageVerificationResult,
  LiveVideoVerificationResult,
  WinterAuthError,
} from '../types';

/**
 * Winter Authenticator
 * The main class for handling face verification and liveness detection.
 * Now uses provider system for face recognition (AWS, Azure, etc.)
 */
export class WinterAuthenticator implements IWinterAuthenticator {
  private config: WinterAuthConfig;
  private provider?: IFaceRecognitionProvider;
  private proxyClient?: WinterAuthProxyClient;
  private stats = { totalVerifications: 0, successfulVerifications: 0 };
  public isInitialized = false;
  
  // Expose provider for testing purposes
  public get _provider() {
    return this.provider;
  }

  // Check if using proxy mode
  public get isProxyMode() {
    return this.config.mode === 'proxy';
  }

  constructor(config?: Partial<WinterAuthConfig>) {
    this.config = {
      securityLevel: SecurityStrength.MEDIUM,
      enableConsoleLogging: false,
      preloadModels: true,
      enableLivenessCheck: true,
      enableChallenges: true,
      mode: 'direct', // Default to direct mode
      ...config
    };

    // Validate proxy mode configuration
    if (this.config.mode === 'proxy' && !this.config.apiBaseUrl) {
      throw new Error('apiBaseUrl is required when using proxy mode');
    }
  }

  /**
   * Initialize Winter Authenticator
   * - Direct mode: Uses environment variables (server-side only)
   * - Proxy mode: Connects to API endpoint (frontend-safe)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    try {
      if (this.config.mode === 'proxy') {
        // Initialize proxy client for frontend use
        this.proxyClient = new WinterAuthProxyClient(this.config);
        await this.proxyClient.initialize();
        this.isInitialized = true;
        
        if (this.config.enableConsoleLogging) {
          console.log(`✅ Winter Authenticator initialized in proxy mode (${this.config.apiBaseUrl})`);
        }
      } else {
        // Initialize provider from environment variables (server-side)
        this.provider = await ProviderFactory.createFromEnvironment();
        this.isInitialized = true;
        
        if (this.config.enableConsoleLogging) {
          console.log(`✅ Winter Authenticator initialized with ${this.provider.name} provider`);
        }
      }
    } catch (error) {
      this.isInitialized = false;
      const mode = this.config.mode === 'proxy' ? 'proxy client' : 'face recognition provider';
      throw this.createError(
        ERROR_CODES.INITIALIZATION_FAILED, 
        `Failed to initialize ${mode}. ${this.config.mode === 'proxy' ? 'Check API endpoint.' : 'Check environment variables.'}`, 
        error
      );
    }
  }

  updateConfig(newConfig: Partial<WinterAuthConfig>): void {
    this.config = { ...this.config, ...newConfig };
    if (this.config.enableConsoleLogging) {
      console.log('Winter Authenticator configuration updated.');
    }
  }

  getStats(): { totalVerifications: number; successRate: number } {
    const successRate = this.stats.totalVerifications > 0 
      ? (this.stats.successfulVerifications / this.stats.totalVerifications) * 100 
      : 0;
    return {
      totalVerifications: this.stats.totalVerifications,
      successRate: parseFloat(successRate.toFixed(2)),
    };
  }

  async dispose(): Promise<void> {
    if (this.provider) {
      await this.provider.dispose();
      this.provider = undefined;
    }
    await ProviderFactory.disposeAll();
    this.isInitialized = false;
    
    if (this.config.enableConsoleLogging) {
      console.log('🗑️ Winter Authenticator disposed.');
    }
  }

  async checkImageQuality(
    imageInput: string | HTMLImageElement | HTMLCanvasElement | File | Blob
  ): Promise<ImageQualityResult> {
    await this.ensureInitialized();
    
    try {
      if (this.config.mode === 'proxy') {
        return await this.proxyClient!.checkImageQuality(imageInput);
      } else {
        return await this.provider!.checkImageQuality(imageInput);
      }
    } catch (error) {
      throw this.createError(ERROR_CODES.QUALITY_CHECK_FAILED, 'Image quality check failed', error);
    }
  }

  async compareByImage(
    referenceImage: string | HTMLImageElement | HTMLCanvasElement | File | Blob,
    targetImage: string | HTMLImageElement | HTMLCanvasElement | File | Blob,
    options?: { securityLevel?: SecurityStrength }
  ): Promise<ImageVerificationResult> {
    await this.ensureInitialized();
    this.stats.totalVerifications++;
    
    const securityLevel = options?.securityLevel || this.config.securityLevel || SecurityStrength.MEDIUM;
    
    try {
      let result: ImageVerificationResult;
      
      if (this.config.mode === 'proxy') {
        result = await this.proxyClient!.compareByImage(referenceImage, targetImage, { securityLevel });
      } else {
        result = await this.provider!.compareByImage(referenceImage, targetImage, { securityLevel });
      }
      
      if (result.verified) {
        this.stats.successfulVerifications++;
      }
      
      if (this.config.enableConsoleLogging) {
        console.log(`🎯 Image comparison: ${result.verified ? 'MATCH' : 'NO MATCH'} (${result.similarityPercent}%)`);
      }
      
      return result;
    } catch (error) {
      const err = this.createError(ERROR_CODES.FACE_COMPARISON_FAILED, 'Face comparison by image failed', error);
      
      return {
        verified: false,
        isMatch: false,
        confidence: 0,
        similarity: 0,
        similarityPercent: 0,
        qualityResult: { 
          isGoodQuality: false, 
          score: 0, 
          issues: [], 
          details: { 
            faceCount: 0, 
            resolution: { width: 0, height: 0 } 
          } 
        },
        comparisonResult: { 
          isMatch: false, 
          similarity: 0, 
          similarityPercent: 0,
          confidence: 0, 
          threshold: 0,
          processingTime: 0,
        },
        error: err,
        processingTime: 0,
        timestamp: Date.now(),
      };
    }
  }

  async compareByLiveVideo(
    referenceImage: string | HTMLCanvasElement | HTMLImageElement | File | Blob,
    videoElement: HTMLVideoElement,
    options: {
      securityLevel?: SecurityStrength;
      enableLivenessCheck?: boolean;
      enableChallenges?: boolean;
      onProgress?: (progress: { stage: string; progress: number; feedback: string }) => void;
    } = {}
  ): Promise<LiveVideoVerificationResult> {
    await this.ensureInitialized();
    this.stats.totalVerifications++;
    
    const {
      securityLevel = this.config.securityLevel || SecurityStrength.MEDIUM,
      enableLivenessCheck = this.config.enableLivenessCheck,
      enableChallenges = this.config.enableChallenges,
      onProgress,
    } = options;

    const reportProgress = (stage: string, progress: number, feedback: string) => {
      onProgress?.({ stage, progress, feedback });
    };

    try {
      let result: LiveVideoVerificationResult;
      
      if (this.config.mode === 'proxy') {
        result = await this.proxyClient!.compareByLiveVideo(referenceImage, videoElement, {
          securityLevel,
          enableLivenessCheck,
          enableChallenges,
          onProgress: reportProgress
        });
      } else {
        // Delegate to provider for live video comparison
        // Note: challenges are handled by the provider (AWS Face Liveness, etc.)
        result = await this.provider!.compareByLiveVideo(referenceImage, videoElement, {
          securityLevel,
          enableLivenessCheck,
          enableChallenges,
          onProgress: reportProgress
        });
      }
      
      if (result.verified) {
        this.stats.successfulVerifications++;
      }
      
      if (this.config.enableConsoleLogging) {
        console.log(`🎥 Live video verification: ${result.verified ? 'SUCCESS' : 'FAILED'} (${Math.round((result.similarity || 0) * 100)}%)`);
      }
      
      return result;
    } catch (error) {
      const err = this.createError(ERROR_CODES.LIVE_VIDEO_FAILED, 'Live video verification failed', error);
      
      return {
        verified: false,
        isMatch: false,
        status: VerificationStatus.ERROR,
        confidence: 0,
        similarity: 0,
        framesAnalyzed: 0,
        processingTime: 0,
        securityLevel,
        timestamp: Date.now(),
        error: err
      };
    }
  }

  /**
   * Get provider information for debugging
   */
  getProviderInfo(): { name: string; isInitialized: boolean } | null {
    if (this.config.mode === 'proxy') {
      if (!this.proxyClient) return null;
      return this.proxyClient.getProviderInfo();
    } else {
      if (!this.provider) return null;
      return {
        name: this.provider.name,
        isInitialized: this.provider.isInitialized()
      };
    }
  }

  /**
   * Get available providers
   */
  static getAvailableProviders(): string[] {
    return ProviderFactory.getAvailableProviders();
  }

  /**
   * Validate current provider configuration
   */
  static validateProviderConfiguration(providerName: string): { isValid: boolean; missingVars: string[] } {
    return ProviderFactory.validateConfiguration(providerName);
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      if (this.config.preloadModels) {
        await this.initialize();
      } else {
        throw this.createError(ERROR_CODES.NOT_INITIALIZED, 'Authenticator not initialized. Call initialize() first.');
      }
    }
  }

  private createError(code: string, message: string, originalError?: unknown): WinterAuthError {
    const error: WinterAuthError = {
      code,
      message,
      timestamp: Date.now(),
    };
    
    if (originalError) {
      error.details = originalError instanceof Error ? originalError.toString() : JSON.stringify(originalError);
    }
    
    if (this.config.enableConsoleLogging) {
      console.error(`[WinterAuthError] ${code}: ${message}`, originalError);
    }
    
    return error;
  }
}