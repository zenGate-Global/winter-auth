<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import { Play, RefreshCw, CheckCircle, XCircle, AlertCircle } from '@lucide/svelte';
	import ImageUpload from './ImageUpload.svelte';
	import type { FaceComparisonResult } from 'winter-authenticator';
	
	interface Props {
		title?: string;
		description?: string;
	}
	
	let {
		title = "Image-to-Image Comparison",
		description = "Compare two face images to verify if they belong to the same person"
	}: Props = $props();
	
	let referenceImage = $state<File | null>(null);
	let comparisonImage = $state<File | null>(null);
	let isComparing = $state(false);
	let result = $state<FaceComparisonResult | null>(null);
	let error = $state<string | null>(null);
	
	function handleReferenceUpload(files: File[]) {
		referenceImage = files[0] || null;
		result = null;
		error = null;
	}
	
	function handleComparisonUpload(files: File[]) {
		comparisonImage = files[0] || null;
		result = null;
		error = null;
	}
	
	async function performComparison() {
		if (!referenceImage || !comparisonImage) return;
		
		isComparing = true;
		error = null;
		
		try {
			// This would be replaced with actual Winter Authenticator API call
			const response = await fetch('/api/winter-auth/compare', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					referenceImage: await fileToBase64(referenceImage),
					comparisonImage: await fileToBase64(comparisonImage)
				})
			});
			
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			
			result = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred during comparison';
		} finally {
			isComparing = false;
		}
	}
	
	function reset() {
		referenceImage = null;
		comparisonImage = null;
		result = null;
		error = null;
	}
	
	function fileToBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = error => reject(error);
		});
	}
	
	function getMatchStatusColor(confidence: number): string {
		if (confidence >= 0.8) return 'bg-green-100 text-green-800 border-green-200';
		if (confidence >= 0.6) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
		return 'bg-red-100 text-red-800 border-red-200';
	}
	
	function getMatchStatusIcon(confidence: number) {
		if (confidence >= 0.8) return CheckCircle;
		if (confidence >= 0.6) return AlertCircle;
		return XCircle;
	}
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title>{title}</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-6">
		<!-- Image Upload Section -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div>
				<ImageUpload
					label="Reference Image"
					onUpload={handleReferenceUpload}
					disabled={isComparing}
				/>
			</div>
			<div>
				<ImageUpload
					label="Comparison Image"
					onUpload={handleComparisonUpload}
					disabled={isComparing}
				/>
			</div>
		</div>
		
		<!-- Action Buttons -->
		<div class="flex gap-3">
			<Button
				onclick={performComparison}
				disabled={!referenceImage || !comparisonImage || isComparing}
				class="flex-1"
			>
				{#if isComparing}
					<RefreshCw class="h-4 w-4 mr-2 animate-spin" />
					Comparing...
				{:else}
					<Play class="h-4 w-4 mr-2" />
					Compare Images
				{/if}
			</Button>
			<Button variant="outline" onclick={reset} disabled={isComparing}>
				Reset
			</Button>
		</div>
		
		<!-- Results Section -->
		{#if result}
			<div class="space-y-4">
				<Separator />
				<div>
					<h3 class="text-lg font-semibold mb-4">Comparison Results</h3>
					
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<!-- Overall Match -->
						<Card.Root>
							<Card.Header class="pb-3">
								<Card.Title class="text-base">Overall Match</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="flex items-center gap-2 mb-2">
									{@const IconComponent = getMatchStatusIcon(result.confidence)}
									<IconComponent class="h-5 w-5" />
									<Badge class={getMatchStatusColor(result.confidence)}>
										{result.isMatch ? 'Match' : 'No Match'}
									</Badge>
								</div>
								<p class="text-2xl font-bold">
									{Math.round(result.confidence * 100)}%
								</p>
								<p class="text-sm text-muted-foreground">
									Confidence Level
								</p>
							</Card.Content>
						</Card.Root>
						
						<!-- Face Quality -->
						<Card.Root>
							<Card.Header class="pb-3">
								<Card.Title class="text-base">Face Quality</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="space-y-2">
									<div class="flex justify-between">
										<span class="text-sm">Reference</span>
										<span class="text-sm font-medium">
											{result.referenceQuality ? Math.round(result.referenceQuality * 100) : 'N/A'}%
										</span>
									</div>
									<div class="flex justify-between">
										<span class="text-sm">Comparison</span>
										<span class="text-sm font-medium">
											{result.comparisonQuality ? Math.round(result.comparisonQuality * 100) : 'N/A'}%
										</span>
									</div>
								</div>
							</Card.Content>
						</Card.Root>
					</div>
					
					<!-- Detailed Results -->
					{#if result.details}
						<Card.Root>
							<Card.Header class="pb-3">
								<Card.Title class="text-base">Detailed Analysis</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="grid grid-cols-2 gap-4 text-sm">
									<div>
										<p class="font-medium">Processing Time:</p>
										<p class="text-muted-foreground">{result.processingTime}ms</p>
									</div>
									<div>
										<p class="font-medium">Algorithm:</p>
										<p class="text-muted-foreground">{result.algorithm || 'Default'}</p>
									</div>
									<div>
										<p class="font-medium">Faces Detected:</p>
										<p class="text-muted-foreground">
											{result.referenceFaceCount || 1} / {result.comparisonFaceCount || 1}
										</p>
									</div>
									<div>
										<p class="font-medium">Provider:</p>
										<p class="text-muted-foreground">{result.provider || 'AWS Rekognition'}</p>
									</div>
								</div>
							</Card.Content>
						</Card.Root>
					{/if}
				</div>
			</div>
		{/if}
		
		<!-- Error Display -->
		{#if error}
			<div class="space-y-4">
				<Separator />
				<Card.Root class="border-destructive">
					<Card.Header class="pb-3">
						<Card.Title class="text-base text-destructive flex items-center gap-2">
							<XCircle class="h-5 w-5" />
							Comparison Failed
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-sm text-muted-foreground">{error}</p>
					</Card.Content>
				</Card.Root>
			</div>
		{/if}
	</Card.Content>
</Card.Root>

