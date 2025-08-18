import type { IFaceRecognitionProvider, ProviderConfig } from './base-provider';
import { AWSRekognitionProvider } from './aws-rekognition';

/**
 * Provider Factory
 * Creates and manages face recognition providers based on environment configuration
 */
export class ProviderFactory {
  private static providers = new Map<string, IFaceRecognitionProvider>();

  /**
   * Create a provider instance
   */
  static async createProvider(providerName: string, config: ProviderConfig): Promise<IFaceRecognitionProvider> {
    // Check if provider already exists and is initialized
    const existingProvider = this.providers.get(providerName);
    if (existingProvider && existingProvider.isInitialized()) {
      return existingProvider;
    }

    let provider: IFaceRecognitionProvider;

    switch (providerName.toLowerCase()) {
      case 'aws':
      case 'aws-rekognition':
        provider = new AWSRekognitionProvider();
        break;
      
      // Future providers can be added here:
      // case 'azure':
      //   provider = new AzureFaceProvider();
      //   break;
      // case 'kairos':
      //   provider = new KairosProvider();
      //   break;
      
      default:
        throw new Error(`Unknown provider: ${providerName}. Supported providers: aws`);
    }

    await provider.initialize(config);
    this.providers.set(providerName, provider);
    
    return provider;
  }

  /**
   * Get provider from environment variables (server-side only)
   * Works universally across all frameworks: Next.js, SvelteKit, Nuxt, etc.
   */
  static async createFromEnvironment(): Promise<IFaceRecognitionProvider> {
    const providerName = this.getEnvironmentVariable('WAUTH_PROVIDER');
    
    if (!providerName) {
      throw new Error('WAUTH_PROVIDER environment variable is required. Set it to: aws, azure, kairos, etc.');
    }

    const config = this.getProviderConfig(providerName);
    return this.createProvider(providerName, config);
  }

  /**
   * Get provider configuration based on provider name
   */
  private static getProviderConfig(providerName: string): ProviderConfig {
    switch (providerName.toLowerCase()) {
      case 'aws':
      case 'aws-rekognition':
        return {
          apiKey: this.getEnvironmentVariable('WAUTH_ACCESS_KEY'), // Access Key ID
          accessKeyId: this.getEnvironmentVariable('WAUTH_ACCESS_KEY'), // Explicit mapping
          secretAccessKey: this.getEnvironmentVariable('WAUTH_SECRET_KEY'),
          region: this.getOptionalEnvironmentVariable('WAUTH_AWS_REGION', 'us-east-1')
        };
      
      case 'azure':
        return {
          apiKey: this.getEnvironmentVariable('WAUTH_API_KEY'),
          endpoint: this.getEnvironmentVariable('WAUTH_ENDPOINT') // Azure requires endpoint
        };
      
      case 'kairos':
        return {
          apiKey: this.getEnvironmentVariable('WAUTH_API_KEY'),
          appId: this.getEnvironmentVariable('WAUTH_APP_ID') // Kairos requires app ID
        };
      
      default:
        return {
          apiKey: this.getEnvironmentVariable('WAUTH_API_KEY')
        };
    }
  }

  /**
   * Get environment variable with validation
   * Universal support for all frameworks (server-side only)
   */
  private static getEnvironmentVariable(name: string): string {
    // Server-side environment variables only
    const value = process.env[name];
    
    if (!value) {
      throw new Error(`Environment variable ${name} is required for the selected provider`);
    }
    
    return value;
  }

  /**
   * Get optional environment variable with fallback
   * Universal support for all frameworks (server-side only)
   */
  private static getOptionalEnvironmentVariable(name: string, fallback: string): string {
    // Server-side environment variables only
    return process.env[name] || fallback;
  }

  /**
   * Dispose all providers
   */
  static async disposeAll(): Promise<void> {
    const disposePromises = Array.from(this.providers.values()).map(provider => provider.dispose());
    await Promise.all(disposePromises);
    this.providers.clear();
  }

  /**
   * Get available provider names
   */
  static getAvailableProviders(): string[] {
    return ['aws', 'azure', 'kairos'];
  }

  /**
   * Validate provider configuration
   */
  static validateConfiguration(providerName: string): { isValid: boolean; missingVars: string[] } {
    const missingVars: string[] = [];

    try {
      switch (providerName.toLowerCase()) {
        case 'aws':
        case 'aws-rekognition':
          if (!this.hasEnvironmentVariable('WAUTH_ACCESS_KEY')) missingVars.push('WAUTH_ACCESS_KEY');
          if (!this.hasEnvironmentVariable('WAUTH_SECRET_KEY')) missingVars.push('WAUTH_SECRET_KEY');
          break;
        
        case 'azure':
          if (!this.hasEnvironmentVariable('WAUTH_API_KEY')) missingVars.push('WAUTH_API_KEY');
          if (!this.hasEnvironmentVariable('WAUTH_ENDPOINT')) missingVars.push('WAUTH_ENDPOINT');
          break;
        
        case 'kairos':
          if (!this.hasEnvironmentVariable('WAUTH_API_KEY')) missingVars.push('WAUTH_API_KEY');
          if (!this.hasEnvironmentVariable('WAUTH_APP_ID')) missingVars.push('WAUTH_APP_ID');
          break;
        
        default:
          if (!this.hasEnvironmentVariable('WAUTH_API_KEY')) missingVars.push('WAUTH_API_KEY');
      }
    } catch (error) {
      // Environment variable check failed
    }

    return {
      isValid: missingVars.length === 0,
      missingVars
    };
  }

  /**
   * Check if environment variable exists
   */
  private static hasEnvironmentVariable(name: string): boolean {
    try {
      this.getEnvironmentVariable(name);
      return true;
    } catch {
      return false;
    }
  }
}