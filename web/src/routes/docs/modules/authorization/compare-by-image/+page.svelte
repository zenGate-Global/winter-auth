<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
	import CompareByImageDemo from '$lib/components/interactive/CompareByImageDemo.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Table from '$lib/components/ui/table';
	import * as Badge from "$lib/components/ui/badge/index.js";
	import { AlertTriangle, Shield, Zap } from '@lucide/svelte';
</script>

<DocPage title="compareByImage()" description="Compare two images for face similarity using biometric verification">
	
	<p class="text-muted-foreground mb-8">
		The <code>compareByImage()</code> method performs biometric face comparison between two images, returning similarity scores and verification status. This is the core method for identity verification in static images.
	</p>

	<div class="space-y-8">
		
		<!-- Interactive Demo Section -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Interactive Demo</h2>
			<CompareByImageDemo />
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
						code={`compareByImage(
  referenceImage: ImageInput,
  targetImage: ImageInput,
  options?: { securityLevel?: SecurityStrength }
): Promise<FaceComparisonResult>`}
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
						<Table.Cell>The reference image (known identity) - can be File, Blob, HTMLImageElement, HTMLCanvasElement, or base64 string</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="font-medium">targetImage</Table.Cell>
						<Table.Cell><code>ImageInput</code></Table.Cell>
						<Table.Cell>The target image to compare against reference</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="font-medium">options</Table.Cell>
						<Table.Cell><code>&#123; securityLevel?: SecurityStrength &#125;</code></Table.Cell>
						<Table.Cell>Optional security level: LOW (60%), MEDIUM (75%), HIGH (85%), MAXIMUM (90%)</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</section>

		<!-- Return Value -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Return Value</h2>
			
			<CodeBlock 
				language="typescript" 
				code={`interface FaceComparisonResult {
  verified: boolean;               // Whether faces match at the security level
  similarity: number;             // Raw similarity score (0-1)
  similarityPercent: number;      // Similarity as percentage (0-100)
  confidence: number;             // Confidence in the comparison (0-1)
  securityLevel: SecurityStrength; // Security level used
  threshold: number;              // Threshold used for verification
  referenceQuality: ImageQualityResult; // Quality of reference image
  targetQuality: ImageQualityResult;    // Quality of target image
  processingTimeMs: number;       // Time taken for comparison
  errors: WinterAuthError[];      // Any errors encountered
}`}
			/>
		</section>

		<!-- Security Levels -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Security Levels</h2>
			
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-green-600">LOW</Card.Title>
						<Card.Description>60% threshold</Card.Description>
					</Card.Header>
					<Card.Content>
						<p class="text-sm">More permissive matching for general use cases</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title class="text-blue-600">MEDIUM</Card.Title>
						<Card.Description>75% threshold</Card.Description>
					</Card.Header>
					<Card.Content>
						<p class="text-sm">Balanced security and usability (default)</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title class="text-orange-600">HIGH</Card.Title>
						<Card.Description>85% threshold</Card.Description>
					</Card.Header>
					<Card.Content>
						<p class="text-sm">Strict matching for sensitive applications</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title class="text-red-600">MAXIMUM</Card.Title>
						<Card.Description>90% threshold</Card.Description>
					</Card.Header>
					<Card.Content>
						<p class="text-sm">Highest security for critical operations</p>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- Usage Examples -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Usage Examples</h2>
			
			<Tabs.Root value="basic" class="w-full">
				<Tabs.List class="grid w-full grid-cols-3">
					<Tabs.Trigger value="basic">Basic Comparison</Tabs.Trigger>
					<Tabs.Trigger value="security">Security Levels</Tabs.Trigger>
					<Tabs.Trigger value="validation">With Validation</Tabs.Trigger>
				</Tabs.List>
				
				<Tabs.Content value="basic" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`import { createWinterAuth } from '@zengate/winter-auth';

const winterAuth = createWinterAuth({
  mode: 'proxy',
  apiBaseUrl: '/api/winter-auth'
});

// Basic face comparison
const result = await winterAuth.compareByImage(referenceImage, targetImage);

if (result.verified) {
  console.log(\`✅ Identity verified! Similarity: \${result.similarityPercent}%\`);
  console.log(\`Processing time: \${result.processingTimeMs}ms\`);
} else {
  console.log(\`❌ Identity not verified. Similarity: \${result.similarityPercent}%\`);
  console.log(\`Required threshold: \${Math.round(result.threshold * 100)}%\`);
}`}
					/>
				</Tabs.Content>
				
				<Tabs.Content value="security" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`import { SecurityStrength } from '@zengate/winter-auth';

// High security comparison for sensitive operations
const highSecurityResult = await winterAuth.compareByImage(
  referenceImage, 
  targetImage, 
  { securityLevel: SecurityStrength.HIGH }
);

// Different security levels for different use cases
const securityLevels = [
  SecurityStrength.LOW,      // 60% - General access
  SecurityStrength.MEDIUM,   // 75% - Standard verification  
  SecurityStrength.HIGH,     // 85% - Sensitive operations
  SecurityStrength.MAXIMUM   // 90% - Critical systems
];

for (const level of securityLevels) {
  const result = await winterAuth.compareByImage(
    referenceImage, 
    targetImage, 
    { securityLevel: level }
  );
  
  console.log(\`\${level}: \${result.verified ? 'PASS' : 'FAIL'} (\${result.similarityPercent}%)\`);
}`}
					/>
				</Tabs.Content>
				
				<Tabs.Content value="validation" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`// Complete validation workflow
const performSecureComparison = async (refImage: File, targetImage: File) => {
  try {
    // First, validate image quality
    const [refQuality, targetQuality] = await Promise.all([
      winterAuth.checkImageQuality(refImage),
      winterAuth.checkImageQuality(targetImage)
    ]);

    if (!refQuality.isGoodQuality || !targetQuality.isGoodQuality) {
      throw new Error('Image quality validation failed');
    }

    // Perform comparison with high security
    const result = await winterAuth.compareByImage(
      refImage, 
      targetImage,
      { securityLevel: SecurityStrength.HIGH }
    );

    return {
      success: true,
      verified: result.verified,
      similarity: result.similarityPercent,
      confidence: Math.round(result.confidence * 100),
      processingTime: result.processingTimeMs,
      securityLevel: result.securityLevel,
      metadata: {
        referenceQuality: refQuality.metrics,
        targetQuality: targetQuality.metrics
      }
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};`}
					/>
				</Tabs.Content>
			</Tabs.Root>
		</section>

		<!-- Quality Impact -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Image Quality Impact</h2>
			
			<Alert.Root>
				<Shield class="h-4 w-4" />
				<Alert.Title>Quality Affects Accuracy</Alert.Title>
				<Alert.Description>
					Poor image quality can significantly impact comparison accuracy. The method includes quality assessment for both images.
				</Alert.Description>
			</Alert.Root>

			<div class="mt-6 space-y-4">
				<Card.Root>
					<Card.Header>
						<Card.Title>Quality Metrics Included</Card.Title>
					</Card.Header>
					<Card.Content>
						<CodeBlock 
							language="typescript" 
							code={`const result = await winterAuth.compareByImage(refImage, targetImage);

// Access quality metrics for both images
console.log('Reference Image Quality:', {
  isGoodQuality: result.referenceQuality.isGoodQuality,
  faceDetected: result.referenceQuality.faceDetected,
  confidence: result.referenceQuality.metrics.confidence,
  brightness: result.referenceQuality.metrics.brightness,
  sharpness: result.referenceQuality.metrics.sharpness
});

console.log('Target Image Quality:', {
  isGoodQuality: result.targetQuality.isGoodQuality,
  faceDetected: result.targetQuality.faceDetected,
  confidence: result.targetQuality.metrics.confidence
});`}
						/>
					</Card.Content>
				</Card.Root>
			</div>
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
							<li>Pre-validate image quality with <code>checkImageQuality()</code></li>
							<li>Use appropriate image resolutions (not larger than needed)</li>
							<li>Consider caching comparison results for repeated operations</li>
							<li>Process images in parallel when comparing multiple pairs</li>
						</ul>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Typical Processing Times</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-2 text-sm">
							<li>Small images (400x400): ~200-500ms</li>
							<li>Medium images (800x600): ~500-1000ms</li>
							<li>Large images (1920x1080): ~1-3 seconds</li>
							<li>Quality validation adds ~50-100ms</li>
						</ul>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- Error Handling -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Error Handling</h2>
			
			<p>For comprehensive error codes and handling patterns, see the <a href="/docs/api-reference/error-codes#image-quality-errors" class="text-primary hover:underline">Error Codes API Reference</a>.</p>
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
						<li>Use HIGH or MAXIMUM security levels for production systems handling sensitive data</li>
						<li>Always validate image quality with <code>checkImageQuality()</code> before comparison</li>
						<li>Implement rate limiting to prevent abuse (e.g., max 10 comparisons per minute per user)</li>
						<li>Log all comparison attempts with timestamps and results for security auditing</li>
						<li>Show users the similarity percentage to build trust in the verification process</li>
					</ul>
				</Card.Content>
			</Card.Root>
		</section>

	</div>
</DocPage>
