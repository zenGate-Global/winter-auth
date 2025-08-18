<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from '$lib/components/ui/badge';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Progress } from '$lib/components/ui/progress';
	import { Upload, CheckCircle, XCircle, AlertCircle, Info } from '@lucide/svelte';
	import { createWinterAuth } from '@zengate/winter-auth';
	
	interface Props {
		title?: string;
		description?: string;
	}
	
	let {
		title = "Check Image Quality",
		description = "Upload an image to analyze its quality for face recognition"
	}: Props = $props();
	
	let fileInput: HTMLInputElement;
	let isProcessing = $state(false);
	let result = $state<any>(null);
	let error = $state<string | null>(null);
	let processingTime = $state<number>(0);
	let winterAuth = $state<any>(null);
	
	async function initializeWinterAuth() {
		if (!winterAuth) {
			winterAuth = createWinterAuth({
				mode: 'proxy',
				apiBaseUrl: '/api/winter-auth',
				enableConsoleLogging: true
			});
			await winterAuth.initialize();
		}
	}
	
	async function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		
		if (!file) return;
		
		// Validate file type
		if (!file.type.startsWith('image/')) {
			error = 'Please select a valid image file';
			return;
		}
		
		// Validate file size (10MB limit)
		if (file.size > 10 * 1024 * 1024) {
			error = 'File size must be less than 10MB';
			return;
		}
		
		await processImage(file);
	}
	
	async function processImage(file: File) {
		isProcessing = true;
		error = null;
		result = null;
		
		const startTime = Date.now();
		
		try {
			await initializeWinterAuth();
			
			const qualityResult = await winterAuth.checkImageQuality(file);
			
			processingTime = Date.now() - startTime;
			result = qualityResult;
			
		} catch (err) {
			// Enhanced error handling with helpful messages
			if (err instanceof Error) {
				if (err.message.includes('MISSING_CONFIGURATION') || 
					err.message.includes('Environment variables not configured') ||
					err.message.includes('placeholder values')) {
					error = '⚠️ Setup Required: Please update the .env file with your real AWS credentials. See the provider setup guide in the documentation.';
				} else if (err.message.includes('INITIALIZATION_FAILED')) {
					error = '🔧 Initialization Failed: Check that your AWS credentials are valid and have Rekognition permissions.';
				} else if (err.message.includes('503') || err.message.includes('Service Unavailable')) {
					error = '🚫 Service Unavailable: The Winter Auth service is not properly configured. Please check the setup guide.';
				} else {
					error = err.message;
				}
			} else {
				error = 'An unexpected error occurred';
			}
			console.error('Quality check failed:', err);
		} finally {
			isProcessing = false;
		}
	}
	
	function getQualityColor(score: number): string {
		if (score >= 80) return 'text-green-600';
		if (score >= 60) return 'text-yellow-600';
		return 'text-red-600';
	}
	
	function getQualityIcon(isGood: boolean) {
		return isGood ? CheckCircle : XCircle;
	}
	
	function resetDemo() {
		result = null;
		error = null;
		processingTime = 0;
		if (fileInput) {
			fileInput.value = '';
		}
	}
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title class="flex items-center gap-2">
			<Info class="h-5 w-5" />
			{title}
		</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-6">
	   <!-- File Upload (hidden if result is present) -->
	   {#if !result}
	   <div class="space-y-4">
		   <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
			   <input
				   bind:this={fileInput}
				   type="file"
				   accept="image/*"
				   onchange={handleFileSelect}
				   class="hidden"
			   />
			   <Upload class="mx-auto h-12 w-12 text-gray-400 mb-4" />
			   <p class="text-sm text-gray-600 mb-4">
				   Select an image to analyze quality
			   </p>
			   <Button onclick={() => fileInput?.click()} disabled={isProcessing} class="min-w-32">
				   {isProcessing ? 'Processing...' : 'Choose Image'}
			   </Button>
		   </div>
		   
		   {#if isProcessing}
			   <div class="space-y-2">
				   <div class="flex items-center justify-between text-sm">
					   <span>Analyzing image quality...</span>
					   <span>Please wait</span>
				   </div>
				   <Progress value={undefined} class="h-2" />
			   </div>
		   {/if}
	   </div>
	   {/if}
		
		<!-- Error Display -->
		{#if error}
			<Alert variant="destructive">
				<AlertCircle class="h-4 w-4" />
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		{/if}
		
		<!-- Results -->
		{#if result}
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<h3 class="text-lg font-semibold">Quality Analysis Results</h3>
					<div class="flex items-center gap-2">
						{#if result.isGoodQuality}
							<CheckCircle class="h-5 w-5 text-green-600" />
						{:else}
							<XCircle class="h-5 w-5 text-red-600" />
						{/if}
						<Badge variant={result.isGoodQuality ? 'default' : 'destructive'}>
							{result.isGoodQuality ? 'Good Quality' : 'Poor Quality'}
						</Badge>
					</div>
				</div>
				
				<!-- Quality Score -->
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-base">Overall Quality Score</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="text-3xl font-bold {getQualityColor(result.score)} mb-2">
							{result.score}/100
						</div>
						<Progress value={result.score} class="h-2" />
					</Card.Content>
				</Card.Root>
				
				<!-- Details -->
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-base">Analysis Details</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span class="font-medium">Faces Detected:</span>
								<span class="ml-2">{result.details.faceCount}</span>
							</div>
							{#if result.details.faceConfidence}
								<div>
									<span class="font-medium">Face Confidence:</span>
									<span class="ml-2">{Math.round(result.details.faceConfidence * 100)}%</span>
								</div>
							{/if}
							{#if result.details.brightness}
								<div>
									<span class="font-medium">Brightness:</span>
									<span class="ml-2">{result.details.brightness.toFixed(1)}</span>
								</div>
							{/if}
							{#if result.details.blur}
								<div>
									<span class="font-medium">Blur Level:</span>
									<span class="ml-2">{result.details.blur.toFixed(1)}</span>
								</div>
							{/if}
							{#if result.details.headPose}
								<div>
									<span class="font-medium">Head Pose:</span>
									<span class="ml-2">{result.details.headPose.toFixed(1)}°</span>
								</div>
							{/if}
							<div>
								<span class="font-medium">Processing Time:</span>
								<span class="ml-2">{processingTime}ms</span>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
				
				<!-- Issues -->
				{#if result.issues.length > 0}
					<Card.Root>
						<Card.Header class="pb-3">
							<Card.Title class="text-base text-red-600">Quality Issues</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="space-y-2">
								{#each result.issues as issue}
									<div class="flex items-start gap-2 p-2 bg-red-50 rounded">
										<XCircle class="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
										<div>
											<p class="text-sm font-medium text-red-800">{issue.code}</p>
											<p class="text-sm text-red-700">{issue.message}</p>
										</div>
									</div>
								{/each}
							</div>
						</Card.Content>
					</Card.Root>
				{/if}
				
				<!-- Actions -->
				<div class="flex gap-2">
					<Button variant="outline" onclick={resetDemo}>
						Test Another Image
					</Button>
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>

