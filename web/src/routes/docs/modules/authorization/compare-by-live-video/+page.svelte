<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
	import CompareByLiveVideoDemo from '$lib/components/interactive/CompareByLiveVideoDemo.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Table from '$lib/components/ui/table';
	import * as Badge from "$lib/components/ui/badge/index.js";
	import { AlertTriangle, Video, Shield, Zap, Eye } from '@lucide/svelte';
</script>

<DocPage title="compareByLiveVideo()" description="Perform real-time face verification using live video streams with liveness detection">
	
	<p class="text-muted-foreground mb-8">
		The <code>compareByLiveVideo()</code> method performs biometric face comparison between a reference image and a live video stream, with built-in liveness detection to prevent spoofing attacks. This is ideal for real-time identity verification scenarios.
	</p>

	<div class="space-y-8">
		
		<!-- Interactive Demo Section -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Interactive Demo</h2>
			<CompareByLiveVideoDemo />
		</section>

		<!-- API Reference -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">API Reference</h2>
			
			<Card.Root>
				<Card.Header>
					<Card.Title>Method Signature</Card.Title>
				</Card.Header>
				<Card.Content>
					<CodeBlock 
						language="typescript" 
						code={`compareByLiveVideo(
  referenceImage: ImageInput,
  videoElement: HTMLVideoElement,
  options?: {
    securityLevel?: SecurityStrength;
    enableLivenessCheck?: boolean;
    captureFrameCount?: number;
    captureIntervalMs?: number;
  }
): Promise<LiveVideoVerificationResult>`}
					/>
				</Card.Content>
			</Card.Root>
		</section>

		<!-- Parameters -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Parameters</h2>
			
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Parameter</Table.Head>
						<Table.Head>Type</Table.Head>
						<Table.Head>Description</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						<Table.Cell class="font-medium">referenceImage</Table.Cell>
						<Table.Cell><code>ImageInput</code></Table.Cell>
						<Table.Cell>The reference image (known identity) to compare against</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="font-medium">videoElement</Table.Cell>
						<Table.Cell><code>HTMLVideoElement</code></Table.Cell>
						<Table.Cell>The video element containing the live camera stream</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="font-medium">options.securityLevel</Table.Cell>
						<Table.Cell><code>SecurityStrength</code></Table.Cell>
						<Table.Cell>Security level for comparison (LOW, MEDIUM, HIGH, MAXIMUM)</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="font-medium">options.enableLivenessCheck</Table.Cell>
						<Table.Cell><code>boolean</code></Table.Cell>
						<Table.Cell>Whether to perform liveness detection (default: true)</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="font-medium">options.captureFrameCount</Table.Cell>
						<Table.Cell><code>number</code></Table.Cell>
						<Table.Cell>Number of frames to capture for analysis (default: 5)</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="font-medium">options.captureIntervalMs</Table.Cell>
						<Table.Cell><code>number</code></Table.Cell>
						<Table.Cell>Interval between frame captures in milliseconds (default: 200)</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</section>

		<!-- Return Value -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Return Value</h2>
			
			<CodeBlock 
				language="typescript" 
				code={`interface LiveVideoVerificationResult {
  verified: boolean;                    // Overall verification result
  similarity: number;                   // Best similarity score (0-1)
  similarityPercent: number;           // Similarity as percentage (0-100)
  confidence: number;                  // Confidence in the result (0-1)
  isLive: boolean;                     // Liveness detection result
  livenessScore: number;               // Liveness confidence (0-1)
  securityLevel: SecurityStrength;     // Security level used
  threshold: number;                   // Similarity threshold applied
  framesAnalyzed: number;              // Number of frames processed
  bestFrameIndex: number;              // Index of best matching frame
  frameResults: FrameComparisonResult[]; // Individual frame results
  referenceQuality: ImageQualityResult; // Reference image quality
  processingTimeMs: number;            // Total processing time
  errors: WinterAuthError[];           // Any errors encountered
}

interface FrameComparisonResult {
  frameIndex: number;                  // Frame sequence number
  similarity: number;                  // Frame similarity score (0-1)
  faceDetected: boolean;              // Whether face was detected
  quality: ImageQualityResult;        // Frame quality metrics
  timestamp: number;                  // Frame capture timestamp
}`}
			/>
		</section>

		<!-- Liveness Detection -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Liveness Detection</h2>
			
			<Alert.Root>
				<Eye class="h-4 w-4" />
				<Alert.Title>Anti-Spoofing Security</Alert.Title>
				<Alert.Description>
					Liveness detection analyzes multiple video frames to detect movement, depth, and natural facial variations that indicate a real person rather than a photo or video replay.
				</Alert.Description>
			</Alert.Root>

			<div class="mt-6 grid gap-4 md:grid-cols-2">
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-green-600">What Liveness Detects</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-2 text-sm">
							<li>Natural facial micro-movements</li>
							<li>Blinking patterns</li>
							<li>Head pose variations</li>
							<li>Lighting changes across frames</li>
							<li>Depth perception indicators</li>
							<li>Temporal consistency</li>
						</ul>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title class="text-red-600">Spoofing Attempts Blocked</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-2 text-sm">
							<li>Static photos held up to camera</li>
							<li>Video replays on screens</li>
							<li>Printed photos</li>
							<li>Digital displays</li>
							<li>Pre-recorded videos</li>
							<li>3D masks (basic detection)</li>
						</ul>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- Usage Examples -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Usage Examples</h2>
			
			<Tabs.Root value="basic" class="w-full">
				<Tabs.List class="grid w-full grid-cols-3">
					<Tabs.Trigger value="basic">Basic Usage</Tabs.Trigger>
					<Tabs.Trigger value="advanced">Advanced Options</Tabs.Trigger>
					<Tabs.Trigger value="complete">Complete Flow</Tabs.Trigger>
				</Tabs.List>
				
				<Tabs.Content value="basic" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`import { createWinterAuth } from '@zengate/winter-auth';

const winterAuth = createWinterAuth({
  mode: 'proxy',
  apiBaseUrl: '/api/winter-auth'
});

// Set up video element
const video = document.getElementById('cameraVideo') as HTMLVideoElement;
const stream = await navigator.mediaDevices.getUserMedia({ video: true });
video.srcObject = stream;
await video.play();

// Perform live verification
const result = await winterAuth.compareByLiveVideo(referenceImage, video);

if (result.verified && result.isLive) {
  console.log(\`✅ Live verification successful! Similarity: \${result.similarityPercent}%\`);
  console.log(\`Liveness confidence: \${Math.round(result.livenessScore * 100)}%\`);
  console.log(\`Frames analyzed: \${result.framesAnalyzed}\`);
} else {
  if (!result.isLive) {
    console.log('❌ Liveness check failed - possible spoofing attempt');
  } else {
    console.log(\`❌ Face verification failed. Similarity: \${result.similarityPercent}%\`);
  }
}`}
					/>
				</Tabs.Content>
				
				<Tabs.Content value="advanced" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`import { SecurityStrength } from '@zengate/winter-auth';

// Advanced configuration for high-security scenarios
const result = await winterAuth.compareByLiveVideo(
  referenceImage, 
  video, 
  {
    securityLevel: SecurityStrength.HIGH,
    enableLivenessCheck: true,
    captureFrameCount: 10,           // More frames for better accuracy
    captureIntervalMs: 150           // Faster capture for smoother analysis
  }
);

// Analyze detailed results
console.log('Verification Results:', {
  overall: result.verified,
  similarity: \`\${result.similarityPercent}%\`,
  liveness: result.isLive,
  livenessScore: \`\${Math.round(result.livenessScore * 100)}%\`,
  confidence: \`\${Math.round(result.confidence * 100)}%\`,
  securityLevel: result.securityLevel,
  framesAnalyzed: result.framesAnalyzed,
  bestFrame: result.bestFrameIndex,
  processingTime: \`\${result.processingTimeMs}ms\`
});

// Check individual frame results
result.frameResults.forEach((frame, index) => {
  console.log(\`Frame \${index}: \${Math.round(frame.similarity * 100)}% similarity, \${frame.faceDetected ? 'face detected' : 'no face'}\`);
});`}
					/>
				</Tabs.Content>
				
				<Tabs.Content value="complete" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`// Complete live verification workflow with error handling
const performLiveVerification = async (referenceImage: File) => {
  let stream: MediaStream | null = null;
  
  try {
    // 1. Set up camera access
    stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: 640, 
        height: 480,
        facingMode: 'user' // Front camera for selfies
      } 
    });
    
    const video = document.createElement('video');
    video.srcObject = stream;
    video.autoplay = true;
    await video.play();
    
    // 2. Wait for video to be ready
    await new Promise(resolve => {
      video.addEventListener('loadedmetadata', resolve);
    });
    
    // 3. Validate reference image first
    const refQuality = await winterAuth.checkImageQuality(referenceImage);
    if (!refQuality.isGoodQuality) {
      throw new Error('Reference image quality is insufficient');
    }
    
    // 4. Perform live verification with high security
    const result = await winterAuth.compareByLiveVideo(
      referenceImage, 
      video,
      {
        securityLevel: SecurityStrength.HIGH,
        enableLivenessCheck: true,
        captureFrameCount: 8,
        captureIntervalMs: 200
      }
    );
    
    // 5. Process results
    const verification = {
      success: result.verified && result.isLive,
      verified: result.verified,
      isLive: result.isLive,
      similarity: result.similarityPercent,
      confidence: Math.round(result.confidence * 100),
      livenessScore: Math.round(result.livenessScore * 100),
      processingTime: result.processingTimeMs,
      errors: result.errors
    };
    
    return verification;
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  } finally {
    // Clean up camera stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }
};`}
					/>
				</Tabs.Content>
			</Tabs.Root>
		</section>

		<!-- Performance Considerations -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Performance Considerations</h2>
			
			<div class="grid gap-4 md:grid-cols-2">
				<Card.Root>
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							<Zap class="h-4 w-4" />
							Optimization Tips
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-2 text-sm">
							<li>Use moderate frame counts (5-10) for balance of speed/accuracy</li>
							<li>Set appropriate video resolution (640x480 is usually sufficient)</li>
							<li>Consider device capabilities when setting capture intervals</li>
							<li>Pre-validate reference image quality before starting</li>
							<li>Clean up video streams properly to free resources</li>
						</ul>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Processing Times</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-2 text-sm">
							<li>5 frames @ 200ms interval: ~2-4 seconds total</li>
							<li>8 frames @ 150ms interval: ~3-6 seconds total</li>
							<li>10 frames @ 100ms interval: ~4-8 seconds total</li>
							<li>Liveness analysis adds ~500-1000ms overhead</li>
						</ul>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- Camera Setup -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Camera Setup Best Practices</h2>
			
			<CodeBlock 
				language="typescript" 
				code={`// Optimized camera configuration
const setupCamera = async (): Promise<HTMLVideoElement> => {
  const constraints = {
    video: {
      width: { ideal: 640 },
      height: { ideal: 480 },
      facingMode: 'user',           // Front camera
      frameRate: { ideal: 30 },     // Smooth video
      aspectRatio: { ideal: 4/3 }   // Good for faces
    },
    audio: false                    // Not needed for verification
  };
  
  const stream = await navigator.mediaDevices.getUserMedia(constraints);
  
  const video = document.createElement('video');
  video.srcObject = stream;
  video.autoplay = true;
  video.muted = true;              // Prevent audio feedback
  video.playsInline = true;        // Important for iOS
  
  // Wait for video to be ready
  await new Promise((resolve, reject) => {
    video.addEventListener('loadedmetadata', resolve);
    video.addEventListener('error', reject);
    setTimeout(reject, 10000);     // 10 second timeout
  });
  
  return video;
};

// Check camera permissions
const checkCameraPermission = async (): Promise<boolean> => {
  try {
    const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
    return result.state === 'granted' || result.state === 'prompt';
  } catch {
    // Fallback - try to access camera directly
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch {
      return false;
    }
  }
};`}
			/>
		</section>

		<!-- Security Considerations -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Security Considerations</h2>
			
			<Alert.Root>
				<Shield class="h-4 w-4" />
				<Alert.Title>Enhanced Security</Alert.Title>
				<Alert.Description>
					Live video verification provides significantly higher security than static image comparison due to liveness detection and multi-frame analysis.
				</Alert.Description>
			</Alert.Root>

			<div class="mt-6 grid gap-4 md:grid-cols-2">
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-green-600">Security Benefits</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-2 text-sm">
							<li>Prevents photo/video spoofing attacks</li>
							<li>Multi-frame analysis increases accuracy</li>
							<li>Real-time liveness detection</li>
							<li>Temporal consistency validation</li>
							<li>Movement and depth analysis</li>
						</ul>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title class="text-orange-600">Implementation Tips</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-2 text-sm">
							<li>Use HIGH or MAXIMUM security levels for sensitive apps</li>
							<li>Always enable liveness checking</li>
							<li>Log verification attempts for audit trails</li>
							<li>Consider rate limiting to prevent abuse</li>
							<li>Implement timeout mechanisms</li>
						</ul>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- Error Handling -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Error Handling</h2>
			
			<p>The method handles camera access errors, face detection issues, and liveness check failures. For comprehensive error codes and handling patterns, see the <a href="/docs/api-reference/error-codes#image-quality-errors" class="text-primary hover:underline">Error Codes API Reference</a>.</p>
		</section>

	</div>
</DocPage>
