<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
	import CheckImageQualityDemo from '$lib/components/interactive/CheckImageQualityDemo.svelte';
	import CompareByImageDemo from '$lib/components/interactive/CompareByImageDemo.svelte';
	import CompareByLiveVideoDemo from '$lib/components/interactive/CompareByLiveVideoDemo.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Table from '$lib/components/ui/table';
	import { AlertTriangle } from '@lucide/svelte';
</script>

<DocPage title="Authorization Usage" description="Core methods of the Winter Authenticator library for face recognition and verification">
	
	<p>This page demonstrates the core methods of the Winter Authenticator library with interactive examples. Each method includes live demos where you can test functionality with your own images.</p>

	<div class="space-y-12">
		
		<!-- checkImageQuality() Section -->
		<section id="check-image-quality">
			<h2 class="text-3xl font-semibold tracking-tight mb-4">checkImageQuality()</h2>
			<p class="text-muted-foreground mb-6">
				Analyzes an image to determine if it's suitable for face recognition operations. Validates face detection, image quality, brightness, sharpness, and head pose.
			</p>

			<Tabs.Root value="preview" class="w-full">
				<Tabs.List class="grid w-full grid-cols-2">
					<Tabs.Trigger value="preview">Preview</Tabs.Trigger>
					<Tabs.Trigger value="code">Code</Tabs.Trigger>
				</Tabs.List>
				
				<Tabs.Content value="preview" class="mt-6">
					<CheckImageQualityDemo />
				</Tabs.Content>
				
				<Tabs.Content value="code" class="mt-6">
					<CodeBlock language="typescript" code={`import { createWinterAuth } from '@zengate/winter-auth';

const winterAuth = createWinterAuth({
  mode: 'proxy',
  apiBaseUrl: '/api/winter-auth'
});

const result = await winterAuth.checkImageQuality(imageFile);

if (result.isGoodQuality) {
  console.log('✅ Image is ready for face recognition');
  console.log('Metrics:', result.metrics);
} else {
  console.log('❌ Quality issues found:');
  result.issues.forEach(issue => {
    console.log('-', issue.code, ':', issue.message);
  });
}`} />
				</Tabs.Content>
			</Tabs.Root>

			<!-- Method Reference -->
			<div class="mt-8">
				<h3 class="text-xl font-semibold mb-4">Method Reference</h3>
				<Card.Root>
					<Card.Header>
						<Card.Title>Parameters</Card.Title>
					</Card.Header>
					<Card.Content>
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
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">imageInput</code></Table.Cell>
									<Table.Cell><code class="text-xs">File | Blob | HTMLImageElement | HTMLCanvasElement | string</code></Table.Cell>
									<Table.Cell>The image to analyze. Can be a file, blob, image element, canvas, or base64 string.</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>
					</Card.Content>
				</Card.Root>

				<Card.Root class="mt-4">
					<Card.Header>
						<Card.Title>Return Value</Card.Title>
					</Card.Header>
					<Card.Content>
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>Property</Table.Head>
									<Table.Head>Type</Table.Head>
									<Table.Head>Description</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">isGoodQuality</code></Table.Cell>
									<Table.Cell><code class="text-xs">boolean</code></Table.Cell>
									<Table.Cell>Whether the image meets quality requirements for face recognition</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">issues</code></Table.Cell>
									<Table.Cell><code class="text-xs">WinterAuthError[]</code></Table.Cell>
									<Table.Cell>Array of quality issues found (empty if no issues)</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">metrics</code></Table.Cell>
									<Table.Cell><code class="text-xs">ImageQualityMetrics</code></Table.Cell>
									<Table.Cell>Detailed quality metrics including confidence, brightness, sharpness, etc.</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- compareByImage() Section -->
		<section id="compare-by-image">
			<h2 class="text-3xl font-semibold tracking-tight mb-4">compareByImage()</h2>
			<p class="text-muted-foreground mb-6">
				Compares two images to determine if they contain the same person. Performs automatic quality validation on both images and returns similarity confidence.
			</p>

			<Tabs.Root value="preview" class="w-full">
				<Tabs.List class="grid w-full grid-cols-2">
					<Tabs.Trigger value="preview">Preview</Tabs.Trigger>
					<Tabs.Trigger value="code">Code</Tabs.Trigger>
				</Tabs.List>
				
				<Tabs.Content value="preview" class="mt-6">
					<CompareByImageDemo />
				</Tabs.Content>
				
				<Tabs.Content value="code" class="mt-6">
					<CodeBlock language="typescript" code={`const result = await winterAuth.compareByImage(
  baseImage,
  compareImage,
  0.80  // 80% similarity threshold
);

if (result.isMatch) {
  console.log('✅ Faces match!');
  console.log('Similarity:', result.similarityPercent + '%');
  console.log('Confidence:', result.confidence);
} else {
  console.log('❌ Faces do not match');
  console.log('Similarity:', result.similarityPercent + '%');
  console.log('Threshold:', result.threshold);
}`} />
				</Tabs.Content>
			</Tabs.Root>

			<!-- Method Reference -->
			<div class="mt-8">
				<h3 class="text-xl font-semibold mb-4">Method Reference</h3>
				<Card.Root>
					<Card.Header>
						<Card.Title>Parameters</Card.Title>
					</Card.Header>
					<Card.Content>
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
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">referenceImage</code></Table.Cell>
									<Table.Cell><code class="text-xs">File | Blob | HTMLImageElement | HTMLCanvasElement | string</code></Table.Cell>
									<Table.Cell>The baseline image to compare against</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">targetImage</code></Table.Cell>
									<Table.Cell><code class="text-xs">File | Blob | HTMLImageElement | HTMLCanvasElement | string</code></Table.Cell>
									<Table.Cell>The image to compare with the reference</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">options</code></Table.Cell>
									<Table.Cell><code class="text-xs">CompareOptions?</code></Table.Cell>
									<Table.Cell>Optional configuration including security level and similarity threshold</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>
					</Card.Content>
				</Card.Root>

				<Card.Root class="mt-4">
					<Card.Header>
						<Card.Title>Return Value</Card.Title>
					</Card.Header>
					<Card.Content>
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>Property</Table.Head>
									<Table.Head>Type</Table.Head>
									<Table.Head>Description</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">isMatch</code></Table.Cell>
									<Table.Cell><code class="text-xs">boolean</code></Table.Cell>
									<Table.Cell>Whether the faces match above the similarity threshold</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">similarity</code></Table.Cell>
									<Table.Cell><code class="text-xs">number</code></Table.Cell>
									<Table.Cell>Similarity score between 0-1 (0.8 = 80% similar)</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">similarityPercent</code></Table.Cell>
									<Table.Cell><code class="text-xs">number</code></Table.Cell>
									<Table.Cell>Similarity as percentage (80 = 80%)</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">confidence</code></Table.Cell>
									<Table.Cell><code class="text-xs">number</code></Table.Cell>
									<Table.Cell>Provider confidence in the comparison result</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">threshold</code></Table.Cell>
									<Table.Cell><code class="text-xs">number</code></Table.Cell>
									<Table.Cell>The similarity threshold used for matching</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>
					</Card.Content>
				</Card.Root>

				<Card.Root class="mt-4">
					<Card.Header>
						<Card.Title>Security Levels</Card.Title>
					</Card.Header>
					<Card.Content>
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>Level</Table.Head>
									<Table.Head>Threshold</Table.Head>
									<Table.Head>Use Case</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">LOW</code></Table.Cell>
									<Table.Cell>60%</Table.Cell>
									<Table.Cell>Casual identification, user convenience</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">MEDIUM</code></Table.Cell>
									<Table.Cell>75%</Table.Cell>
									<Table.Cell>Standard authentication, balanced security</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">HIGH</code></Table.Cell>
									<Table.Cell>85%</Table.Cell>
									<Table.Cell>Secure access, financial applications</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">MAXIMUM</code></Table.Cell>
									<Table.Cell>90%</Table.Cell>
									<Table.Cell>Critical security, government applications</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- compareByLiveVideo() Section -->
		<section id="compare-by-live-video">
			<Alert.Root class="mb-6">
				<AlertTriangle class="h-4 w-4" />
				<Alert.Description>
					<strong>Camera Permission Required:</strong> This method requires camera access. Users will be prompted to allow camera permissions.
				</Alert.Description>
			</Alert.Root>

			<h2 class="text-3xl font-semibold tracking-tight mb-4">compareByLiveVideo()</h2>
			<p class="text-muted-foreground mb-6">
				Performs real-time face verification using live video feed with liveness detection. This provides the highest security by preventing photo/video spoofing.
			</p>

			<Tabs.Root value="preview" class="w-full">
				<Tabs.List class="grid w-full grid-cols-2">
					<Tabs.Trigger value="preview">Preview</Tabs.Trigger>
					<Tabs.Trigger value="code">Code</Tabs.Trigger>
				</Tabs.List>
				
				<Tabs.Content value="preview" class="mt-6">
					<CompareByLiveVideoDemo />
				</Tabs.Content>
				
				<Tabs.Content value="code" class="mt-6">
					<CodeBlock language="typescript" code={`const result = await winterAuth.compareByLiveVideo(
  referenceImage,
  videoElement,
  {
    securityLevel: 'HIGH',
    enableLivenessCheck: true
  }
);

if (result.verified && result.livenessResult.isLive) {
  console.log('✅ Identity verified with liveness!');
  console.log('Match confidence:', result.confidence);
  console.log('Liveness confidence:', result.livenessResult.confidence);
} else {
  console.log('❌ Verification failed');
  if (!result.livenessResult.isLive) {
    console.log('Liveness check failed - use live person');
  }
}`} />
				</Tabs.Content>
			</Tabs.Root>

			<!-- Method Reference -->
			<div class="mt-8">
				<h3 class="text-xl font-semibold mb-4">Method Reference</h3>
				<Card.Root>
					<Card.Header>
						<Card.Title>Parameters</Card.Title>
					</Card.Header>
					<Card.Content>
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
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">referenceImage</code></Table.Cell>
									<Table.Cell><code class="text-xs">File | Blob | HTMLImageElement | HTMLCanvasElement | string</code></Table.Cell>
									<Table.Cell>The baseline image to compare against video frames</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">videoElement</code></Table.Cell>
									<Table.Cell><code class="text-xs">HTMLVideoElement</code></Table.Cell>
									<Table.Cell>Active video element with camera stream</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">options</code></Table.Cell>
									<Table.Cell><code class="text-xs">LiveVideoOptions?</code></Table.Cell>
									<Table.Cell>Configuration for liveness detection and progress callbacks</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>
					</Card.Content>
				</Card.Root>

				<Card.Root class="mt-4">
					<Card.Header>
						<Card.Title>Options Configuration</Card.Title>
					</Card.Header>
					<Card.Content>
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>Property</Table.Head>
									<Table.Head>Type</Table.Head>
									<Table.Head>Description</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">securityLevel</code></Table.Cell>
									<Table.Cell><code class="text-xs">SecurityStrength?</code></Table.Cell>
									<Table.Cell>Security level for matching (LOW, MEDIUM, HIGH, MAXIMUM)</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">enableLivenessCheck</code></Table.Cell>
									<Table.Cell><code class="text-xs">boolean?</code></Table.Cell>
									<Table.Cell>Enable liveness detection to prevent spoofing attacks</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">enableChallenges</code></Table.Cell>
									<Table.Cell><code class="text-xs">boolean?</code></Table.Cell>
									<Table.Cell>Enable interactive challenges (blink, turn head, etc.)</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">onProgress</code></Table.Cell>
									<Table.Cell><code class="text-xs">Function?</code></Table.Cell>
									<Table.Cell>Callback for real-time progress updates</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>
					</Card.Content>
				</Card.Root>

				<Card.Root class="mt-4">
					<Card.Header>
						<Card.Title>Return Value</Card.Title>
					</Card.Header>
					<Card.Content>
						<Table.Root>
							<Table.Header>
								<Table.Row>
									<Table.Head>Property</Table.Head>
									<Table.Head>Type</Table.Head>
									<Table.Head>Description</Table.Head>
								</Table.Row>
							</Table.Header>
							<Table.Body>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">verified</code></Table.Cell>
									<Table.Cell><code class="text-xs">boolean</code></Table.Cell>
									<Table.Cell>Whether the live video verification succeeded</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">confidence</code></Table.Cell>
									<Table.Cell><code class="text-xs">number</code></Table.Cell>
									<Table.Cell>Overall verification confidence score</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">livenessResult</code></Table.Cell>
									<Table.Cell><code class="text-xs">LivenessResult</code></Table.Cell>
									<Table.Cell>Detailed liveness detection results and confidence</Table.Cell>
								</Table.Row>
								<Table.Row>
									<Table.Cell><code class="text-xs bg-muted px-1 py-0.5 rounded">matchResult</code></Table.Cell>
									<Table.Cell><code class="text-xs">ImageVerificationResult</code></Table.Cell>
									<Table.Cell>Face comparison results between reference and video frame</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- Additional Resources -->
		<section class="pt-8">
			<h2 class="text-2xl font-semibold tracking-tight mb-4">Next Steps</h2>
			<p class="text-muted-foreground mb-4">
				Explore related topics to enhance your Winter Authenticator implementation:
			</p>
			<div class="grid md:grid-cols-2 gap-4">
				<div class="border rounded-lg p-4">
					<h3 class="font-semibold mb-2">Error Handling</h3>
					<p class="text-sm text-muted-foreground mb-3">
						Learn how to handle different error scenarios and implement robust error handling.
					</p>
					<a href="/docs/api-reference/error-codes" class="text-sm font-medium hover:underline">
						View Error Codes →
					</a>
				</div>
				<div class="border rounded-lg p-4">
					<h3 class="font-semibold mb-2">Provider Configuration</h3>
					<p class="text-sm text-muted-foreground mb-3">
						Configure different face recognition providers like AWS Rekognition.
					</p>
					<a href="/docs/modules/authorization/providers/aws" class="text-sm font-medium hover:underline">
						Provider Setup →
					</a>
				</div>
			</div>
		</section>
	</div>
</DocPage>