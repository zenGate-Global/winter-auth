// Winter Authenticator - Main Authorization Module
// Enterprise-grade biometric face verification with provider system
// Supports AWS Rekognition, Azure Face API, and other cloud providers

// Main authenticator class
export { WinterAuthenticator } from './core/winter-authenticator';

// Provider system
export { ProviderFactory } from './providers/provider-factory';
export { AWSRekognitionProvider } from './providers/aws-rekognition';
export type { 
  IFaceRecognitionProvider, 
  ProviderConfig, 
  ProviderFactoryConfig,
  BaseFaceRecognitionProvider 
} from './providers/base-provider';

// Types and interfaces
export type {
  // Main interfaces
  IWinterAuthenticator,
  WinterAuthConfig,
  
  // Security and verification types
  SecurityStrength,
  VerificationStatus,
  ChallengeType,
  
  // Result types
  ImageQualityResult,
  FaceComparisonResult,
  LivenessResult,
  ChallengeResult,
  ImageVerificationResult,
  LiveVideoVerificationResult,
  
  // Configuration types
  ChallengeConfig,
  
  // Error types
  WinterAuthError
} from './types';

// Constants
export {
  SECURITY_THRESHOLDS,
  ERROR_CODES,
  QUALITY_THRESHOLDS,
  PROVIDER_DEFAULTS
} from './constants';

// Convenience factory function
import { WinterAuthenticator } from './core/winter-authenticator';
import type { WinterAuthConfig } from './types';

/**
 * Create a new Winter Authenticator instance
 * @param config Optional configuration
 * @returns Configured WinterAuthenticator instance
 */
export function createWinterAuth(config?: Partial<WinterAuthConfig>): WinterAuthenticator {
  return new WinterAuthenticator(config);
}

/**
 * Get available face recognition providers
 * @returns Array of supported provider names
 */
export function getAvailableProviders(): string[] {
  return WinterAuthenticator.getAvailableProviders();
}

/**
 * Validate provider configuration
 * @param providerName Name of the provider to validate
 * @returns Validation result with missing environment variables
 */
export function validateProviderConfiguration(providerName: string): { isValid: boolean; missingVars: string[] } {
  return WinterAuthenticator.validateProviderConfiguration(providerName);
}

// Export specific enums for direct use
export { SecurityStrength, VerificationStatus } from './types';

// Default export for convenience
export default WinterAuthenticator;