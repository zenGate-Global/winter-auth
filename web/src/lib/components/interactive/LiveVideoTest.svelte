<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Video, VideoOff, Play, Square, RefreshCw, Camera, AlertCircle } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import type { LiveVideoVerificationResult } from 'winter-authenticator';
	
	interface Props {
		title?: string;
		description?: string;
	}
	
	let {
		title = "Live Video Verification",
		description = "Test real-time face verification using your camera"
	}: Props = $props();
	
	let videoElement: HTMLVideoElement;
	let canvasElement: HTMLCanvasElement;
	let stream: MediaStream | null = $state(null);
	let isStreaming = $state(false);
	let isRecording = $state(false);
	let hasPermission = $state(false);
	let permissionError = $state<string | null>(null);
	let verificationResult = $state<LiveVideoVerificationResult | null>(null);
	let isVerifying = $state(false);
	let frameCount = $state(0);
	let lastFrameTime = $state(0);
	let fps = $state(0);
	
	let verificationInterval: number;
	
	onMount(() => {
		checkCameraPermission();
		
		return () => {
			stopStream();
			if (verificationInterval) {
				clearInterval(verificationInterval);
			}
		};
	});
	
	async function checkCameraPermission() {
		try {
			const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
			hasPermission = result.state === 'granted';
			
			if (result.state === 'prompt') {
				// Permission will be requested when user clicks start
				hasPermission = true;
			}
		} catch (error) {
			console.warn('Permissions API not supported', error);
			hasPermission = true; // Assume permission, will be handled during getUserMedia
		}
	}
	
	async function startStream() {
		try {
			stream = await navigator.mediaDevices.getUserMedia({
				video: { 
					width: { ideal: 1280 }, 
					height: { ideal: 720 },
					facingMode: 'user'
				},
				audio: false
			});
			
			videoElement.srcObject = stream;
			videoElement.onloadedmetadata = () => {
				videoElement.play();
				isStreaming = true;
				permissionError = null;
				startFrameCounter();
			};
			
		} catch (error) {
			console.error('Error accessing camera:', error);
			permissionError = error instanceof Error ? error.message : 'Failed to access camera';
			isStreaming = false;
		}
	}
	
	function stopStream() {
		if (stream) {
			stream.getTracks().forEach(track => track.stop());
			stream = null;
		}
		isStreaming = false;
		isRecording = false;
		stopVerification();
	}
	
	function startFrameCounter() {
		const countFrames = () => {
			if (isStreaming) {
				const now = Date.now();
				frameCount++;
				
				if (now - lastFrameTime >= 1000) {
					fps = frameCount;
					frameCount = 0;
					lastFrameTime = now;
				}
				
				requestAnimationFrame(countFrames);
			}
		};
		
		lastFrameTime = Date.now();
		requestAnimationFrame(countFrames);
	}
	
	function startVerification() {
		if (!isStreaming) return;
		
		isRecording = true;
		verificationResult = null;
		
		// Start continuous verification every 2 seconds
		verificationInterval = setInterval(async () => {
			if (isStreaming && !isVerifying) {
				await captureAndVerify();
			}
		}, 2000);
		
		// Initial verification
		captureAndVerify();
	}
	
	function stopVerification() {
		isRecording = false;
		if (verificationInterval) {
			clearInterval(verificationInterval);
		}
	}
	
	async function captureAndVerify() {
		if (!videoElement || !canvasElement || isVerifying) return;
		
		isVerifying = true;
		
		try {
			// Capture frame from video
			const context = canvasElement.getContext('2d');
			if (!context) throw new Error('Could not get canvas context');
			
			canvasElement.width = videoElement.videoWidth;
			canvasElement.height = videoElement.videoHeight;
			context.drawImage(videoElement, 0, 0);
			
			// Convert to base64
			const imageData = canvasElement.toDataURL('image/jpeg', 0.8);
			
			// Send to verification endpoint
			const response = await fetch('/api/winter-auth/verify-live', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					imageData,
					timestamp: Date.now()
				})
			});
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			const result = await response.json();
			verificationResult = result;
			
		} catch (error) {
			console.error('Verification error:', error);
			verificationResult = {
				isLive: false,
				confidence: 0,
				faceDetected: false,
				timestamp: Date.now(),
				error: error instanceof Error ? error.message : 'Verification failed'
			};
		} finally {
			isVerifying = false;
		}
	}
	
	function getStatusColor(isLive: boolean, confidence: number): string {
		if (!isLive) return 'bg-red-100 text-red-800 border-red-200';
		if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
		if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
		return 'bg-red-100 text-red-800 border-red-200';
	}
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-6">
		<!-- Camera Permission -->
		{#if !hasPermission}
			<Card.Root class="border-yellow-200 bg-yellow-50">
				<Card.Content class="pt-6">
					<div class="flex items-center gap-2 text-yellow-800">
						<AlertCircle class="h-5 w-5" />
						<p>Camera permission is required for live video verification.</p>
					</div>
				</Card.Content>
			</Card.Root>
		{/if}
		
		<!-- Permission Error -->
		{#if permissionError}
			<Card.Root class="border-destructive">
				<Card.Content class="pt-6">
					<div class="flex items-center gap-2 text-destructive">
						<AlertCircle class="h-5 w-5" />
						<p>{permissionError}</p>
					</div>
				</Card.Content>
			</Card.Root>
		{/if}
		
		<!-- Video Container -->
		<div class="relative">
			<div class="aspect-video bg-black rounded-lg overflow-hidden">
				<video
					bind:this={videoElement}
					class="w-full h-full object-cover"
					muted
					playsinline
				></video>
				
				<!-- Stream Status Overlay -->
				<div class="absolute top-4 left-4 flex gap-2">
					{#if isStreaming}
						<Badge class="bg-red-500 text-white">
							<div class="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
							LIVE
						</Badge>
					{/if}
					
					{#if isRecording}
						<Badge class="bg-blue-500 text-white">
							<Camera class="h-3 w-3 mr-1" />
							RECORDING
						</Badge>
					{/if}
					
					{#if fps > 0}
						<Badge variant="outline" class="bg-black/50 text-white border-white/20">
							{fps} FPS
						</Badge>
					{/if}
				</div>
				
				<!-- Verification Status Overlay -->
				{#if verificationResult}
					<div class="absolute top-4 right-4">
						<Badge class={getStatusColor(verificationResult.isLive, verificationResult.confidence)}>
							{verificationResult.isLive ? 'LIVE PERSON' : 'NOT LIVE'}
						</Badge>
					</div>
				{/if}
			</div>
		</div>
		
		<!-- Hidden canvas for frame capture -->
		<canvas bind:this={canvasElement} class="hidden"></canvas>
		
		<!-- Control Buttons -->
		<div class="flex gap-3">
			{#if !isStreaming}
				<Button onclick={startStream} class="flex-1">
					<Video class="h-4 w-4 mr-2" />
					Start Camera
				</Button>
			{:else}
				<Button onclick={stopStream} variant="outline" class="flex-1">
					<VideoOff class="h-4 w-4 mr-2" />
					Stop Camera
				</Button>
			{/if}
			
			{#if isStreaming}
				{#if !isRecording}
					<Button onclick={startVerification} class="flex-1">
						<Play class="h-4 w-4 mr-2" />
						Start Verification
					</Button>
				{:else}
					<Button onclick={stopVerification} variant="destructive" class="flex-1">
						<Square class="h-4 w-4 mr-2" />
						Stop Verification
					</Button>
				{/if}
			{/if}
		</div>
		
		<!-- Verification Results -->
		{#if verificationResult}
			<div class="space-y-4">
				<Separator />
				<div>
					<h3 class="text-lg font-semibold mb-4">Live Verification Results</h3>
					
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
						<!-- Liveness Status -->
						<Card.Root>
							<Card.Header class="pb-3">
								<Card.Title class="text-base">Liveness Status</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="flex items-center gap-2 mb-2">
									<Badge class={getStatusColor(verificationResult.isLive, verificationResult.confidence)}>
										{verificationResult.isLive ? 'Live' : 'Not Live'}
									</Badge>
								</div>
								<p class="text-2xl font-bold">
									{Math.round(verificationResult.confidence * 100)}%
								</p>
								<p class="text-sm text-muted-foreground">
									Confidence
								</p>
							</Card.Content>
						</Card.Root>
						
						<!-- Face Detection -->
						<Card.Root>
							<Card.Header class="pb-3">
								<Card.Title class="text-base">Face Detection</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="flex items-center gap-2 mb-2">
									<Badge class={verificationResult.faceDetected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
										{verificationResult.faceDetected ? 'Detected' : 'Not Detected'}
									</Badge>
								</div>
								<p class="text-sm text-muted-foreground">
									Face Count: {verificationResult.faceCount || 0}
								</p>
							</Card.Content>
						</Card.Root>
						
						<!-- Quality Score -->
						<Card.Root>
							<Card.Header class="pb-3">
								<Card.Title class="text-base">Image Quality</Card.Title>
							</Card.Header>
							<Card.Content>
								<p class="text-2xl font-bold">
									{verificationResult.quality ? Math.round(verificationResult.quality * 100) : 'N/A'}%
								</p>
								<p class="text-sm text-muted-foreground">
									Quality Score
								</p>
							</Card.Content>
						</Card.Root>
					</div>
					
					<!-- Additional Info -->
					<Card.Root class="mt-4">
						<Card.Header class="pb-3">
							<Card.Title class="text-base">Session Details</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="grid grid-cols-2 gap-4 text-sm">
								<div>
									<p class="font-medium">Last Update:</p>
									<p class="text-muted-foreground">
										{new Date(verificationResult.timestamp).toLocaleTimeString()}
									</p>
								</div>
								<div>
									<p class="font-medium">Processing Time:</p>
									<p class="text-muted-foreground">
										{verificationResult.processingTime || 'N/A'}ms
									</p>
								</div>
								<div>
									<p class="font-medium">Provider:</p>
									<p class="text-muted-foreground">
										{verificationResult.provider || 'AWS Rekognition'}
									</p>
								</div>
								<div>
									<p class="font-medium">Verification Status:</p>
									<p class="text-muted-foreground">
										{isVerifying ? 'Verifying...' : 'Ready'}
									</p>
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>

