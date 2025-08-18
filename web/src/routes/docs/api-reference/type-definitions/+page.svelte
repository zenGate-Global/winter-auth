<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
	import { Info, Code, Settings, Layers } from '@lucide/svelte';

	const typeCategories = [
		{
			id: 'core',
			title: 'Core Interfaces',
			icon: Layers,
			description: 'Main interfaces for Winter Authenticator functionality',
			types: [
				{
					name: 'IWinterAuthenticator',
					description: 'Main interface for face recognition operations',
					code: `interface IWinterAuthenticator {
  checkImageQuality(image: ImageInput): Promise<QualityResult>;
  compareByImage(
    baseImage: ImageInput, 
    compareImage: ImageInput,
    threshold?: number
  ): Promise<ComparisonResult>;
  initialize(): Promise<void>;
  isInitialized(): boolean;
}`
				},
				{
					name: 'QualityResult',
					description: 'Result from image quality checking operations',
					code: `interface QualityResult {
  isGoodQuality: boolean;
  issues: WinterAuthError[];
  metrics: {
    faceCount: number;
    confidence: number;
    brightness: number;
    sharpness: number;
    headPose: {
      roll: number;
      pitch: number;
      yaw: number;
    };
  };
}`
				},
				{
					name: 'ComparisonResult',
					description: 'Result from face comparison operations',
					code: `interface ComparisonResult {
  isMatch: boolean;
  similarity: number;          // 0.0 - 1.0
  similarityPercent: number;   // 0 - 100
  threshold: number;
  confidence: number;
  baseImageQuality: QualityResult;
  compareImageQuality: QualityResult;
}`
				}
			]
		},
		{
			id: 'configuration',
			title: 'Configuration Types',
			icon: Settings,
			description: 'Configuration interfaces and options',
			types: [
				{
					name: 'WinterAuthConfig',
					description: 'Main configuration object for Winter Authenticator',
					code: `interface WinterAuthConfig {
  mode: 'direct' | 'proxy';
  apiBaseUrl?: string;        // Required for proxy mode
  timeout?: number;           // Request timeout in ms
  retryAttempts?: number;     // Number of retry attempts
  qualityThresholds?: QualityThresholds;
}`
				},
				{
					name: 'QualityThresholds',
					description: 'Thresholds for image quality validation',
					code: `interface QualityThresholds {
  minConfidence: number;      // Minimum face detection confidence (0-1)
  minBrightness: number;      // Minimum brightness level (0-1)
  minSharpness: number;       // Minimum sharpness level (0-1)
  maxDetected: number;        // Maximum faces allowed in image
  maxHeadPoseAngle: number;   // Maximum head pose angle in degrees
}`
				},
				{
					name: 'ProviderConfig',
					description: 'Configuration for face recognition providers',
					code: `interface ProviderConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  sessionToken?: string;
}`
				}
			]
		},
		{
			id: 'providers',
			title: 'Provider Types',
			icon: Code,
			description: 'Interfaces for face recognition providers',
			types: [
				{
					name: 'IFaceRecognitionProvider',
					description: 'Interface that all face recognition providers must implement',
					code: `interface IFaceRecognitionProvider {
  initialize(): Promise<void>;
  isInitialized(): boolean;
  detectFaces(image: ImageInput): Promise<FaceDetectionResult>;
  compareFaces(
    sourceImage: ImageInput,
    targetImage: ImageInput
  ): Promise<FaceComparisonResult>;
  checkImageQuality(image: ImageInput): Promise<QualityResult>;
}`
				},
				{
					name: 'FaceDetectionResult',
					description: 'Result from face detection operations',
					code: `interface FaceDetectionResult {
  faces: DetectedFace[];
  faceCount: number;
  imageMetadata: {
    width: number;
    height: number;
    orientation?: number;
  };
}`
				},
				{
					name: 'DetectedFace',
					description: 'Information about a detected face',
					code: `interface DetectedFace {
  confidence: number;
  boundingBox: {
    width: number;
    height: number;
    left: number;
    top: number;
  };
  landmarks?: FaceLandmark[];
  quality: {
    brightness: number;
    sharpness: number;
  };
  pose: {
    roll: number;
    pitch: number;
    yaw: number;
  };
}`
				}
			]
		},
		{
			id: 'utilities',
			title: 'Utility Types',
			icon: Info,
			description: 'Helper types and utilities',
			types: [
				{
					name: 'ImageInput',
					description: 'Supported input types for images',
					code: `type ImageInput = 
  | File 
  | Blob 
  | HTMLImageElement 
  | HTMLCanvasElement 
  | string;  // Base64 encoded image`
				},
				{
					name: 'WinterAuthError',
					description: 'Error object structure',
					code: `interface WinterAuthError {
  code: string;
  message: string;
  timestamp: Date;
  details?: any;
}`
				},
				{
					name: 'SecurityThresholds',
					description: 'Pre-defined security threshold levels',
					code: `const SECURITY_THRESHOLDS = {
  LOW: 0.60,       // Less strict matching
  MEDIUM: 0.80,    // Balanced accuracy
  HIGH: 0.90,      // More strict matching
  MAXIMUM: 0.95    // Maximum security
} as const;

type SecurityLevel = keyof typeof SECURITY_THRESHOLDS;`
				},
				{
					name: 'ErrorCodes',
					description: 'Available error codes',
					code: `const ERROR_CODES = {
  // Image Quality
  NO_FACE_DETECTED: 'NO_FACE_DETECTED',
  MULTIPLE_FACES_DETECTED: 'MULTIPLE_FACES_DETECTED',
  LOW_FACE_CONFIDENCE: 'LOW_FACE_CONFIDENCE',
  IMAGE_TOO_DARK: 'IMAGE_TOO_DARK',
  IMAGE_TOO_BLURRY: 'IMAGE_TOO_BLURRY',
  HEAD_POSE_TOO_EXTREME: 'HEAD_POSE_TOO_EXTREME',
  
  // Provider Errors
  AWS_API_ERROR: 'AWS_API_ERROR',
  INITIALIZATION_FAILED: 'INITIALIZATION_FAILED',
  PROVIDER_NOT_INITIALIZED: 'PROVIDER_NOT_INITIALIZED',
  
  // Configuration
  MISSING_CONFIGURATION: 'MISSING_CONFIGURATION',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // Input Validation
  INVALID_IMAGE_FORMAT: 'INVALID_IMAGE_FORMAT',
  IMAGE_TOO_LARGE: 'IMAGE_TOO_LARGE',
  MISSING_PARAMETERS: 'MISSING_PARAMETERS'
} as const;`
				}
			]
		}
	];
</script>

<DocPage title="Type Definitions" description="Complete TypeScript interface reference for Winter Authenticator">
	
	<div class="space-y-6">
		<Alert.Root>
			<Info class="h-4 w-4" />
			<Alert.Description>
				All types are exported from <code>@zengate/winter-auth</code>. Use type-only imports: <code>{'import type { IWinterAuthenticator } from \'@zengate/winter-auth\';'}</code>
			</Alert.Description>
		</Alert.Root>

		<Tabs.Root value="core" class="w-full">
			<Tabs.List class="grid w-full grid-cols-4">
				{#each typeCategories as category}
					<Tabs.Trigger value={category.id} class="flex items-center gap-2">
						<svelte:component this={category.icon} class="h-4 w-4" />
						<span class="hidden sm:inline">{category.title}</span>
					</Tabs.Trigger>
				{/each}
			</Tabs.List>

			{#each typeCategories as category}
				<Tabs.Content value={category.id} class="space-y-4">
					<div class="mb-6">
						<h2 class="text-2xl font-semibold tracking-tight flex items-center gap-2">
							<svelte:component this={category.icon} class="h-6 w-6" />
							{category.title}
						</h2>
						<p class="text-muted-foreground">{category.description}</p>
					</div>

					<div class="grid gap-6">
						{#each category.types as type}
							<Card.Root>
								<Card.Header>
									<div class="flex items-start justify-between">
										<div>
											<Card.Title class="flex items-center gap-2">
												<code class="text-lg font-mono">{type.name}</code>
												<Badge variant="outline">TypeScript</Badge>
											</Card.Title>
											<Card.Description class="mt-1">
												{type.description}
											</Card.Description>
										</div>
									</div>
								</Card.Header>
								<Card.Content>
									<div class="space-y-4">
										<CodeBlock 
											code={type.code} 
											language="typescript" 
										/>
										
										<!-- Usage example for interfaces -->
										{#if type.name === 'IWinterAuthenticator'}
											<div>
												<h5 class="font-medium text-sm text-foreground mb-2">Usage Example</h5>
												<CodeBlock 
													code={`import { createWinterAuth } from '@zengate/winter-auth';
import type { IWinterAuthenticator, QualityResult } from '@zengate/winter-auth';

const winterAuth: IWinterAuthenticator = createWinterAuth({
  mode: 'direct'
});

await winterAuth.initialize();

const result: QualityResult = await winterAuth.checkImageQuality(imageFile);`} 
													language="typescript" 
												/>
											</div>
										{/if}

										{#if type.name === 'WinterAuthConfig'}
											<div>
												<h5 class="font-medium text-sm text-foreground mb-2">Configuration Examples</h5>
												<div class="space-y-3">
													<div>
														<p class="text-xs text-muted-foreground mb-1">Direct Mode (Server-side)</p>
														<CodeBlock 
															code={`const config: WinterAuthConfig = {
  mode: 'direct',
  timeout: 30000,
  retryAttempts: 3
};`} 
															language="typescript" 
														/>
													</div>
													<div>
														<p class="text-xs text-muted-foreground mb-1">Proxy Mode (Frontend)</p>
														<CodeBlock 
															code={`const config: WinterAuthConfig = {
  mode: 'proxy',
  apiBaseUrl: '/api/winter-auth',
  timeout: 15000
};`} 
															language="typescript" 
														/>
													</div>
												</div>
											</div>
										{/if}

										{#if type.name === 'SecurityThresholds'}
											<div>
												<h5 class="font-medium text-sm text-foreground mb-2">Usage with Comparison</h5>
												<CodeBlock 
													code={`import { SECURITY_THRESHOLDS } from '@zengate/winter-auth';

// Use predefined threshold
const result = await winterAuth.compareByImage(
  baseImage, 
  compareImage, 
  SECURITY_THRESHOLDS.HIGH
);

// Or use custom threshold
const result = await winterAuth.compareByImage(
  baseImage, 
  compareImage, 
  0.85  // Custom threshold between MEDIUM and HIGH
);`} 
													language="typescript" 
												/>
											</div>
										{/if}
									</div>
								</Card.Content>
							</Card.Root>
						{/each}
					</div>
				</Tabs.Content>
			{/each}
		</Tabs.Root>

		<!-- Integration Examples -->
		<section class="space-y-4">
			<div>
				<h2 class="text-2xl font-semibold tracking-tight">Complete Integration Example</h2>
				<p class="text-muted-foreground">Full example showing type-safe usage of Winter Authenticator</p>
			</div>

			<Card.Root>
				<Card.Header>
					<Card.Title>TypeScript Integration</Card.Title>
					<Card.Description>
						Complete example with proper typing and error handling
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<CodeBlock 
						language="typescript" 
						code={`import { createWinterAuth, SECURITY_THRESHOLDS, ERROR_CODES } from '@zengate/winter-auth';
import type { 
  IWinterAuthenticator, 
  QualityResult, 
  ComparisonResult,
  WinterAuthConfig,
  WinterAuthError 
} from '@zengate/winter-auth';

class FaceVerificationService {
  private winterAuth: IWinterAuthenticator;

  constructor(config: WinterAuthConfig) {
    this.winterAuth = createWinterAuth(config);
  }

  async initialize(): Promise<void> {
    await this.winterAuth.initialize();
  }

  async verifyIdentity(
    baseImage: File, 
    compareImage: File
  ): Promise<{
    success: boolean;
    isMatch?: boolean;
    similarity?: number;
    errors?: WinterAuthError[];
  }> {
    try {
      // Check base image quality
      const baseQuality: QualityResult = await this.winterAuth.checkImageQuality(baseImage);
      if (!baseQuality.isGoodQuality) {
        return {
          success: false,
          errors: baseQuality.issues
        };
      }

      // Check compare image quality
      const compareQuality: QualityResult = await this.winterAuth.checkImageQuality(compareImage);
      if (!compareQuality.isGoodQuality) {
        return {
          success: false,
          errors: compareQuality.issues
        };
      }

      // Perform comparison
      const comparison: ComparisonResult = await this.winterAuth.compareByImage(
        baseImage,
        compareImage,
        SECURITY_THRESHOLDS.HIGH
      );

      return {
        success: true,
        isMatch: comparison.isMatch,
        similarity: comparison.similarityPercent
      };

    } catch (error: any) {
      console.error('Verification failed:', error);
      
      return {
        success: false,
        errors: [{
          code: error.code || 'UNKNOWN_ERROR',
          message: error.message || 'An unexpected error occurred',
          timestamp: new Date()
        }]
      };
    }
  }
}`} 
					/>
				</Card.Content>
			</Card.Root>
		</section>
	</div>
</DocPage>


