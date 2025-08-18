/// <reference lib="dom" />

// Removed Human library dependency - now using provider system

// Security Levels
export enum SecurityStrength {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM', 
  HIGH = 'HIGH',
  MAXIMUM = 'MAXIMUM'
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  SUCCESS = 'SUCCESS', 
  FAILED = 'FAILED',
  TIMEOUT = 'TIMEOUT',
  ERROR = 'ERROR',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED'
}

// Challenge Types
export enum ChallengeStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum ChallengeType {
  TURN_LEFT = 'TURN_LEFT',
  TURN_RIGHT = 'TURN_RIGHT',
  BLINK = 'BLINK',
  NOD = 'NOD'
}

// Base Error Interface
export interface WinterAuthError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: number;
}

// Face Detection Result
export interface FaceDetectionResult {
  confidence: number;
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  landmarks?: Array<{ x: number; y: number }>;
  rotation?: {
    yaw: number;
    pitch: number;
    roll: number;
  };
  quality?: {
    sharpness: number;
    brightness: number;
    contrast: number;
  };
}

// Image Quality Assessment
export interface ImageQualityResult {
  isGoodQuality: boolean;
  score: number; // 0-100
  issues: WinterAuthError[]; // List of quality issues found
  details: {
    faceCount: number;
    faceConfidence?: number;
    resolution: { width: number; height: number };
    faceSize?: number; // Percentage of image
    blur?: number;
    brightness?: number;
    contrast?: number;
    headPose?: number; // Yaw angle in degrees
  };
}

// Face Comparison Result
export interface FaceComparisonResult {
  framesAnalyzed?: number;
  successfulMatches?: number;
  averageSimilarity?: number;
  isMatch: boolean;
  similarity: number; // 0-1 scale (0-100% when displayed)
  similarityPercent: number; // Pre-calculated percentage
  distance?: number; // L2 distance (lower = more similar)
  confidence: number;
  threshold: number;
  processingTime: number;
  features?: { extractedFeatures1: number; extractedFeatures2: number; matchedFeatures: number };
  error?: WinterAuthError;
}

// Liveness Detection Result
export interface LivenessResult {
  isLive: boolean;
  confidence: number; // 0-100
  details: {
    headMovementScore: number;
    textureScore: number;
    blinkDetected?: boolean;
    spoofIndicators: string[];
    faceConfidence: number;
    movementHistory: number[];
    timestamp: number;
    face?: FaceResult; // Raw face data for advanced checks
  };
  timestamp: number;
}

// Challenge Configuration
export interface ChallengeConfig {
  type: ChallengeType;
  timeout: number; // milliseconds
  timeoutMs: number; // Alias for timeout
  instruction: string;
  minMovement?: number; // Optional minimum movement threshold
}

// Challenge Result
export interface ChallengeResult {
  type: ChallengeType;
  status: VerificationStatus;
  isSuccessful: boolean;
  progress: number; // 0-1 progress
  isCompleted: boolean; // Alias for progress === 1
  duration: number; // milliseconds
  feedback?: string;
  timestamp: number;
}

// Image Verification Result
export interface ImageVerificationResult {
  verified: boolean;
  isMatch: boolean; // Alias for verified
  confidence: number;
  similarity: number;
  similarityPercent: number; // Pre-calculated percentage
  qualityResult: ImageQualityResult;
  comparisonResult: FaceComparisonResult;
  error?: WinterAuthError;
  processingTime: number;
  timestamp: number;
}

// Live Video Verification Result
export interface LiveVideoVerificationResult {
  verified: boolean;
  isMatch: boolean; // Alias for verified
  status: VerificationStatus;
  confidence: number;
  similarity: number;
  qualityResult?: ImageQualityResult;
  comparisonResult?: FaceComparisonResult;
  livenessResult?: LivenessResult;
  challenges?: ChallengeResult[];
  framesAnalyzed: number;
  processingTime: number;
  securityLevel: SecurityStrength;
  error?: WinterAuthError;
  timestamp: number;
}

// Configuration Options
export interface WinterAuthConfig {
  securityLevel?: SecurityStrength;
  enableConsoleLogging?: boolean;
  preloadModels?: boolean; // Whether to preload models on init
  enableLivenessCheck?: boolean;
  enableChallenges?: boolean;
  // Proxy mode configuration
  mode?: 'direct' | 'proxy';
  apiBaseUrl?: string; // Required when mode is 'proxy'
}

// Challenge Handler Configuration
export interface ChallengeHandlerConfig {
  enableConsoleLogging?: boolean;
}

// Winter Authenticator Main Interface
export interface IWinterAuthenticator {
  // Initialization
  isInitialized: boolean;
  
  // Core Methods
  checkImageQuality(imageInput: string | HTMLCanvasElement | HTMLImageElement | File | Blob): Promise<ImageQualityResult>;
  compareByImage(referenceImage: string | HTMLCanvasElement | HTMLImageElement | File | Blob, targetImage: string | HTMLCanvasElement | HTMLImageElement | File | Blob, options?: { securityLevel?: SecurityStrength }): Promise<ImageVerificationResult>;
  compareByLiveVideo(referenceImage: string | HTMLCanvasElement | HTMLImageElement | File | Blob, videoElement: HTMLVideoElement, options?: { securityLevel?: SecurityStrength; enableLivenessCheck?: boolean; enableChallenges?: boolean; onProgress?: (progress: { stage: string; progress: number; feedback: string }) => void }): Promise<LiveVideoVerificationResult>;
  
  // Configuration
  updateConfig(config: Partial<WinterAuthConfig>): void;
  getStats(): { totalVerifications: number; successRate: number };
  dispose(): Promise<void>;
}
