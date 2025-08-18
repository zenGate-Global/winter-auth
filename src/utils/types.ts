/**
 * GPS coordinates extracted from image EXIF data
 */
export interface GPSCoordinates {
  /** Latitude in decimal degrees */
  latitude: number;
  /** Longitude in decimal degrees */
  longitude: number;
  /** Altitude in meters (if available) */
  altitude?: number;
  /** GPS reference for latitude (N/S) */
  latitudeRef?: string;
  /** GPS reference for longitude (E/W) */
  longitudeRef?: string;
}

/**
 * Camera and photo technical details
 */
export interface CameraInfo {
  /** Camera make/manufacturer */
  make?: string;
  /** Camera model */
  model?: string;
  /** Camera software/firmware version */
  software?: string;
  /** Lens model */
  lensModel?: string;
  /** ISO sensitivity */
  iso?: number;
  /** Aperture value (f-stop) */
  aperture?: number;
  /** Shutter speed in seconds */
  shutterSpeed?: string;
  /** Focal length in mm */
  focalLength?: number;
  /** Flash mode */
  flash?: string;
  /** White balance mode */
  whiteBalance?: string;
}

/**
 * Image dimensions and technical details
 */
export interface ImageInfo {
  /** Image width in pixels */
  width?: number;
  /** Image height in pixels */
  height?: number;
  /** Color space */
  colorSpace?: string;
  /** Orientation/rotation */
  orientation?: number;
  /** Resolution in DPI */
  xResolution?: number;
  /** Resolution in DPI */
  yResolution?: number;
  /** Bits per sample */
  bitsPerSample?: number;
}

/**
 * Date and time information
 */
export interface DateTimeInfo {
  /** Original date/time when photo was taken */
  dateTimeOriginal?: string;
  /** Date/time when file was created */
  dateTime?: string;
  /** Date/time when file was digitized */
  dateTimeDigitized?: string;
  /** Timezone offset */
  offsetTime?: string;
}

/**
 * Comprehensive image metadata extraction result
 */
export interface ImageMetadata {
  /** GPS location data (null if not available) */
  gps: GPSCoordinates | null;
  /** Camera and photo technical information */
  camera: CameraInfo;
  /** Image dimensions and technical details */
  image: ImageInfo;
  /** Date and time information */
  dateTime: DateTimeInfo;
  /** Raw EXIF data for advanced use cases */
  rawExif?: Record<string, unknown>;
  /** Whether GPS data was found in the image */
  hasGPS: boolean;
  /** File name */
  fileName?: string;
  /** File size in bytes */
  fileSize?: number;
}

/**
 * Options for metadata extraction
 */
export interface MetadataExtractionOptions {
  /** Whether to include raw EXIF data in the result */
  includeRawExif?: boolean;
  /** Whether to validate GPS coordinates */
  validateGPS?: boolean;
  /** Custom fields to extract from EXIF data */
  customFields?: string[];
}

/**
 * Error types for metadata extraction
 */
export enum MetadataExtractionError {
  INVALID_FILE = 'INVALID_FILE',
  NO_EXIF_DATA = 'NO_EXIF_DATA',
  UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT',
  CORRUPTED_DATA = 'CORRUPTED_DATA',
  GPS_PARSING_ERROR = 'GPS_PARSING_ERROR'
}

/**
 * Result wrapper for metadata extraction
 */
export interface MetadataExtractionResult {
  /** Whether the extraction was successful */
  success: boolean;
  /** Extracted metadata (null if extraction failed) */
  data: ImageMetadata | null;
  /** Error information if extraction failed */
  error?: {
    type: MetadataExtractionError;
    message: string;
  };
}

// ============================================================================
// FACIAL BIOMETRIC VERIFICATION TYPES REMOVED - see modules/authorization/types for canonical definitions

// ============================================================================

/**
 * Face descriptor/embedding - 1024-dimension vector representing a face
 */
export type FaceDescriptor = number[];

/**
 * Verification modes for facial biometric comparison
 */
export enum VerificationMode {
  /** Compare two static images */
  BY_IMAGES = 'BY_IMAGES',
  /** Compare base image with live camera feed */
  BY_CAMERA = 'BY_CAMERA'
}

/**
 * Verification status results
 */
export enum VerificationStatus {
  /** Verification successful - faces match */
  VERIFIED = 'VERIFIED',
  /** Verification failed - faces don't match */
  REJECTED = 'REJECTED',
  /** No face detected in base image */
  NO_BASE_FACE = 'NO_BASE_FACE',
  /** No face detected in comparison image */
  NO_COMPARE_FACE = 'NO_COMPARE_FACE',
  /** Face quality too low for reliable comparison */
  POOR_QUALITY = 'POOR_QUALITY',
  /** Multiple faces detected - ambiguous comparison */
  MULTIPLE_FACES = 'MULTIPLE_FACES',
  /** Processing error occurred */
  ERROR = 'ERROR',
  /** Liveness detection failed - possible spoofing attempt */
  LIVENESS_FAILED = 'LIVENESS_FAILED',
  /** Challenge-response test failed */
  CHALLENGE_FAILED = 'CHALLENGE_FAILED'
}

/**
 * Face quality assessment result
 */
export interface FaceQualityCheck {
  /** Overall quality score (0-1) */
  qualityScore: number;
  /** Whether face is looking directly at camera */
  isLookingAtCamera: boolean;
  /** Face detection confidence (0-1) */
  confidence: number;
  /** Face size relative to image (0-1) */
  faceSize: number;
  /** Face angle/rotation assessment */
  faceAngle: {
    roll: number;
    pitch: number;
    yaw: number;
  };
  /** Whether lighting conditions are adequate */
  hasGoodLighting: boolean;
  /** Liveness detection result */
  livenessCheck?: LivenessDetectionResult;
}

/**
 * Liveness detection modes
 */
export enum LivenessDetectionMode {
  /** Basic liveness using blink detection */
  BLINK_DETECTION = 'BLINK_DETECTION',
  /** Motion-based liveness detection */
  MOTION_DETECTION = 'MOTION_DETECTION',
  /** Depth analysis for 3D face verification */
  DEPTH_ANALYSIS = 'DEPTH_ANALYSIS',
  /** Texture analysis to detect screen/paper artifacts */
  TEXTURE_ANALYSIS = 'TEXTURE_ANALYSIS',
  /** Challenge-response interaction */
  CHALLENGE_RESPONSE = 'CHALLENGE_RESPONSE',
  /** Environmental consistency checks */
  ENVIRONMENTAL_ANALYSIS = 'ENVIRONMENTAL_ANALYSIS',
  /** Temporal consistency across frames */
  TEMPORAL_CONSISTENCY = 'TEMPORAL_CONSISTENCY'
}

/**
 * Challenge types for challenge-response liveness detection
 */
export enum ChallengeType {
  /** Ask user to blink */
  BLINK = 'BLINK',
  /** Ask user to smile */
  SMILE = 'SMILE',
  /** Ask user to turn head left */
  TURN_LEFT = 'TURN_LEFT',
  /** Ask user to turn head right */
  TURN_RIGHT = 'TURN_RIGHT',
  /** Ask user to nod head */
  NOD = 'NOD',
  /** Ask user to open mouth */
  OPEN_MOUTH = 'OPEN_MOUTH'
}

/**
 * Result of a single liveness check
 */
export interface LivenessCheckResult {
  /** Type of liveness check performed */
  mode: LivenessDetectionMode;
  /** Whether this specific check passed */
  passed: boolean;
  /** Confidence score for this check (0-1) */
  confidence: number;
  /** Detailed analysis data */
  analysis: {
    /** Detected motion/change magnitude */
    motionMagnitude?: number;
    /** Blink detection results */
    blinkDetection?: {
      blinksDetected: number;
      blinkRate: number;
      naturalBlinkPattern: boolean;
    };
    /** Depth analysis results */
    depthAnalysis?: {
      depthVariation: number;
      is3DFace: boolean;
      flatnessScore: number;
    };
    /** Texture analysis results */
    textureAnalysis?: {
      screenArtifacts: number;
      paperTexture: number;
      pixelationScore: number;
    };
    /** Environmental consistency */
    environmentalConsistency?: {
      lightingVariation: number;
      shadowConsistency: number;
      reflectionDetection: number;
    };
    /** Challenge response results */
    challengeResponse?: {
      challenge: ChallengeType;
      yaw: number;
    }
  } | Record<string, unknown>;
}

/**
 * Overall liveness detection result
 */
export interface LivenessDetectionResult {
  /** Whether liveness detection passed overall */
  isLive: boolean;
  /** Overall confidence score (0-1) */
  confidence: number;
  /** Results of individual liveness checks */
  checks: LivenessCheckResult[];
  /** Processing time in milliseconds */
  processingTime: number;
  /** Risk assessment */
  riskAssessment: {
    /** Overall risk score (0-1, higher = more risky) */
    riskScore: number;
    /** Detected spoofing indicators */
    spoofingIndicators: string[];
    /** Recommendations for improving liveness detection */
    recommendations: string[];
  };
}

/**
 * Result of comparing two face descriptors
 */
export interface FaceComparisonResult {
  /** Similarity percentage (0-100) */
  similarityPercent: number;
  /** Raw similarity score (0-1) */
  similarityScore: number;
  /** Whether faces are considered a match */
  isMatch: boolean;
  /** Distance metric between face descriptors */
  distance: number;
  /** Confidence in the comparison result */
  confidence: number;
}

/**
 * Comprehensive facial verification result
 */
export interface FacialVerificationResult {
  /** Verification status */
  status: VerificationStatus;
  /** Face comparison details (if faces were found) */
  comparison?: FaceComparisonResult;
  /** Quality assessment of base face */
  baseQuality?: FaceQualityCheck;
  /** Quality assessment of comparison face */
  compareQuality?: FaceQualityCheck;
  /** Liveness detection result */
  livenessResult?: LivenessDetectionResult;
  /** Processing time in milliseconds */
  processingTime: number;
  /** Error message if verification failed */
  errorMessage?: string;
  /** Additional metadata */
  metadata: {
    /** Verification mode used */
    mode: VerificationMode;
    /** Timestamp of verification */
    timestamp: Date;
    /** Number of faces detected in base image */
    baseFaceCount: number;
    /** Number of faces detected in comparison image */
    compareFaceCount: number;
    /** Whether liveness detection was performed */
    livenessDetectionPerformed: boolean;
    /** Anti-spoofing measures applied */
    antiSpoofingMeasures: LivenessDetectionMode[];
  };
}

/**
 * Video-based facial verification result for enhanced liveness detection
 */
export interface VideoFacialVerificationResult extends FacialVerificationResult {
  /** Frame-by-frame analysis results */
  frameAnalysis: {
    /** Total number of frames analyzed */
    totalFrames: number;
    /** Number of frames with successful face detection */
    successfulFrames: number;
    /** Consistency score across frames (0-1) */
    consistencyScore: number;
    /** Detected motion patterns */
    motionPatterns: {
      /** Overall motion magnitude */
      magnitude: number;
      /** Motion consistency (natural vs artificial) */
      consistency: number;
      /** Detected micro-expressions */
      microExpressions: string[];
    };
  };
}

/**
 * Configuration options for facial biometric verification
 */
export interface FacialBiometricOptions {
  /** Similarity threshold for considering faces a match (0-1, default: 0.5) */
  similarityThreshold?: number;
  /** Minimum quality score required for face verification (0-1, default: 0.6) */
  minQualityScore?: number;
  /** Whether to require face to be looking at camera (default: true) */
  requireDirectGaze?: boolean;
  /** Maximum face angle deviation allowed in degrees (default: 30) */
  maxFaceAngle?: number;
  /** Minimum face size relative to image (0-1, default: 0.1) */
  minFaceSize?: number;
  /** Whether to return detailed quality assessment (default: true) */
  includeQualityCheck?: boolean;
  /** Backend to use for Human library (default: 'webgl') */
  backend?: 'webgl' | 'wasm' | 'cpu';
  /** Whether to enable face mesh for better accuracy (default: true) */
  enableFaceMesh?: boolean;
  /** Whether to enable face rotation detection (default: true) */
  enableRotation?: boolean;
  
  // === ANTI-SPOOFING / LIVENESS DETECTION OPTIONS ===
  /** Whether to enable liveness detection (default: false) */
  enableLivenessDetection?: boolean;
  /** Liveness detection modes to use (default: [BLINK_DETECTION, MOTION_DETECTION]) */
  livenessDetectionModes?: LivenessDetectionMode[];
  /** Minimum liveness confidence required (0-1, default: 0.7) */
  minLivenessConfidence?: number;
  /** Maximum acceptable risk score (0-1, default: 0.3) */
  maxRiskScore?: number;
  /** Whether to enable challenge-response interaction (default: false) */
  enableChallengeResponse?: boolean;
  /** Challenge types to use if challenge-response is enabled */
  challengeTypes?: ChallengeType[];
  /** Timeout for challenge-response in milliseconds (default: 10000) */
  challengeTimeout?: number;
  /** Whether to enable depth analysis (default: false) */
  enableDepthAnalysis?: boolean;
  /** Whether to enable texture analysis (default: true) */
  enableTextureAnalysis?: boolean;
  /** Whether to enable environmental consistency checks (default: false) */
  enableEnvironmentalAnalysis?: boolean;
  /** Whether to enable temporal consistency checks (default: false) */
  enableTemporalConsistency?: boolean;
  /** Number of frames to analyze for temporal consistency (default: 5) */
  temporalFrameCount?: number;
}

/**
 * Result of an interactive verification step
*/
export interface InteractiveVerificationResult {
  /** Current status of the interactive session */
  status: 'CHALLENGE_REQUIRED' | 'CHALLENGE_PENDING' | 'SUCCESS' | 'FAILURE' | 'TIMEOUT';
  /** The challenge to be presented to the user */
  challenge?: {
    type: ChallengeType;
    message: string;
  };
  /** The final verification result (only on SUCCESS) */
  verification?: FacialVerificationResult;
  /** An error or failure message */
  message?: string;
  /** Head pose feedback (yaw, progress, target) */
  pose?: {
    yaw: number;
    progress: number; // 0-1
    target: number;
  };
}

// ============================================================================
// ERROR AND UTILITY TYPES
// ============================================================================

/**
 * Error types for facial verification
 */
export enum FacialVerificationError {
  INVALID_INPUT = 'INVALID_INPUT',
  MODEL_LOAD_ERROR = 'MODEL_LOAD_ERROR',
  NO_FACE_DETECTED = 'NO_FACE_DETECTED',
  MULTIPLE_FACES = 'MULTIPLE_FACES',
  POOR_IMAGE_QUALITY = 'POOR_IMAGE_QUALITY',
  PROCESSING_ERROR = 'PROCESSING_ERROR',
  UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT',
  LIVENESS_DETECTION_FAILED = 'LIVENESS_DETECTION_FAILED',
  SPOOFING_DETECTED = 'SPOOFING_DETECTED',
  CHALLENGE_TIMEOUT = 'CHALLENGE_TIMEOUT',
  INSUFFICIENT_MOTION = 'INSUFFICIENT_MOTION',
  DEPTH_ANALYSIS_FAILED = 'DEPTH_ANALYSIS_FAILED',
  TEXTURE_ANALYSIS_FAILED = 'TEXTURE_ANALYSIS_FAILED',
  ENVIRONMENTAL_INCONSISTENCY = 'ENVIRONMENTAL_INCONSISTENCY',
  TEMPORAL_INCONSISTENCY = 'TEMPORAL_INCONSISTENCY'
}

/**
 * Security strength levels for verification
 */
export enum SecurityStrength {
  /** Basic security - texture analysis only */
  LOW = 'LOW',
  /** Standard security - blink + motion + texture */
  MEDIUM = 'MEDIUM', 
  /** High security - multiple detection modes */
  HIGH = 'HIGH',
  /** Maximum security - all detection modes + challenges */
  MAXIMUM = 'MAXIMUM'
}

/** Type alias for cleaner API */
export type FacialBiometricResult = FacialVerificationResult;

/** Type alias for cleaner API */
export type FaceQualityAssessment = FaceQualityCheck; 