/**
 * Enhanced AWS Rekognition Provider with additional face attributes
 * This extends the current implementation with demographic and emotional analysis
 */

import {
	RekognitionClient,
	DetectFacesCommand,
	CompareFacesCommand,
	RecognizeCelebritiesCommand,
	DetectModerationLabelsCommand,
	CreateFaceLivenessSessionCommand,
	GetFaceLivenessSessionResultsCommand,
	type DetectFacesCommandInput,
	type CompareFacesCommandInput,
	type Face,
	type ComparedFace,
	type FaceDetail,
	type Celebrity,
	type ModerationLabel
} from '@aws-sdk/client-rekognition';

import { AWSRekognitionProvider } from './aws-rekognition';
import type { ImageQualityResult } from '../types';

// Enhanced face attributes interface
export interface EnhancedFaceAttributes {
  demographics: {
    ageRange: { low: number; high: number };
    gender: { value: string; confidence: number };
  };
  emotions: Array<{ type: string; confidence: number }>;
  eyeState: {
    left: { open: boolean; confidence: number };
    right: { open: boolean; confidence: number };
  };
  mouthState: {
    open: boolean;
    confidence: number;
  };
  smile: { 
    value: boolean; 
    confidence: number;
  };
  accessories: {
    sunglasses: { present: boolean; confidence: number };
    eyeglasses: { present: boolean; confidence: number };
  };
  facialHair: {
    mustache: { present: boolean; confidence: number };
    beard: { present: boolean; confidence: number };
  };
  quality: {
    brightness: number;
    sharpness: number;
  };
  pose: {
    roll: number;
    yaw: number;
    pitch: number;
  };
}

// Celebrity detection result
export interface CelebrityDetectionResult {
  celebrities: Array<{
    name: string;
    id: string;
    confidence: number;
    faceBox: {
      width: number;
      height: number;
      left: number;
      top: number;
    };
  }>;
  isCelebrityDetected: boolean;
  totalCelebrities: number;
}

// Content moderation result
export interface ContentModerationResult {
  isAppropriate: boolean;
  moderationLabels: Array<{
    name: string;
    confidence: number;
    parentName?: string;
  }>;
  totalInappropriateLabels: number;
}

// Enhanced image quality result that includes all new attributes
export interface EnhancedImageQualityResult extends ImageQualityResult {
  enhancedAttributes?: EnhancedFaceAttributes;
  celebrityDetection?: CelebrityDetectionResult;
  contentModeration?: ContentModerationResult;
  securityScore: number; // 0-100 overall security assessment
  recommendations: string[]; // Actionable improvements
}

/**
 * Enhanced AWS Rekognition Provider
 * Extends the current implementation with advanced face analysis
 */
export class EnhancedAWSRekognitionProvider extends AWSRekognitionProvider {
  public readonly name = 'aws-enhanced';

  /**
   * Analyze enhanced face attributes using AWS Rekognition's full capabilities
   */
  async analyzeEnhancedFaceAttributes(
    imageInput: string | HTMLCanvasElement | HTMLImageElement | File | Blob
  ): Promise<EnhancedFaceAttributes | null> {
    this.ensureInitialized();

    try {
      const imageBytes = await this.convertImageToBytes(imageInput);
      
      const params: DetectFacesCommandInput = {
        Image: { Bytes: imageBytes },
        Attributes: ['ALL'] // Get all available attributes
      };

      const result = await this.rekognitionClient!.send(new DetectFacesCommand(params));
      
      if (!result.FaceDetails || result.FaceDetails.length === 0) {
        return null;
      }

      const face = result.FaceDetails[0] as FaceDetail;
      
      return {
        demographics: {
          ageRange: {
            low: face.AgeRange?.Low || 0,
            high: face.AgeRange?.High || 0
          },
          gender: {
            value: face.Gender?.Value || 'Unknown',
            confidence: face.Gender?.Confidence || 0
          }
        },
        emotions: (face.Emotions || []).map(emotion => ({
          type: emotion.Type || 'Unknown',
          confidence: emotion.Confidence || 0
        })),
        eyeState: {
          left: {
            open: face.EyesOpen?.Value || false,
            confidence: face.EyesOpen?.Confidence || 0
          },
          right: {
            open: face.EyesOpen?.Value || false,
            confidence: face.EyesOpen?.Confidence || 0
          }
        },
        mouthState: {
          open: face.MouthOpen?.Value || false,
          confidence: face.MouthOpen?.Confidence || 0
        },
        smile: {
          value: face.Smile?.Value || false,
          confidence: face.Smile?.Confidence || 0
        },
        accessories: {
          sunglasses: {
            present: face.Sunglasses?.Value || false,
            confidence: face.Sunglasses?.Confidence || 0
          },
          eyeglasses: {
            present: face.Eyeglasses?.Value || false,
            confidence: face.Eyeglasses?.Confidence || 0
          }
        },
        facialHair: {
          mustache: {
            present: face.Mustache?.Value || false,
            confidence: face.Mustache?.Confidence || 0
          },
          beard: {
            present: face.Beard?.Value || false,
            confidence: face.Beard?.Confidence || 0
          }
        },
        quality: {
          brightness: face.Quality?.Brightness || 0,
          sharpness: face.Quality?.Sharpness || 0
        },
        pose: {
          roll: face.Pose?.Roll || 0,
          yaw: face.Pose?.Yaw || 0,
          pitch: face.Pose?.Pitch || 0
        }
      };

    } catch (error) {
      console.error('Enhanced face attributes analysis failed:', error);
      return null;
    }
  }

  /**
   * Detect celebrities in the image (anti-spoofing measure)
   */
  async detectCelebrities(
    imageInput: string | HTMLCanvasElement | HTMLImageElement | File | Blob
  ): Promise<CelebrityDetectionResult> {
    this.ensureInitialized();

    try {
      const imageBytes = await this.convertImageToBytes(imageInput);
      
      const result = await this.rekognitionClient!.send(
        new RecognizeCelebritiesCommand({
          Image: { Bytes: imageBytes }
        })
      );

      const celebrities = (result.CelebrityFaces || []).map((celeb: any) => ({
        name: celeb.Name || 'Unknown',
        id: celeb.Id || '',
        confidence: celeb.MatchConfidence || 0,
        faceBox: {
          width: celeb.Face?.BoundingBox?.Width || 0,
          height: celeb.Face?.BoundingBox?.Height || 0,
          left: celeb.Face?.BoundingBox?.Left || 0,
          top: celeb.Face?.BoundingBox?.Top || 0
        }
      }));

      return {
        celebrities,
        isCelebrityDetected: celebrities.length > 0,
        totalCelebrities: celebrities.length
      };

    } catch (error) {
      console.error('Celebrity detection failed:', error);
      return {
        celebrities: [],
        isCelebrityDetected: false,
        totalCelebrities: 0
      };
    }
  }

  /**
   * Moderate content for inappropriate material
   */
  async moderateContent(
    imageInput: string | HTMLCanvasElement | HTMLImageElement | File | Blob
  ): Promise<ContentModerationResult> {
    this.ensureInitialized();

    try {
      const imageBytes = await this.convertImageToBytes(imageInput);
      
      const result = await this.rekognitionClient!.send(
        new DetectModerationLabelsCommand({
          Image: { Bytes: imageBytes },
          MinConfidence: 60 // Adjust threshold as needed
        })
      );

      const moderationLabels = (result.ModerationLabels || []).map((label: ModerationLabel) => ({
        name: label.Name || '',
        confidence: label.Confidence || 0,
        parentName: label.ParentName
      }));

      return {
        isAppropriate: moderationLabels.length === 0,
        moderationLabels,
        totalInappropriateLabels: moderationLabels.length
      };

    } catch (error) {
      console.error('Content moderation failed:', error);
      return {
        isAppropriate: true, // Default to appropriate if check fails
        moderationLabels: [],
        totalInappropriateLabels: 0
      };
    }
  }

  /**
   * Enhanced image quality check with additional security measures
   */
  async checkEnhancedImageQuality(
    imageInput: string | HTMLCanvasElement | HTMLImageElement | File | Blob
  ): Promise<EnhancedImageQualityResult> {
    // Get base quality result
    const baseQuality = await this.checkImageQuality(imageInput);
    
    // Get enhanced attributes
    const enhancedAttributes = await this.analyzeEnhancedFaceAttributes(imageInput);
    
    // Check for celebrities (potential spoofing)
    const celebrityDetection = await this.detectCelebrities(imageInput);
    
    // Moderate content
    const contentModeration = await this.moderateContent(imageInput);
    
    // Calculate security score and recommendations
    const { securityScore, recommendations } = this.calculateSecurityAssessment(
      baseQuality,
      enhancedAttributes,
      celebrityDetection,
      contentModeration
    );

    return {
      ...baseQuality,
      enhancedAttributes,
      celebrityDetection,
      contentModeration,
      securityScore,
      recommendations
    };
  }

  /**
   * Calculate overall security assessment and provide recommendations
   */
  private calculateSecurityAssessment(
    baseQuality: ImageQualityResult,
    attributes: EnhancedFaceAttributes | null,
    celebrityDetection: CelebrityDetectionResult,
    contentModeration: ContentModerationResult
  ): { securityScore: number; recommendations: string[] } {
    let score = baseQuality.score;
    const recommendations: string[] = [];

    // Penalize for celebrity detection
    if (celebrityDetection.isCelebrityDetected) {
      score -= 30;
      recommendations.push('Celebrity face detected - potential spoofing attempt');
    }

    // Penalize for inappropriate content
    if (!contentModeration.isAppropriate) {
      score -= 20;
      recommendations.push('Inappropriate content detected');
    }

    // Bonus for clear eyes (good for liveness)
    if (attributes?.eyeState.left.open && attributes?.eyeState.left.confidence > 80) {
      score += 5;
    } else {
      recommendations.push('Eyes should be clearly visible and open');
    }

    // Check for sunglasses (can hide identity)
    if (attributes?.accessories.sunglasses.present && attributes?.accessories.sunglasses.confidence > 70) {
      score -= 10;
      recommendations.push('Remove sunglasses for better verification');
    }

    // Bonus for natural smile (indicates live person)
    if (attributes?.smile.value && attributes?.smile.confidence > 70) {
      score += 5;
    }

    // Check emotions for natural variation
    const dominantEmotion = attributes?.emotions.reduce((prev, current) => 
      (prev.confidence > current.confidence) ? prev : current
    );
    
    if (dominantEmotion && dominantEmotion.confidence > 80 && dominantEmotion.type !== 'CALM') {
      score += 3; // Natural emotions indicate live person
    }

    return {
      securityScore: Math.max(0, Math.min(100, score)),
      recommendations
    };
  }
}
