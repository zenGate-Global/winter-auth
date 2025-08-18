<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from '$lib/components/ui/badge';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Progress } from '$lib/components/ui/progress';
import * as Select from '$lib/components/ui/select/index.js';
	import { Switch } from '$lib/components/ui/switch';
	import { Upload, Video, VideoOff, CheckCircle, XCircle, AlertCircle, Play, Square, Camera } from '@lucide/svelte';
	import { createWinterAuth } from '@zengate/winter-auth';
	
	interface Props {
		title?: string;
		description?: string;
	}
	
	let {
		title = "Live Video Comparison",
		description = "Compare a reference image with live video feed"
	}: Props = $props();
	
	let referenceInput: HTMLInputElement;
	let videoElement: HTMLVideoElement;
	let isProcessing = $state(false);
	let result = $state<any>(null);
	let error = $state<string | null>(null);
	let processingTime = $state<number>(0);
	let winterAuth = $state<any>(null);
	let securityLevel = $state<string>('MEDIUM');
	let enableLivenessCheck = $state(true);
	let enableChallenges = $state(false);
	
	let referenceFile = $state<File | null>(null);
	let referencePreview = $state<string | null>(null);
	let stream = $state<MediaStream | null>(null);
	let isVideoActive = $state(false);
	let currentStage = $state<string>('');
	let currentProgress = $state<number>(0);
	let currentFeedback = $state<string>('');
	let providerInfo = $state<any>(null);
	let overlayMessage = $state<string>('');
	let overlayType = $state<'instruction' | 'processing' | 'success' | 'error' | 'countdown' | ''>('');
	let autoCloseTimer = $state<NodeJS.Timeout | null>(null);
	let countdownTimer = $state<NodeJS.Timeout | null>(null);
	let countdownValue = $state<number>(0);
	let hasDetectedMovement = $state<boolean>(false);
	
	async function fetchProviderInfo() {
		try {
			const response = await fetch('/api/winter-auth/health');
			const data = await response.json();
			providerInfo = data;
		} catch (error) {
			console.error('Failed to fetch provider info:', error);
		}
	}
	
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
	
	async function handleReferenceFile(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		
		if (!file) return;
		
		if (!file.type.startsWith('image/')) {
			error = 'Please select a valid image file';
			return;
		}
		
		referenceFile = file;
		referencePreview = URL.createObjectURL(file);
		error = null;
	}
	
	async function startCamera() {
		try {
			await fetchProviderInfo();
			
			stream = await navigator.mediaDevices.getUserMedia({ 
				video: { 
					width: { ideal: 1280 }, 
					height: { ideal: 720 },
					facingMode: 'user'
				} 
			});
			videoElement.srcObject = stream;
			isVideoActive = true;
			error = null;
			
			// Show initial instruction overlay
			overlayMessage = 'Position your face in the oval guide';
			overlayType = 'instruction';
			hasDetectedMovement = false;
		} catch (err) {
			error = 'Failed to access camera. Please check permissions.';
			console.error('Camera access failed:', err);
		}
	}
	
	async function stopCamera() {
		if (stream) {
			stream.getTracks().forEach(track => track.stop());
			stream = null;
		}
		isVideoActive = false;
		videoElement.srcObject = null;
		overlayMessage = '';
		overlayType = '';
		
		if (autoCloseTimer) {
			clearTimeout(autoCloseTimer);
			autoCloseTimer = null;
		}
		
		if (countdownTimer) {
			clearTimeout(countdownTimer);
			countdownTimer = null;
		}
		
		hasDetectedMovement = false;
		countdownValue = 0;
	}
	
	async function startLiveComparison() {
		if (!referenceFile || !isVideoActive) {
			error = 'Please select a reference image and start the camera first';
			return;
		}
		
		// Start with movement detection
		overlayMessage = 'Move your head slightly to confirm you are live';
		overlayType = 'instruction';
		hasDetectedMovement = false;
		
		// Simulate head movement detection (in real implementation, this would use face tracking)
		// This would typically be done by analyzing facial landmarks frame by frame
		const checkForMovement = () => {
			if (!hasDetectedMovement && isVideoActive) {
				hasDetectedMovement = true;
				overlayMessage = 'Movement detected! Get ready...';
				setTimeout(() => {
					startCountdown();
				}, 1000);
			}
		};
		
		// Simulate movement detection after 3 seconds (user has time to move)
		setTimeout(checkForMovement, 3000);
	}
	
	function startCountdown() {
		countdownValue = 3;
		overlayMessage = `Starting verification in ${countdownValue}...`;
		overlayType = 'countdown';
		
		countdownTimer = setInterval(() => {
			countdownValue--;
			if (countdownValue > 0) {
				overlayMessage = `Starting verification in ${countdownValue}...`;
			} else {
				clearInterval(countdownTimer!);
				countdownTimer = null;
				performVerification();
			}
		}, 1000);
	}
	
	async function performVerification() {
		isProcessing = true;
		error = null;
		result = null;
		currentStage = '';
		currentProgress = 0;
		currentFeedback = '';
		overlayMessage = 'Processing...';
		overlayType = 'processing';
		
		const startTime = Date.now();
		
		try {
			await initializeWinterAuth();
			
			const comparisonResult = await winterAuth.compareByLiveVideo(
				referenceFile,
				videoElement,
				{
					securityLevel,
					enableLivenessCheck,
					enableChallenges,
					onProgress: (progress: any) => {
						currentStage = progress.stage;
						currentProgress = progress.progress;
						currentFeedback = progress.feedback;
						overlayMessage = getStageText(progress.stage);
					}
				}
			);
			
			processingTime = Date.now() - startTime;
			result = comparisonResult;
			
			// Show result overlay and auto-close camera after 5 seconds
			if (comparisonResult.verified) {
				overlayMessage = 'Verified ✓';
				overlayType = 'success';
			} else {
				overlayMessage = 'Not Verified ✗';
				overlayType = 'error';
			}
			
			autoCloseTimer = setTimeout(() => {
				stopCamera();
			}, 5000);
			
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
			console.error('Live video comparison failed:', err);
			overlayMessage = 'Error occurred';
			overlayType = 'error';
			
			autoCloseTimer = setTimeout(() => {
				stopCamera();
			}, 5000);
		} finally {
			isProcessing = false;
			currentStage = '';
			currentProgress = 0;
			currentFeedback = '';
		}
	}
	
	function stopLiveComparison() {
		isProcessing = false;
		currentStage = '';
		currentProgress = 0;
		currentFeedback = '';
		overlayMessage = 'Position your face in the oval guide';
		overlayType = 'instruction';
		hasDetectedMovement = false;
		countdownValue = 0;
		
		if (countdownTimer) {
			clearInterval(countdownTimer);
			countdownTimer = null;
		}
	}
	
	function getMatchColor(isMatch: boolean): string {
		return isMatch ? 'text-green-600' : 'text-red-600';
	}
	
	function getMatchIcon(isMatch: boolean) {
		return isMatch ? CheckCircle : XCircle;
	}
	
	function getStageText(stage: string): string {
		const stages = {
			'setup': 'Setting up...',
			'face-detection': 'Detecting faces...',
			'liveness-check': 'Checking liveness...',
			'challenge': 'Performing challenge...',
			'face_comparison': 'Comparing faces...',
			'finalizing': 'Finalizing results...'
		};
		return stages[stage as keyof typeof stages] || stage;
	}
	
	function resetDemo() {
		result = null;
		error = null;
		processingTime = 0;
		referenceFile = null;
		referencePreview = null;
		if (referenceInput) referenceInput.value = '';
		stopCamera();
	}
	
	function getProviderDisplayName(provider: string): string {
		const providers = {
			'aws': 'AWS Rekognition',
			'azure': 'Azure Face API',
			'kairos': 'Kairos Face Recognition'
		};
		return providers[provider as keyof typeof providers] || provider.toUpperCase();
	}
	
	function doesProviderSupportChallenges(provider: string): boolean {
		// AWS Rekognition doesn't support custom challenges
		// Azure and other providers might support them
		return provider !== 'aws';
	}
	
	async function handleSecurityChange(value: string) {
		securityLevel = value;
	}
	
	onMount(() => {
		fetchProviderInfo();
	});
</script>


<!-- Provider warning/support table removed: no mocked or static provider value. Only real environment/config detection allowed. -->

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title class="flex items-center gap-2">
			<Camera class="h-5 w-5" />
			{title}
		</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-6">
		<!-- Provider Info Alert -->
		{#if providerInfo}
			<Alert class="border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50">
				<AlertCircle class="h-4 w-4 text-slate-600 dark:text-slate-400" />
				<AlertDescription class="text-slate-700 dark:text-slate-300">
					<div>

					
					<span class="font-medium">Provider:</span> <Badge variant="default">{getProviderDisplayName(providerInfo.provider)}</Badge>
					<span class="mx-2">•</span>
					<span>Status:</span> 
					<Badge variant={providerInfo.status === 'healthy' ? 'default' : 'destructive'} class="ml-1">
						{providerInfo.status}
					</Badge>
					</div>
				</AlertDescription>
			</Alert>
		{/if}
		
		<!-- Configuration -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="space-y-2">
				<span class="text-sm font-medium">Security Level</span>
			   <Select.Root type="single" name="securityLevel" bind:value={securityLevel}>
				   <Select.Trigger>
					   {securityLevel === 'LOW' ? 'Low (70% threshold)'
						: securityLevel === 'MEDIUM' ? 'Medium (80% threshold)'
						: securityLevel === 'HIGH' ? 'High (90% threshold)'
						: securityLevel === 'MAXIMUM' ? 'Maximum (95% threshold)'
						: 'Select security level'}
				   </Select.Trigger>
				   <Select.Content>
					   <Select.Item value="LOW">Low (70% threshold)</Select.Item>
					   <Select.Item value="MEDIUM">Medium (80% threshold)</Select.Item>
					   <Select.Item value="HIGH">High (90% threshold)</Select.Item>
					   <Select.Item value="MAXIMUM">Maximum (95% threshold)</Select.Item>
				   </Select.Content>
			   </Select.Root>
			</div>
			
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium">Liveness Check</span>
					<Switch bind:checked={enableLivenessCheck} />
				</div>
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium">Challenges</span>
					<div class="flex items-center gap-2">
						<Switch bind:checked={enableChallenges} disabled={providerInfo && !doesProviderSupportChallenges(providerInfo.provider)} />
						{#if providerInfo && !doesProviderSupportChallenges(providerInfo.provider)}
							<span class="text-xs text-gray-500">Not supported by {getProviderDisplayName(providerInfo.provider)}</span>
						{/if}
					</div>
				</div>
			</div>
		</div>
		
		<!-- Mobile Layout: Reference Image and Video Feed -->
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Reference Image Upload -->
			<div class="space-y-2">
				<span class="text-sm font-medium">Reference Image</span>
				<div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center h-80 flex flex-col justify-center">
					<input
						bind:this={referenceInput}
						type="file"
						accept="image/*"
						onchange={handleReferenceFile}
						class="hidden"
					/>
					{#if referencePreview}
						<img src={referencePreview} alt="Reference" class="mx-auto max-h-60 w-auto object-contain rounded mb-2" />
					{:else}
						<Upload class="mx-auto h-12 w-12 text-gray-400 mb-2" />
						<p class="text-sm text-gray-600 mb-2">Upload reference image</p>
					{/if}
					<Button size="sm" onclick={() => referenceInput?.click()} disabled={isProcessing}>
						{referenceFile ? 'Change Reference' : 'Select Reference'}
					</Button>
				</div>
			</div>
			
			<!-- Mobile Phone Mockup with Video Feed -->
			<div class="space-y-2">
				<span class="text-sm font-medium">Live Video Feed</span>
				
				<!-- Phone Mockup Container -->
				<div class="mx-auto max-w-xs">
					<!-- Phone Frame -->
					<div class="relative bg-black rounded-3xl p-2 shadow-xl">
						<!-- Screen Area -->
						<div class="relative bg-gray-900 rounded-3xl overflow-hidden" style="aspect-ratio: 9/19.5;">
							<!-- Status Bar -->
							<div class="absolute top-0 left-0 right-0 h-8 bg-black z-20 flex items-center justify-between px-4">
								<div class="w-16 h-3 bg-gray-600 rounded-full"></div>
								<div class="flex gap-1">
									<div class="w-4 h-2 bg-gray-600 rounded-sm"></div>
									<div class="w-6 h-2 bg-gray-600 rounded-sm"></div>
								</div>
							</div>
							
							<!-- Video Container -->
							<div class="absolute inset-0 pt-8">
								<video
									bind:this={videoElement}
									autoplay
									muted
									playsinline
									class="w-full h-full object-cover"
								></video>
								
								{#if !isVideoActive}
									<div class="absolute inset-0 flex items-center justify-center bg-gray-800">
										<div class="text-center">
											<VideoOff class="mx-auto h-12 w-12 text-gray-400 mb-2" />
											<p class="text-sm text-gray-300">Camera not active</p>
										</div>
									</div>
								{/if}
								
								<!-- Face Detection Guide Oval -->
								{#if isVideoActive && overlayType === 'instruction'}
									<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
										<div class="w-40 h-52 border-2 border-white/60 rounded-full flex items-center justify-center">
											<div class="w-32 h-44 border border-white/40 rounded-full"></div>
										</div>
									</div>
								{/if}
								
								<!-- Overlay Messages -->
								{#if overlayMessage}
									<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
										{#if overlayType === 'processing'}
											<div class="bg-blue-900/80 text-white px-4 py-2 rounded-lg text-center">
												<div class="animate-spin w-6 h-6 border-2 border-white/30 border-t-white rounded-full mx-auto mb-2"></div>
												<p class="text-sm font-medium">{overlayMessage}</p>
											</div>
										{:else if overlayType === 'countdown'}
											<div class="bg-orange-900/80 text-white px-6 py-4 rounded-lg text-center">
												<div class="w-8 h-8 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center">
													<span class="text-lg font-bold">{countdownValue}</span>
												</div>
												<p class="text-sm font-medium">{overlayMessage}</p>
											</div>
										{:else if overlayType === 'success'}
											<div class="bg-green-900/80 text-white px-6 py-4 rounded-lg text-center">
												<CheckCircle class="w-8 h-8 mx-auto mb-2" />
												<p class="text-lg font-bold">{overlayMessage}</p>
											</div>
										{:else if overlayType === 'error'}
											<div class="bg-red-900/80 text-white px-6 py-4 rounded-lg text-center">
												<XCircle class="w-8 h-8 mx-auto mb-2" />
												<p class="text-lg font-bold">{overlayMessage}</p>
											</div>
										{:else if overlayType === 'instruction'}
											<div class="absolute bottom-20 left-4 right-4">
												<div class="bg-black/70 text-white px-4 py-2 rounded-lg text-center">
													<p class="text-sm">{overlayMessage}</p>
												</div>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						</div>
						
						<!-- Home Indicator -->
						<div class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gray-600 rounded-full"></div>
					</div>
				</div>
				
				<!-- Camera Controls -->
				<div class="flex gap-2 justify-center mt-4">
					{#if !isVideoActive}
						<Button onclick={startCamera} disabled={isProcessing}>
							<Video class="h-4 w-4 mr-2" />
							Start Camera
						</Button>
					{:else}
						<Button variant="outline" onclick={stopCamera} disabled={isProcessing}>
							<VideoOff class="h-4 w-4 mr-2" />
							Stop Camera
						</Button>
					{/if}
				</div>
			</div>
		</div>
		
		<!-- Live Comparison Controls -->
		<div class="flex gap-2 justify-center">
			{#if !isProcessing}
				<Button 
					onclick={startLiveComparison} 
					disabled={!referenceFile || !isVideoActive}
					class="min-w-48"
				>
					<Play class="h-4 w-4 mr-2" />
					Start Live Comparison
				</Button>
			{:else}
				<Button 
					variant="outline" 
					onclick={stopLiveComparison}
					class="min-w-48"
				>
					<Square class="h-4 w-4 mr-2" />
					Stop Comparison
				</Button>
			{/if}
		</div>
		
		<!-- Processing Status -->
		{#if isProcessing}
			<div class="space-y-2">
				<div class="flex items-center justify-between text-sm">
					<span>{getStageText(currentStage)}</span>
					<span>{currentProgress}%</span>
				</div>
				<Progress value={currentProgress} class="h-2" />
				{#if currentFeedback}
					<p class="text-sm text-blue-600">{currentFeedback}</p>
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
					<h3 class="text-lg font-semibold">Live Verification Results</h3>
					<div class="flex items-center gap-2">
						{#if result.verified}
							<CheckCircle class="h-5 w-5 text-green-600" />
						{:else}
							<XCircle class="h-5 w-5 text-red-600" />
						{/if}
						<Badge variant={result.verified ? 'default' : 'destructive'}>
							{result.verified ? 'Verified' : 'Not Verified'}
						</Badge>
					</div>
				</div>
				
				<!-- Similarity Score -->
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-base">Similarity Score</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="text-3xl font-bold {getMatchColor(result.verified)} mb-2">
							{Math.round(result.similarity * 100)}%
						</div>
						<Progress value={result.similarity * 100} class="h-2" />
						<p class="text-sm text-gray-600 mt-2">
							Confidence: {Math.round(result.confidence * 100)}%
						</p>
					</Card.Content>
				</Card.Root>
				
				<!-- Analysis Details -->
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-base">Analysis Details</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span class="font-medium">Frames Analyzed:</span>
								<span class="ml-2">{result.framesAnalyzed}</span>
							</div>
							<div>
								<span class="font-medium">Status:</span>
								<span class="ml-2">{result.status}</span>
							</div>
							<div>
								<span class="font-medium">Processing Time:</span>
								<span class="ml-2">{processingTime}ms</span>
							</div>
							<div>
								<span class="font-medium">Security Level:</span>
								<span class="ml-2">{securityLevel}</span>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
				
				<!-- Liveness Results -->
				{#if result.livenessResult}
					<Card.Root>
						<Card.Header class="pb-3">
							<Card.Title class="text-base">Liveness Detection</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="flex items-center gap-2 mb-2">
								<Badge variant={result.livenessResult.isLive ? 'default' : 'destructive'}>
									{result.livenessResult.isLive ? 'Live' : 'Not Live'}
								</Badge>
								<span class="text-sm">
									Confidence: {Math.round(result.livenessResult.confidence * 100)}%
								</span>
							</div>
							{#if result.livenessResult.details?.spoofIndicators?.length > 0}
								<div class="text-sm text-red-600">
									Spoof indicators: {result.livenessResult.details.spoofIndicators.join(', ')}
								</div>
							{/if}
						</Card.Content>
					</Card.Root>
				{/if}
				
				<!-- Challenge Results -->
				{#if result.challenges && result.challenges.length > 0}
					<Card.Root>
						<Card.Header class="pb-3">
							<Card.Title class="text-base">Challenge Results</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="space-y-2">
								{#each result.challenges as challenge}
									<div class="flex items-center justify-between p-2 bg-gray-50 rounded">
										<span class="text-sm font-medium">{challenge.type}</span>
										<Badge variant={challenge.isSuccessful ? 'default' : 'destructive'}>
											{challenge.isSuccessful ? 'Success' : 'Failed'}
										</Badge>
									</div>
								{/each}
							</div>
						</Card.Content>
					</Card.Root>
				{/if}
				
				<!-- Actions -->
				<div class="flex gap-2">
					<Button variant="outline" onclick={resetDemo}>
						Reset Demo
					</Button>
					<Button variant="outline" onclick={startLiveComparison} disabled={!referenceFile || !isVideoActive}>
						Compare Again
					</Button>
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
