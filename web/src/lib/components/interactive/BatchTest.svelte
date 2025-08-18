<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from '$lib/components/ui/badge';
	import { Progress } from '$lib/components/ui/progress';
	import { Separator } from '$lib/components/ui/separator';
	import { Play, Pause, Square, Download, Upload, RefreshCw, CheckCircle, XCircle, AlertCircle } from '@lucide/svelte';
	import ImageUpload from './ImageUpload.svelte';
	import type { FaceComparisonResult } from 'winter-authenticator';
	
	interface BatchTestResult {
		filename: string;
		file: File;
		result?: FaceComparisonResult;
		error?: string;
		status: 'pending' | 'processing' | 'completed' | 'failed';
		processingTime?: number;
	}
	
	interface Props {
		title?: string;
		description?: string;
	}
	
	let {
		title = "Batch Testing",
		description = "Test multiple images against a reference image for bulk verification"
	}: Props = $props();
	
	let referenceImage = $state<File | null>(null);
	let testImages = $state<File[]>([]);
	let batchResults = $state<BatchTestResult[]>([]);
	let isProcessing = $state(false);
	let isPaused = $state(false);
	let currentIndex = $state(0);
	let progress = $state(0);
	let startTime = $state(0);
	let completedCount = $state(0);
	let failedCount = $state(0);
	
	let processingController: AbortController | null = null;
	
	function handleReferenceUpload(files: File[]) {
		referenceImage = files[0] || null;
		resetBatch();
	}
	
	function handleTestImagesUpload(files: File[]) {
		testImages = files;
		batchResults = files.map(file => ({
			filename: file.name,
			file,
			status: 'pending' as const
		}));
		resetProgress();
	}
	
	function resetBatch() {
		batchResults = [];
		resetProgress();
	}
	
	function resetProgress() {
		currentIndex = 0;
		progress = 0;
		completedCount = 0;
		failedCount = 0;
		isProcessing = false;
		isPaused = false;
	}
	
	async function startBatchProcessing() {
		if (!referenceImage || testImages.length === 0) return;
		
		isProcessing = true;
		isPaused = false;
		startTime = Date.now();
		processingController = new AbortController();
		
		try {
			for (let i = currentIndex; i < batchResults.length; i++) {
				if (isPaused || processingController?.signal.aborted) break;
				
				currentIndex = i;
				const item = batchResults[i];
				
				// Update status to processing
				batchResults[i] = { ...item, status: 'processing' };
				
				try {
					const result = await processImage(item.file, processingController.signal);
					batchResults[i] = { 
						...item, 
						result, 
						status: 'completed',
						processingTime: Date.now() - startTime
					};
					completedCount++;
				} catch (error) {
					if (error instanceof Error && error.name === 'AbortError') {
						batchResults[i] = { ...item, status: 'pending' };
						break;
					}
					
					batchResults[i] = { 
						...item, 
						error: error instanceof Error ? error.message : 'Processing failed',
						status: 'failed'
					};
					failedCount++;
				}
				
				progress = Math.round(((i + 1) / batchResults.length) * 100);
				
				// Small delay to prevent overwhelming the API
				await new Promise(resolve => setTimeout(resolve, 100));
			}
		} finally {
			if (!isPaused) {
				isProcessing = false;
				currentIndex = 0;
			}
		}
	}
	
	async function processImage(file: File, signal: AbortSignal): Promise<FaceComparisonResult> {
		if (!referenceImage) throw new Error('No reference image');
		
		const formData = new FormData();
		formData.append('referenceImage', referenceImage);
		formData.append('comparisonImage', file);
		
		const response = await fetch('/api/winter-auth/batch-compare', {
			method: 'POST',
			body: formData,
			signal
		});
		
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		return await response.json();
	}
	
	function pauseProcessing() {
		isPaused = true;
		processingController?.abort();
	}
	
	function resumeProcessing() {
		isPaused = false;
		startBatchProcessing();
	}
	
	function stopProcessing() {
		processingController?.abort();
		isProcessing = false;
		isPaused = false;
		currentIndex = 0;
	}
	
	function exportResults() {
		const results = batchResults.map(item => ({
			filename: item.filename,
			status: item.status,
			isMatch: item.result?.isMatch,
			confidence: item.result?.confidence,
			referenceQuality: item.result?.referenceQuality,
			comparisonQuality: item.result?.comparisonQuality,
			processingTime: item.processingTime,
			error: item.error
		}));
		
		const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `batch-test-results-${new Date().toISOString().split('T')[0]}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}
	
	function getStatusIcon(status: string) {
		switch (status) {
			case 'completed': return CheckCircle;
			case 'failed': return XCircle;
			case 'processing': return RefreshCw;
			default: return AlertCircle;
		}
	}
	
	function getStatusColor(status: string): string {
		switch (status) {
			case 'completed': return 'bg-green-100 text-green-800 border-green-200';
			case 'failed': return 'bg-red-100 text-red-800 border-red-200';
			case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
			default: return 'bg-gray-100 text-gray-800 border-gray-200';
		}
	}
	
	function getMatchColor(result?: FaceComparisonResult): string {
		if (!result) return 'bg-gray-100 text-gray-800 border-gray-200';
		if (result.isMatch) return 'bg-green-100 text-green-800 border-green-200';
		return 'bg-red-100 text-red-800 border-red-200';
	}
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-6">
		<!-- Reference Image Upload -->
		<div>
			<ImageUpload
				label="Reference Image"
				onUpload={handleReferenceUpload}
				disabled={isProcessing}
			/>
		</div>
		
		<!-- Test Images Upload -->
		<div>
			<ImageUpload
				label="Test Images"
				multiple={true}
				maxFiles={50}
				onUpload={handleTestImagesUpload}
				disabled={isProcessing}
			/>
		</div>
		
		<!-- Batch Processing Controls -->
		{#if testImages.length > 0 && referenceImage}
			<div class="space-y-4">
				<Separator />
				
				<!-- Progress Overview -->
				<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
					<Card.Root>
						<Card.Header class="pb-3">
							<Card.Title class="text-base">Total Images</Card.Title>
						</Card.Header>
						<Card.Content>
							<p class="text-2xl font-bold">{testImages.length}</p>
						</Card.Content>
					</Card.Root>
					
					<Card.Root>
						<Card.Header class="pb-3">
							<Card.Title class="text-base">Completed</Card.Title>
						</Card.Header>
						<Card.Content>
							<p class="text-2xl font-bold text-green-600">{completedCount}</p>
						</Card.Content>
					</Card.Root>
					
					<Card.Root>
						<Card.Header class="pb-3">
							<Card.Title class="text-base">Failed</Card.Title>
						</Card.Header>
						<Card.Content>
							<p class="text-2xl font-bold text-red-600">{failedCount}</p>
						</Card.Content>
					</Card.Root>
					
					<Card.Root>
						<Card.Header class="pb-3">
							<Card.Title class="text-base">Progress</Card.Title>
						</Card.Header>
						<Card.Content>
							<p class="text-2xl font-bold">{progress}%</p>
						</Card.Content>
					</Card.Root>
				</div>
				
				<!-- Progress Bar -->
				<div class="space-y-2">
					<div class="flex justify-between text-sm">
						<span>Processing Progress</span>
						<span>{completedCount + failedCount} / {testImages.length}</span>
					</div>
					<Progress value={progress} class="h-2" />
				</div>
				
				<!-- Control Buttons -->
				<div class="flex gap-3">
					{#if !isProcessing && !isPaused}
						<Button onclick={startBatchProcessing} class="flex-1">
							<Play class="h-4 w-4 mr-2" />
							Start Batch Processing
						</Button>
					{:else if isProcessing && !isPaused}
						<Button onclick={pauseProcessing} variant="outline" class="flex-1">
							<Pause class="h-4 w-4 mr-2" />
							Pause Processing
						</Button>
					{:else if isPaused}
						<Button onclick={resumeProcessing} class="flex-1">
							<Play class="h-4 w-4 mr-2" />
							Resume Processing
						</Button>
					{/if}
					
					<Button onclick={stopProcessing} variant="destructive" disabled={!isProcessing && !isPaused}>
						<Square class="h-4 w-4 mr-2" />
						Stop
					</Button>
					
					<Button onclick={exportResults} variant="outline" disabled={completedCount === 0}>
						<Download class="h-4 w-4 mr-2" />
						Export Results
					</Button>
				</div>
			</div>
		{/if}
		
		<!-- Results Table -->
		{#if batchResults.length > 0}
			<div class="space-y-4">
				<Separator />
				<div>
					<h3 class="text-lg font-semibold mb-4">Batch Results</h3>
					
					<div class="space-y-2 max-h-96 overflow-y-auto">
						{#each batchResults as result, index}
							<Card.Root class="p-4">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-3">
										{@const IconComponent = getStatusIcon(result.status)}
										<div class={`p-1 rounded ${result.status === 'processing' ? 'animate-spin' : ''}`}>
											<IconComponent class="h-4 w-4" />
										</div>
										<div>
											<p class="font-medium text-sm">{result.filename}</p>
											<p class="text-xs text-muted-foreground">
												{result.processingTime ? `${result.processingTime}ms` : ''}
											</p>
										</div>
									</div>
									
									<div class="flex items-center gap-2">
										<Badge class={getStatusColor(result.status)}>
											{result.status}
										</Badge>
										
										{#if result.result}
											<Badge class={getMatchColor(result.result)}>
												{result.result.isMatch ? 'Match' : 'No Match'}
											</Badge>
											<span class="text-sm font-medium">
												{Math.round(result.result.confidence * 100)}%
											</span>
										{/if}
										
										{#if result.error}
											<span class="text-sm text-destructive">{result.error}</span>
										{/if}
									</div>
								</div>
							</Card.Root>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>

