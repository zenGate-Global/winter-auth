<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
	import CheckImageQualityDemo from '$lib/components/interactive/CheckImageQualityDemo.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Table from '$lib/components/ui/table';
	import { AlertTriangle, CheckCircle, XCircle } from '@lucide/svelte';
</script>

<DocPage title="checkImageQuality()" description="Analyze image quality for face recognition operations">
	
	<p class="text-muted-foreground mb-8">
		The <code>checkImageQuality()</code> method analyzes an image to determine if it's suitable for face recognition operations. It validates face detection, image quality, brightness, sharpness, and head pose to ensure optimal verification results.
	</p>

	<div class="space-y-8">
		
		<!-- Interactive Demo Section -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Interactive Demo</h2>
			<CheckImageQualityDemo />
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
						code={`checkImageQuality(imageInput: ImageInput): Promise<ImageQualityResult>`}
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
						<Table.Cell class="font-medium">imageInput</Table.Cell>
						<Table.Cell><code>ImageInput</code></Table.Cell>
						<Table.Cell>The image to analyze - can be File, Blob, HTMLImageElement, HTMLCanvasElement, or base64 string</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</section>

		<!-- Return Value -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Return Value</h2>
			
			<CodeBlock 
				language="typescript" 
				code={`interface ImageQualityResult {
  isGoodQuality: boolean;           // Overall quality assessment
  faceDetected: boolean;           // Whether a face was found
  metrics: {
    faceCount: number;             // Number of faces detected
    confidence: number;            // Face detection confidence (0-1)
    brightness: number;            // Image brightness level (0-1)
    sharpness: number;            // Image sharpness score (0-1)
    headPoseScore: number;        // Head pose quality (0-1)
    resolution: {
      width: number;
      height: number;
    };
  };
  errors: WinterAuthError[];       // Any quality issues found
  processingTimeMs: number;        // Time taken for analysis
}`}
			/>
		</section>

		<!-- Usage Examples -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Usage Examples</h2>
			
			<Tabs.Root value="basic" class="w-full">
				<Tabs.List class="grid w-full grid-cols-3">
					<Tabs.Trigger value="basic">Basic Usage</Tabs.Trigger>
					<Tabs.Trigger value="detailed">Detailed Analysis</Tabs.Trigger>
					<Tabs.Trigger value="validation">Pre-validation</Tabs.Trigger>
				</Tabs.List>
				
				<Tabs.Content value="basic" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`import { createWinterAuth } from '@zengate/winter-auth';

const winterAuth = createWinterAuth({
  mode: 'proxy',
  apiBaseUrl: '/api/winter-auth'
});

// Basic quality check
const result = await winterAuth.checkImageQuality(imageFile);

if (result.isGoodQuality) {
  console.log('✅ Image is ready for face recognition');
  console.log('Confidence:', result.metrics.confidence);
} else {
  console.log('❌ Image quality issues:', result.errors);
}`}
					/>
				</Tabs.Content>
				
				<Tabs.Content value="detailed" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`// Detailed quality analysis with metrics
const result = await winterAuth.checkImageQuality(imageFile);

console.log('Quality Assessment:', {
  overall: result.isGoodQuality,
  faceDetected: result.faceDetected,
  faceCount: result.metrics.faceCount,
  confidence: \`\${Math.round(result.metrics.confidence * 100)}%\`,
  brightness: result.metrics.brightness,
  sharpness: result.metrics.sharpness,
  headPose: result.metrics.headPoseScore,
  resolution: \`\${result.metrics.resolution.width}x\${result.metrics.resolution.height}\`,
  processingTime: \`\${result.processingTimeMs}ms\`
});

// Handle specific quality issues
if (result.errors.length > 0) {
  result.errors.forEach(error => {
    switch (error.code) {
      case 'NO_FACE_DETECTED':
        showMessage('Please ensure your face is visible in the image');
        break;
      case 'MULTIPLE_FACES_DETECTED':
        showMessage('Please use an image with only one face');
        break;
      case 'IMAGE_TOO_DARK':
        showMessage('Please use better lighting');
        break;
      case 'IMAGE_TOO_BLURRY':
        showMessage('Please use a sharper image');
        break;
    }
  });
}`}
					/>
				</Tabs.Content>
				
				<Tabs.Content value="validation" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`// Use as validation before other operations
const validateBeforeComparison = async (referenceImage: File, targetImage: File) => {
  // Check both images
  const [refQuality, targetQuality] = await Promise.all([
    winterAuth.checkImageQuality(referenceImage),
    winterAuth.checkImageQuality(targetImage)
  ]);

  if (!refQuality.isGoodQuality) {
    throw new Error(\`Reference image quality issues: \${refQuality.errors.map(e => e.message).join(', ')}\`);
  }

  if (!targetQuality.isGoodQuality) {
    throw new Error(\`Target image quality issues: \${targetQuality.errors.map(e => e.message).join(', ')}\`);
  }

  // Proceed with comparison
  return await winterAuth.compareByImage(referenceImage, targetImage);
};`}
					/>
				</Tabs.Content>
			</Tabs.Root>
		</section>

		<!-- Quality Thresholds -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Quality Thresholds</h2>
			
			<Alert.Root>
				<AlertTriangle class="h-4 w-4" />
				<Alert.Title>Quality Standards</Alert.Title>
				<Alert.Description>
					The method uses predefined thresholds to determine image quality. These can be adjusted based on your security requirements.
				</Alert.Description>
			</Alert.Root>

			<div class="mt-6 grid gap-4 md:grid-cols-2">
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-green-600 flex items-center gap-2">
							<CheckCircle class="h-4 w-4" />
							Good Quality Requirements
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-2 text-sm">
							<li>Face detection confidence &gt; 50%</li>
							<li>Exactly 1 face detected</li>
							<li>Brightness level 0.2-0.8</li>
							<li>Sharpness score &gt; 0.3</li>
							<li>Head pose score &gt; 0.6</li>
							<li>Minimum 200x200px resolution</li>
						</ul>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title class="text-red-600 flex items-center gap-2">
							<XCircle class="h-4 w-4" />
							Common Quality Issues
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-2 text-sm">
							<li>No face detected</li>
							<li>Multiple faces in image</li>
							<li>Image too dark or bright</li>
							<li>Blurry or low resolution</li>
							<li>Extreme head pose angles</li>
							<li>Insufficient face size</li>
						</ul>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- Error Handling -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Error Handling</h2>
			
			<p>For comprehensive error codes and handling patterns, see the <a href="/docs/api-reference/error-codes#image-quality-errors" class="text-primary hover:underline">Image Quality Errors</a> section.</p>
		</section>

		<!-- Best Practices -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Best Practices</h2>
			
			<Card.Root>
				<Card.Header>
					<Card.Title>Key Implementation Tips</Card.Title>
				</Card.Header>
				<Card.Content>
					<ul class="space-y-2 text-sm">
						<li>Always run quality checks before comparison operations to save processing time</li>
						<li>Cache quality results when processing the same image multiple times</li>
						<li>Provide real-time feedback on quality issues to help users capture better images</li>
						<li>Use the quality metrics to automatically guide users (e.g., "Move to better lighting" when brightness is low)</li>
					</ul>
				</Card.Content>
			</Card.Root>
		</section>

	</div>
</DocPage>
