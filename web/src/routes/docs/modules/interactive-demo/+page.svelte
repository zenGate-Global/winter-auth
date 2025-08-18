<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import InteractiveExample from '$lib/components/docs/InteractiveExample.svelte';
	import ImageUpload from '$lib/components/interactive/ImageUpload.svelte';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { CheckCircle, XCircle, AlertTriangle, Info } from '@lucide/svelte';
	import { createWinterAuth } from '@zengate/winter-auth';
	
	let qualityFile = $state(null);
	let baseFile = $state(null);
	let compareFile = $state(null);
	let qualityResult = $state(null);
	let comparisonResult = $state(null);
	let isProcessing = $state(false);
	let error = $state(null);

	const winterAuth = createWinterAuth({
		mode: 'proxy',
		apiBaseUrl: '/api/winter-auth'
	});

	async function checkImageQuality() {
		if (!qualityFile) return;
		
		isProcessing = true;
		error = null;
		
		try {
			const result = await winterAuth.checkImageQuality(qualityFile);
			qualityResult = result;
		} catch (err) {
			error = err.message || 'Failed to check image quality';
			qualityResult = null;
		} finally {
			isProcessing = false;
		}
	}

	async function compareImages() {
		if (!baseFile || !compareFile) return;
		
		isProcessing = true;
		error = null;
		
		try {
			const result = await winterAuth.compareByImage(baseFile, compareFile, 0.80);
			comparisonResult = result;
		} catch (err) {
			error = err.message || 'Failed to compare images';
			comparisonResult = null;
		} finally {
			isProcessing = false;
		}
	}

	function formatMetric(value, suffix = '') {
		return typeof value === 'number' ? (value * 100).toFixed(1) + '%' + suffix : 'N/A';
	}
</script>

<DocPage title="Interactive Demo" description="Try Winter Authenticator features with real examples">
	
	<div class="space-y-8">
		<Alert>
			<Info class="h-4 w-4" />
			<AlertDescription>
				This interactive demo connects to the live Winter Authenticator API. 
				Upload your own images to test face verification in real-time.
			</AlertDescription>
		</Alert>

		<!-- Image Quality Check Demo -->
		<section class="space-y-4">
			<InteractiveExample
				title="Image Quality Assessment"
				description="Upload an image to check if it meets quality standards for face recognition"
				examples={{
					"Quality Check": `const result = await winterAuth.checkImageQuality(imageFile);

if (result.isGoodQuality) {
  console.log('✅ Image quality is good');
  console.log('Face confidence:', result.metrics.confidence);
  console.log('Brightness:', result.metrics.brightness);
  console.log('Sharpness:', result.metrics.sharpness);
} else {
  console.log('❌ Quality issues found:');
  result.issues.forEach(issue => {
    console.log('-', issue.message);
  });
}`,
					"Error Handling": `try {
  const result = await winterAuth.checkImageQuality(imageFile);
  // Handle success...
} catch (error) {
  if (error.code === 'NO_FACE_DETECTED') {
    console.log('No face found in image');
  } else if (error.code === 'MULTIPLE_FACES_DETECTED') {
    console.log('Multiple faces detected');
  } else {
    console.log('Unexpected error:', error.message);
  }
}`
				}}
			>
				<div class="space-y-4">
					<ImageUpload
						accept="image/*"
						onFileSelect={(file) => qualityFile = file}
						placeholder="Select an image to check quality"
					/>
					
					{#if qualityFile}
						<Button 
							onclick={checkImageQuality} 
							disabled={isProcessing}
							class="w-full"
						>
							{isProcessing ? 'Analyzing...' : 'Check Image Quality'}
						</Button>
					{/if}

					{#if error}
						<Alert variant="destructive">
							<XCircle class="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					{/if}

					{#if qualityResult}
						<Card.Root>
							<Card.Header>
								<Card.Title class="flex items-center gap-2">
									{#if qualityResult.isGoodQuality}
										<CheckCircle class="h-5 w-5 text-green-600" />
										Good Quality
									{:else}
										<XCircle class="h-5 w-5 text-red-600" />
										Quality Issues Found
									{/if}
								</Card.Title>
							</Card.Header>
							<Card.Content class="space-y-4">
								<!-- Quality Metrics -->
								<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
									<div class="text-center">
										<div class="text-2xl font-bold">{qualityResult.metrics.faceCount}</div>
										<div class="text-sm text-muted-foreground">Faces</div>
									</div>
									<div class="text-center">
										<div class="text-2xl font-bold">{formatMetric(qualityResult.metrics.confidence)}</div>
										<div class="text-sm text-muted-foreground">Confidence</div>
									</div>
									<div class="text-center">
										<div class="text-2xl font-bold">{formatMetric(qualityResult.metrics.brightness)}</div>
										<div class="text-sm text-muted-foreground">Brightness</div>
									</div>
									<div class="text-center">
										<div class="text-2xl font-bold">{formatMetric(qualityResult.metrics.sharpness)}</div>
										<div class="text-sm text-muted-foreground">Sharpness</div>
									</div>
								</div>

								<!-- Issues -->
								{#if qualityResult.issues.length > 0}
									<div class="space-y-2">
										<h5 class="font-medium">Issues Found:</h5>
										{#each qualityResult.issues as issue}
											<div class="flex items-start gap-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-400">
												<AlertTriangle class="h-4 w-4 text-yellow-600 mt-0.5" />
												<div class="text-sm">
													<div class="font-medium">{issue.code}</div>
													<div class="text-yellow-700">{issue.message}</div>
												</div>
											</div>
										{/each}
									</div>
								{/if}
							</Card.Content>
						</Card.Root>
					{/if}
				</div>
			</InteractiveExample>
		</section>

		<!-- Face Comparison Demo -->
		<section class="space-y-4">
			<InteractiveExample
				title="Face Comparison"
				description="Upload two images to compare faces and see similarity scores"
				examples={{
					"Basic Comparison": `const result = await winterAuth.compareByImage(
  baseImage, 
  compareImage,
  0.80  // 80% similarity threshold
);

console.log('Is match:', result.isMatch);
console.log('Similarity:', result.similarityPercent + '%');
console.log('Threshold used:', result.threshold);`,
					"With Quality Validation": `// Both images are automatically checked for quality
const result = await winterAuth.compareByImage(baseImage, compareImage);

if (!result.baseImageQuality.isGoodQuality) {
  console.log('Base image issues:', result.baseImageQuality.issues);
}

if (!result.compareImageQuality.isGoodQuality) {
  console.log('Compare image issues:', result.compareImageQuality.issues);
}

if (result.isMatch) {
  console.log('✅ Faces match with', result.similarityPercent + '% similarity');
} else {
  console.log('❌ Faces do not match');
}`,
					"Security Levels": `import { SECURITY_THRESHOLDS } from '@zengate/winter-auth';

// Use predefined security levels
const lowSecurity = await winterAuth.compareByImage(
  img1, img2, SECURITY_THRESHOLDS.LOW    // 60%
);

const highSecurity = await winterAuth.compareByImage(
  img1, img2, SECURITY_THRESHOLDS.HIGH   // 90%
);`
				}}
			>
				<div class="space-y-4">
					<div class="grid md:grid-cols-2 gap-4">
						<div>
							<label class="block text-sm font-medium mb-2">Base Image</label>
							<ImageUpload
								accept="image/*"
								onFileSelect={(file) => baseFile = file}
								placeholder="Select base image"
							/>
						</div>
						<div>
							<label class="block text-sm font-medium mb-2">Compare Image</label>
							<ImageUpload
								accept="image/*"
								onFileSelect={(file) => compareFile = file}
								placeholder="Select comparison image"
							/>
						</div>
					</div>
					
					{#if baseFile && compareFile}
						<Button 
							onclick={compareImages} 
							disabled={isProcessing}
							class="w-full"
						>
							{isProcessing ? 'Comparing...' : 'Compare Faces'}
						</Button>
					{/if}

					{#if error}
						<Alert variant="destructive">
							<XCircle class="h-4 w-4" />
							<AlertDescription>{error}</AlertDescription>
						</Alert>
					{/if}

					{#if comparisonResult}
						<Card.Root>
							<Card.Header>
								<Card.Title class="flex items-center gap-2">
									{#if comparisonResult.isMatch}
										<CheckCircle class="h-5 w-5 text-green-600" />
										Faces Match
									{:else}
										<XCircle class="h-5 w-5 text-red-600" />
										Faces Don't Match
									{/if}
									<Badge variant={comparisonResult.isMatch ? 'default' : 'secondary'}>
										{comparisonResult.similarityPercent.toFixed(1)}% Similarity
									</Badge>
								</Card.Title>
							</Card.Header>
							<Card.Content class="space-y-4">
								<div class="grid grid-cols-3 gap-4 text-center">
									<div>
										<div class="text-2xl font-bold">{comparisonResult.similarityPercent.toFixed(1)}%</div>
										<div class="text-sm text-muted-foreground">Similarity</div>
									</div>
									<div>
										<div class="text-2xl font-bold">{(comparisonResult.threshold * 100).toFixed(0)}%</div>
										<div class="text-sm text-muted-foreground">Threshold</div>
									</div>
									<div>
										<div class="text-2xl font-bold">{(comparisonResult.confidence * 100).toFixed(1)}%</div>
										<div class="text-sm text-muted-foreground">Confidence</div>
									</div>
								</div>

								<!-- Progress bar for similarity -->
								<div class="space-y-2">
									<div class="flex justify-between text-sm">
										<span>Similarity Score</span>
										<span>{comparisonResult.similarityPercent.toFixed(1)}%</span>
									</div>
									<div class="w-full bg-gray-200 rounded-full h-2">
										<div 
											class="h-2 rounded-full transition-all duration-500 {comparisonResult.isMatch ? 'bg-green-600' : 'bg-red-600'}"
											style="width: {comparisonResult.similarityPercent}%"
										></div>
									</div>
									<div class="flex justify-between text-xs text-muted-foreground">
										<span>0%</span>
										<span class="text-orange-600">Threshold: {(comparisonResult.threshold * 100).toFixed(0)}%</span>
										<span>100%</span>
									</div>
								</div>
							</Card.Content>
						</Card.Root>
					{/if}
				</div>
			</InteractiveExample>
		</section>

		<!-- Next Steps -->
		<section class="space-y-4">
			<h2 class="text-2xl font-semibold tracking-tight">Explore More</h2>
			<div class="grid md:grid-cols-2 gap-4">
				<Card.Root>
					<Card.Header>
						<Card.Title>API Reference</Card.Title>
						<Card.Description>Complete type definitions and error codes</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="space-y-2">
							<Button variant="outline" size="sm" href="/docs/api-reference/type-definitions">
								TypeScript Types
							</Button>
							<Button variant="outline" size="sm" href="/docs/api-reference/error-codes">
								Error Codes
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
				
				<Card.Root>
					<Card.Header>
						<Card.Title>Getting Started</Card.Title>
						<Card.Description>Installation and configuration guides</Card.Description>
					</Card.Header>
					<Card.Content>
						<div class="space-y-2">
							<Button variant="outline" size="sm" href="/docs/get-started/installation">
								Installation
							</Button>
							<Button variant="outline" size="sm" href="/docs/get-started/providers">
								Provider Setup
							</Button>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</section>
	</div>
</DocPage>


