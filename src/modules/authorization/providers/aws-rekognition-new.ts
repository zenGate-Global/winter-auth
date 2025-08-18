import {
	RekognitionClient,
	DetectFacesCommand,
	CompareFacesCommand,
	type DetectFacesCommandInput,
	type CompareFacesCommandInput,
	type Face,
	type ComparedFace
} from '@aws-sdk/client-rekognition';
import { BaseFaceRecognitionProvider, type ProviderConfig } from './base-provider';
import type {
  ImageQualityResult,
  ImageVerificationResult,
  LiveVideoVerificationResult,
  SecurityStrength,
  VerificationStatus,
  WinterAuthError
} from '../types';
import { SecurityStrength as SecurityStrengthEnum } from '../types';

/**
 * AWS Rekognition Face Recognition Provider
 * Implements face recognition using AWS Rekognition API with official AWS SDK
 */
export class AWSRekognitionProvider extends BaseFaceRecognitionProvider {
  public readonly name = 'aws';
  
  private rekognitionClient?: RekognitionClient;
  private accessKeyId?: string;
  private secretAccessKey?: string;
  private region?: string;

  /**
   * Initialize the AWS Rekognition provider with credentials
   */
  async initialize(config: ProviderConfig): Promise<void> {
    try {
      // Extract AWS credentials from config
      this.accessKeyId = config.accessKeyId || config.apiKey;
      this.secretAccessKey = config.secretAccessKey;
      this.region = config.region || 'us-east-1';
      
      // Validate required credentials
      if (!this.accessKeyId || !this.secretAccessKey) {
        throw new Error('AWS credentials are required: accessKeyId and secretAccessKey must be provided in config');
      }

      // Initialize AWS Rekognition client with proper credentials
      this.rekognitionClient = new RekognitionClient({
        region: this.region,
        credentials: {
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey
        }
      });

      // Test the connection with a simple call
      await this.testConnection();
      
      this._isInitialized = true;
      console.log(`✅ AWS Rekognition provider initialized successfully (region: ${this.region})`);
    } catch (error) {
      this._isInitialized = false;
      throw new Error(`AWS Rekognition initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Test AWS Rekognition connection by calling a simple API
   */
  private async testConnection(): Promise<void> {
    try {
      // Create a minimal test image (1x1 pixel base64 PNG)
      const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      const testImageBytes = Buffer.from(testImageBase64, 'base64');
      
      const params: DetectFacesCommandInput = {
        Image: {
          Bytes: testImageBytes
        },
        Attributes: ['DEFAULT']
      };

      // This should fail gracefully (no faces in 1px image) but validates credentials
      await this.rekognitionClient!.send(new DetectFacesCommand(params));
    } catch (error: any) {
      // If it's a credentials error, re-throw
      if (error?.name === 'UnauthorizedOperation' || 
          error?.name === 'InvalidAccessKeyId' || 
          error?.name === 'SignatureDoesNotMatch' ||
          error?.message?.includes('signature') ||
          error?.message?.includes('credentials')) {
        throw error;
      }
      // Other errors (like no faces detected) are expected and OK
    }
  }

  /**
   * Check image quality using AWS Rekognition DetectFaces
   */
  async checkImageQuality(
    imageInput: string | HTMLCanvasElement | HTMLImageElement | File | Blob
  ): Promise<ImageQualityResult> {
    this.ensureInitialized();
    
    try {
      const imageBytes = await this.convertImageToBytes(imageInput);
      
      const params: DetectFacesCommandInput = {
        Image: {
          Bytes: imageBytes
        },
        Attributes: ['ALL'] // Get detailed face attributes for quality analysis
      };

      const result = await this.rekognitionClient!.send(new DetectFacesCommand(params));
      const faces = result.FaceDetails || [];

      // Check for basic quality issues
      const errors: WinterAuthError[] = [];

      if (faces.length === 0) {
        errors.push({
          code: 'NO_FACE_DETECTED',
          message: 'No face detected in the image',
          timestamp: Date.now()
        });
      } else if (faces.length > 1) {
        errors.push({
          code: 'MULTIPLE_FACES_DETECTED',
          message: `Multiple faces detected: ${faces.length} faces`,
          timestamp: Date.now()
        });
      }

      // Check face quality if a face was detected
      if (faces.length > 0) {
        const face = faces[0];
        const confidence = face.Confidence || 0;

        if (confidence < 80) {
          errors.push({
            code: 'LOW_FACE_CONFIDENCE',
            message: `Low face detection confidence: ${confidence.toFixed(1)}%`,
            timestamp: Date.now()
          });
        }

        // Check for quality issues from AWS Rekognition
        const quality = face.Quality;
        if (quality) {
          if (quality.Brightness && quality.Brightness < 30) {
            errors.push({
              code: 'IMAGE_TOO_DARK',
              message: `Image too dark: brightness ${quality.Brightness.toFixed(1)}`,
              timestamp: Date.now()
            });
          }

          if (quality.Sharpness && quality.Sharpness < 30) {
            errors.push({
              code: 'IMAGE_TOO_BLURRY',
              message: `Image too blurry: sharpness ${quality.Sharpness.toFixed(1)}`,
              timestamp: Date.now()
            });
          }
        }

        // Check pose angles
        const pose = face.Pose;
        if (pose) {
          const maxAngle = 30;
          if (Math.abs(pose.Yaw || 0) > maxAngle || 
              Math.abs(pose.Pitch || 0) > maxAngle || 
              Math.abs(pose.Roll || 0) > maxAngle) {
            errors.push({
              code: 'HEAD_POSE_TOO_EXTREME',
              message: 'Head pose angle too extreme for reliable recognition',
              timestamp: Date.now()
            });
          }
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        details: {
          faceCount: faces.length,
          faceDetails: faces.map(face => ({
            confidence: face.Confidence || 0,
            quality: face.Quality,
            pose: face.Pose,
            landmarks: face.Landmarks
          }))
        },
        timestamp: Date.now()
      };

    } catch (error) {
      return {
        isValid: false,
        errors: [{
          code: 'AWS_API_ERROR',
          message: `AWS Rekognition API error: ${error instanceof Error ? error.message : 'Unknown error'}`,
          timestamp: Date.now()
        }],
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: Date.now()
      };
    }
  }

  /**
   * Compare two faces using AWS Rekognition CompareFaces
   */
  async compareByImage(
    referenceImage: string | HTMLCanvasElement | HTMLImageElement | File | Blob,
    targetImage: string | HTMLCanvasElement | HTMLImageElement | File | Blob,
    options?: { securityLevel?: SecurityStrength }
  ): Promise<ImageVerificationResult> {
    this.ensureInitialized();

    try {
      const referenceBytes = await this.convertImageToBytes(referenceImage);
      const targetBytes = await this.convertImageToBytes(targetImage);

      const params: CompareFacesCommandInput = {
        SourceImage: {
          Bytes: referenceBytes
        },
        TargetImage: {
          Bytes: targetBytes
        },
        SimilarityThreshold: this.getThresholdForSecurityLevel(options?.securityLevel)
      };

      const result = await this.rekognitionClient!.send(new CompareFacesCommand(params));
      
      const faceMatches = result.FaceMatches || [];
      const unmatchedFaces = result.UnmatchedFaces || [];

      // Get the best match
      let similarity = 0;
      if (faceMatches.length > 0) {
        similarity = Math.max(...faceMatches.map(match => match.Similarity || 0));
      }

      const similarityPercent = Math.round(similarity);
      const threshold = this.getThresholdForSecurityLevel(options?.securityLevel);
      const isMatch = similarity >= threshold;

      return {
        similarity: similarity / 100, // Convert to 0-1 scale
        similarityPercent,
        isMatch,
        confidence: similarity,
        details: {
          provider: 'aws',
          threshold: threshold,
          faceMatches: faceMatches.length,
          unmatchedFaces: unmatchedFaces.length,
          awsResult: {
            faceMatches,
            unmatchedFaces
          }
        },
        timestamp: Date.now()
      };

    } catch (error) {
      return {
        similarity: 0,
        similarityPercent: 0,
        isMatch: false,
        confidence: 0,
        details: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          provider: 'aws'
        },
        timestamp: Date.now()
      };
    }
  }

  /**
   * Compare reference image with live video frame
   * Uses the same compareByImage method since video frames are processed as images
   */
  async compareByLiveVideo(
    referenceImage: string | HTMLCanvasElement | HTMLImageElement | File | Blob,
    videoElement: HTMLVideoElement,
    options?: {
      securityLevel?: SecurityStrength;
      enableLivenessCheck?: boolean;
    }
  ): Promise<LiveVideoVerificationResult> {
    this.ensureInitialized();

    try {
      // Capture current frame from video
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      ctx.drawImage(videoElement, 0, 0);

      // Convert canvas to blob for comparison
      const videoFrameBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to convert canvas to blob'));
        }, 'image/jpeg', 0.9);
      });

      // Use image comparison for the face verification
      const imageResult = await this.compareByImage(referenceImage, videoFrameBlob, options);

      // Simple liveness check (placeholder - AWS doesn't have built-in liveness detection)
      const livenessResult = {
        isLive: true, // Placeholder - would need additional implementation
        confidence: 85 // Placeholder confidence
      };

      return {
        isMatch: imageResult.isMatch,
        similarity: imageResult.similarity,
        similarityPercent: imageResult.similarityPercent,
        confidence: imageResult.confidence,
        livenessResult,
        details: {
          ...imageResult.details,
          liveness: livenessResult
        },
        timestamp: Date.now()
      };

    } catch (error) {
      return {
        isMatch: false,
        similarity: 0,
        similarityPercent: 0,
        confidence: 0,
        livenessResult: {
          isLive: false,
          confidence: 0
        },
        details: { 
          error: error instanceof Error ? error.message : 'Unknown error',
          provider: 'aws'
        },
        timestamp: Date.now()
      };
    }
  }

  /**
   * Convert various image inputs to Buffer for AWS SDK
   */
  private async convertImageToBytes(
    imageInput: string | HTMLCanvasElement | HTMLImageElement | File | Blob
  ): Promise<Buffer> {
    if (typeof imageInput === 'string') {
      // Handle base64 string
      const base64Data = imageInput.replace(/^data:image\/[a-z]+;base64,/, '');
      return Buffer.from(base64Data, 'base64');
    }

    if (imageInput instanceof File || imageInput instanceof Blob) {
      const arrayBuffer = await imageInput.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    if (imageInput instanceof HTMLCanvasElement) {
      return new Promise((resolve, reject) => {
        imageInput.toBlob((blob) => {
          if (blob) {
            blob.arrayBuffer().then(arrayBuffer => {
              resolve(Buffer.from(arrayBuffer));
            }).catch(reject);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        }, 'image/jpeg', 0.9);
      });
    }

    if (imageInput instanceof HTMLImageElement) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Failed to get canvas context');
      }

      canvas.width = imageInput.naturalWidth;
      canvas.height = imageInput.naturalHeight;
      ctx.drawImage(imageInput, 0, 0);

      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            blob.arrayBuffer().then(arrayBuffer => {
              resolve(Buffer.from(arrayBuffer));
            }).catch(reject);
          } else {
            reject(new Error('Failed to convert image to blob'));
          }
        }, 'image/jpeg', 0.9);
      });
    }

    throw new Error('Unsupported image input type');
  }

  /**
   * Get similarity threshold based on security level
   */
  private getThresholdForSecurityLevel(securityLevel?: SecurityStrength): number {
    switch (securityLevel) {
      case SecurityStrengthEnum.LOW:
        return 70; // AWS uses 0-100 scale
      case SecurityStrengthEnum.MEDIUM:
        return 85;
      case SecurityStrengthEnum.HIGH:
        return 95;
      case SecurityStrengthEnum.MAXIMUM:
        return 98;
      default:
        return 85; // Default to MEDIUM
    }
  }

  /**
   * Ensure the provider is initialized before making API calls
   */
  private ensureInitialized(): void {
    if (!this._isInitialized || !this.rekognitionClient) {
      throw new Error('AWS Rekognition provider not initialized. Call initialize() first.');
    }
  }
}
