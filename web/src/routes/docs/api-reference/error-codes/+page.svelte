<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from '$lib/components/ui/badge';
	import * as Alert from '$lib/components/ui/alert';
	import { CodeBlock } from '$lib/components/ui/code-block';
	import { AlertTriangle, Info, XCircle, AlertCircle } from '@lucide/svelte';

	const errorCategories = [
		{
			title: 'Image Quality Errors',
			description: 'Errors related to image quality and face detection',
			errors: [
				{
					code: 'NO_FACE_DETECTED',
					message: 'No face detected in the image',
					severity: 'warning',
					cause: 'The image does not contain any detectable faces',
					solution: 'Ensure the image contains a clear, visible face. Check lighting and image quality.'
				},
				{
					code: 'MULTIPLE_FACES_DETECTED',
					message: 'Multiple faces detected in the image',
					severity: 'warning',
					cause: 'The image contains more than one face',
					solution: 'Use an image with only one face for better accuracy.'
				},
				{
					code: 'LOW_FACE_CONFIDENCE',
					message: 'Low face detection confidence',
					severity: 'warning',
					cause: 'The face detection algorithm has low confidence in the detected face',
					solution: 'Use a clearer image with better lighting and face visibility.'
				},
				{
					code: 'IMAGE_TOO_DARK',
					message: 'Image is too dark for reliable recognition',
					severity: 'warning',
					cause: 'The image brightness is below the acceptable threshold',
					solution: 'Use an image with better lighting or increase brightness.'
				},
				{
					code: 'IMAGE_TOO_BLURRY',
					message: 'Image is too blurry for reliable recognition',
					severity: 'warning',
					cause: 'The image sharpness is below the acceptable threshold',
					solution: 'Use a sharper, high-quality image without motion blur.'
				},
				{
					code: 'HEAD_POSE_TOO_EXTREME',
					message: 'Head pose angle is too extreme',
					severity: 'warning',
					cause: 'The person\'s head is turned too far from center',
					solution: 'Use an image where the person is facing more directly toward the camera.'
				}
			]
		},
		{
			title: 'Provider Errors',
			description: 'Errors related to face recognition providers (AWS, etc.)',
			errors: [
				{
					code: 'AWS_API_ERROR',
					message: 'AWS Rekognition API error',
					severity: 'error',
					cause: 'Error occurred while calling AWS Rekognition service',
					solution: 'Check AWS credentials, service availability, and API limits.'
				},
				{
					code: 'INITIALIZATION_FAILED',
					message: 'Provider initialization failed',
					severity: 'error',
					cause: 'The face recognition provider could not be initialized',
					solution: 'Verify environment variables and provider configuration.'
				},
				{
					code: 'PROVIDER_NOT_INITIALIZED',
					message: 'Provider not initialized',
					severity: 'error',
					cause: 'Attempting to use provider before initialization',
					solution: 'Call initialize() method before using provider functions.'
				}
			]
		},
		{
			title: 'Configuration Errors',
			description: 'Errors related to authentication and configuration',
			errors: [
				{
					code: 'MISSING_CONFIGURATION',
					message: 'Required configuration is missing',
					severity: 'error',
					cause: 'Environment variables or configuration not properly set',
					solution: 'Ensure all required environment variables are configured.'
				},
				{
					code: 'INVALID_CREDENTIALS',
					message: 'Invalid API credentials',
					severity: 'error',
					cause: 'The provided API credentials are invalid or expired',
					solution: 'Verify and update your API credentials in the environment variables.'
				}
			]
		},
		{
			title: 'Metadata Extraction Errors',
			description: 'Errors specific to image metadata and GPS extraction',
			errors: [
				{
					code: 'NO_EXIF_DATA',
					message: 'No EXIF metadata found in image',
					severity: 'warning',
					cause: 'Image format does not support EXIF or metadata was stripped',
					solution: 'Use JPEG or TIFF images with preserved metadata.'
				},
				{
					code: 'GPS_PARSING_ERROR',
					message: 'Unable to parse GPS coordinates',
					severity: 'error',
					cause: 'GPS metadata exists but is corrupted or in unsupported format',
					solution: 'Use images with valid GPS metadata or handle gracefully.'
				},
				{
					code: 'UNSUPPORTED_FORMAT',
					message: 'Image format does not support metadata',
					severity: 'info',
					cause: 'WebP, GIF and some PNG images do not contain EXIF data',
					solution: 'Use JPEG or TIFF format for metadata extraction.'
				},
				{
					code: 'CORRUPTED_EXIF',
					message: 'EXIF data is corrupted or incomplete',
					severity: 'warning',
					cause: 'File transfer, editing software, or hardware issues corrupted metadata',
					solution: 'Use original unedited images when possible.'
				}
			]
		},
		{
			title: 'Input Validation Errors',
			description: 'Errors related to input validation and parameters',
			errors: [
				{
					code: 'INVALID_IMAGE_FORMAT',
					message: 'Invalid image format',
					severity: 'error',
					cause: 'The provided image is not in a supported format',
					solution: 'Use supported image formats: JPEG, PNG, GIF, BMP.'
				},
				{
					code: 'IMAGE_TOO_LARGE',
					message: 'Image file size exceeds limit',
					severity: 'error',
					cause: 'The image file is larger than the maximum allowed size',
					solution: 'Reduce image file size or use image compression.'
				},
				{
					code: 'MISSING_PARAMETERS',
					message: 'Required parameters are missing',
					severity: 'error',
					cause: 'One or more required parameters were not provided',
					solution: 'Ensure all required parameters are provided in the function call.'
				}
			]
		}
	];

	function getSeverityIcon(severity: string) {
		switch (severity) {
			case 'error': return XCircle;
			case 'warning': return AlertTriangle;
			case 'info': return Info;
			default: return AlertCircle;
		}
	}

	function getSeverityColor(severity: string) {
		switch (severity) {
			case 'error': return 'destructive';
			case 'warning': return 'outline';
			case 'info': return 'secondary';
			default: return 'outline';
		}
	}
</script>

<DocPage title="Error Codes Reference" description="Complete reference of error codes, causes, and solutions for Winter Authenticator">
	
	<div class="space-y-8">
		<Alert.Root>
			<Info class="h-4 w-4" />
			<Alert.Description>
				All Winter Authenticator errors include a <code>code</code>, <code>message</code>, and <code>timestamp</code>. Use the error codes for programmatic handling and the messages for user-friendly display.
			</Alert.Description>
		</Alert.Root>

		{#each errorCategories as category}
			<section class="space-y-4" id={category.title.toLowerCase().replace(/\s+/g, '-')}>
				<div>
					<h2 class="text-2xl font-semibold tracking-tight">{category.title}</h2>
					<p class="text-muted-foreground">{category.description}</p>
				</div>

				<div class="grid gap-4">
					{#each category.errors as error}
						<Card.Root>
							<Card.Header class="pb-3">
								<div class="flex items-start justify-between">
									<div class="space-y-1">
										<div class="flex items-center gap-2">
											<code class="text-sm font-mono bg-muted px-2 py-1 rounded">
												{error.code}
											</code>
											<Badge 
												variant="outline" 
												class={getSeverityColor(error.severity)}
											>
												{#if getSeverityIcon(error.severity)}
													<svelte:component this={getSeverityIcon(error.severity)} class="h-3 w-3 mr-1" />
												{/if}
												{error.severity.toUpperCase()}
											</Badge>
										</div>
										<Card.Title class="text-lg">{error.message}</Card.Title>
									</div>
								</div>
							</Card.Header>
							<Card.Content class="space-y-4">
								<div class="grid md:grid-cols-2 gap-4">
									<div>
										<h5 class="font-medium text-sm text-foreground mb-2">Cause</h5>
										<p class="text-sm text-muted-foreground">{error.cause}</p>
									</div>
									<div>
										<h5 class="font-medium text-sm text-foreground mb-2">Solution</h5>
										<p class="text-sm text-muted-foreground">{error.solution}</p>
									</div>
								</div>

								<!-- Code example for handling this error -->
								<div class="mt-4">
									<h5 class="font-medium text-sm text-foreground mb-2">Handling Example</h5>
									<CodeBlock 
										code={`try {
  const result = await winterAuth.checkImageQuality(image);
  // Handle success...
} catch (error) {
  if (error.code === '${error.code}') {
    // ${error.solution}
    console.log('${error.message}');
  }
}`} 
										language="typescript" 
										showCopyButton={true}
									/>
								</div>
							</Card.Content>
						</Card.Root>
					{/each}
				</div>
			</section>
		{/each}

		<!-- Common Patterns Section -->
		<section class="space-y-4">
			<div>
				<h2 class="text-2xl font-semibold tracking-tight">Common Error Handling Patterns</h2>
				<p class="text-muted-foreground">Best practices for handling Winter Authenticator errors</p>
			</div>

			<Card.Root>
				<Card.Header>
					<Card.Title>Comprehensive Error Handling</Card.Title>
					<Card.Description>
						Example showing how to handle multiple error types gracefully
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<CodeBlock 
						code={`async function handleImageQualityWithErrorHandling(file) {
  try {
    const result = await winterAuth.checkImageQuality(file);
    
    if (!result.isGoodQuality) {
      // Handle quality issues
      const errorMessages = result.issues.map(issue => {
        switch (issue.code) {
          case 'NO_FACE_DETECTED':
            return 'Please ensure your image contains a clear face';
          case 'MULTIPLE_FACES_DETECTED':
            return 'Please use an image with only one person';
          case 'IMAGE_TOO_DARK':
            return 'Please use an image with better lighting';
          case 'IMAGE_TOO_BLURRY':
            return 'Please use a sharper, clearer image';
          case 'HEAD_POSE_TOO_EXTREME':
            return 'Please face the camera more directly';
          default:
            return issue.message;
        }
      });
      
      return {
        success: false,
        userMessage: errorMessages.join('. '),
        technicalDetails: result.issues
      };
    }
    
    return {
      success: true,
      result: result,
      userMessage: 'Image quality is good for face recognition'
    };
    
  } catch (error) {
    console.error('Quality check failed:', error);
    
    // Handle provider-level errors
    if (error.code === 'INITIALIZATION_FAILED') {
      return {
        success: false,
        userMessage: 'Service temporarily unavailable. Please try again later.',
        technicalDetails: error
      };
    }
    
    return {
      success: false,
      userMessage: 'An unexpected error occurred. Please try again.',
      technicalDetails: error
    };
  }
}`} 
						language="typescript" 
						showCopyButton={true}
					/>
				</Card.Content>
			</Card.Root>
		</section>
	</div>
</DocPage>

