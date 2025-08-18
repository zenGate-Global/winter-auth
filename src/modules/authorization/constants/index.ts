// Security Level Thresholds (similarity-based, 0-1 scale)
// NOTE: These are similarity thresholds - HIGHER values = MORE strict
export const SECURITY_THRESHOLDS = {
  LOW: 0.60,        // 60% similarity - Basic protection
  MEDIUM: 0.70,     // 70% similarity - Standard protection
  HIGH: 0.80,       // 80% similarity - High security
  MAXIMUM: 0.90     // 90% similarity - Maximum security
} as const;

// Provider-agnostic quality thresholds
export const QUALITY_THRESHOLDS = {
  MIN_FACE_CONFIDENCE: 70,        // Minimum confidence percentage
  MIN_IMAGE_SIZE: 200,            // Minimum width/height in pixels
  MIN_QUALITY_SCORE: 70,          // Overall quality score (0-100)
} as const;

// Error Codes
export const ERROR_CODES = {
  // Initialization Errors
  PROVIDER_INIT_FAILED: 'PROVIDER_INIT_FAILED',
  INVALID_PROVIDER: 'INVALID_PROVIDER',
  INITIALIZATION_FAILED: 'INITIALIZATION_FAILED',
  MISSING_ENV_VARS: 'MISSING_ENV_VARS',
  
  // Input Validation Errors
  INVALID_IMAGE_FORMAT: 'INVALID_IMAGE_FORMAT',
  IMAGE_TOO_SMALL: 'IMAGE_TOO_SMALL',
  IMAGE_TOO_LARGE: 'IMAGE_TOO_LARGE',
  
  // Face Detection Errors
  NO_FACE_DETECTED: 'NO_FACE_DETECTED',
  MULTIPLE_FACES_DETECTED: 'MULTIPLE_FACES_DETECTED',
  FACE_TOO_SMALL: 'FACE_TOO_SMALL',
  LOW_FACE_CONFIDENCE: 'LOW_FACE_CONFIDENCE',
  
  // Quality Check Errors
  LOW_RESOLUTION: 'LOW_RESOLUTION',
  TOO_BLURRY: 'TOO_BLURRY',
  POOR_LIGHTING: 'POOR_LIGHTING',
  LOW_BRIGHTNESS: 'LOW_BRIGHTNESS',
  LOW_SHARPNESS: 'LOW_SHARPNESS',
  HEAD_POSE_ANGLE: 'HEAD_POSE_ANGLE',
  IMAGE_PROCESSING_FAILED: 'IMAGE_PROCESSING_FAILED',
  NOT_INITIALIZED: 'NOT_INITIALIZED',
  QUALITY_CHECK_FAILED: 'QUALITY_CHECK_FAILED',
  
  // Comparison Errors
  SIMILARITY_TOO_LOW: 'SIMILARITY_TOO_LOW',
  FEATURE_EXTRACTION_FAILED: 'FEATURE_EXTRACTION_FAILED',
  FACE_COMPARISON_FAILED: 'FACE_COMPARISON_FAILED',
  
  // Live Verification Errors
  CAMERA_ACCESS_DENIED: 'CAMERA_ACCESS_DENIED',
  LIVENESS_CHECK_FAILED: 'LIVENESS_CHECK_FAILED',
  SPOOF_DETECTED: 'SPOOF_DETECTED',
  LIVE_VIDEO_FAILED: 'LIVE_VIDEO_FAILED',
  
  // Provider-specific Errors
  API_RATE_LIMIT: 'API_RATE_LIMIT',
  API_QUOTA_EXCEEDED: 'API_QUOTA_EXCEEDED',
  INVALID_API_KEY: 'INVALID_API_KEY',
  PROVIDER_ERROR: 'PROVIDER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  
  // System Errors
  PROCESSING_TIMEOUT: 'PROCESSING_TIMEOUT',
  MEMORY_ERROR: 'MEMORY_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

// Provider-specific configuration defaults
export const PROVIDER_DEFAULTS = {
  // AWS Rekognition
  AWS: {
    REGION: 'us-east-1',
    MAX_RETRIES: 3,
    TIMEOUT_MS: 30000,
  },
  
  // Azure Face API
  AZURE: {
    MAX_RETRIES: 3,
    TIMEOUT_MS: 30000,
  },
  
  // General
  COMMON: {
    IMAGE_MAX_SIZE: 5 * 1024 * 1024, // 5MB
    VIDEO_FRAME_INTERVAL: 200,        // ms between frame samples
    VIDEO_SAMPLE_COUNT: 10,           // frames to analyze for live video
  }
} as const;