<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from '$lib/components/ui/badge';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Progress } from '$lib/components/ui/progress';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Upload, CheckCircle, XCircle, AlertCircle, Users, Shield } from '@lucide/svelte';
	import { createWinterAuth } from '@zengate/winter-auth';
	
	interface Props {
		title?: string;
		description?: string;
	}
	
	let {
		title = "Compare Images",
		description = "Upload two images to compare if they contain the same person"
	}: Props = $props();
	
	let referenceInput: HTMLInputElement;
	let targetInput: HTMLInputElement;
	let isProcessing = $state(false);
	let result = $state<any>(null);
	let error = $state<string | null>(null);
	let processingTime = $state<number>(0);
	let winterAuth = $state<any>(null);
	let securityLevel = $state<string>('MEDIUM');
	
	let referenceFile = $state<File | null>(null);
	let targetFile = $state<File | null>(null);
	let referencePreview = $state<string | null>(null);
	let targetPreview = $state<string | null>(null);
	
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
		
		if (targetFile) {
			await compareImages();
		}
	}
	
	async function handleTargetFile(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		
		if (!file) return;
		
		if (!file.type.startsWith('image/')) {
			error = 'Please select a valid image file';
			return;
		}
		
		targetFile = file;
		targetPreview = URL.createObjectURL(file);
		error = null;
		
		if (referenceFile) {
			await compareImages();
		}
	}
	
	async function compareImages() {
		if (!referenceFile || !targetFile) return;
		
		isProcessing = true;
		error = null;
		result = null;
		
		const startTime = Date.now();
		
		try {
			await initializeWinterAuth();
			
			const comparisonResult = await winterAuth.compareByImage(
				referenceFile,
				targetFile,
				{ securityLevel }
			);
			
			processingTime = Date.now() - startTime;
			result = comparisonResult;
			
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
			console.error('Image comparison failed:', err);
		} finally {
			isProcessing = false;
		}
	}
	
	function getMatchColor(isMatch: boolean): string {
		return isMatch ? 'text-green-600' : 'text-red-600';
	}
	
	function getMatchIcon(isMatch: boolean) {
		return isMatch ? CheckCircle : XCircle;
	}
	
	function getSecurityLevelText(level: string): string {
		const levels = {
			LOW: 'Low (70% threshold)',
			MEDIUM: 'Medium (80% threshold)',
			HIGH: 'High (90% threshold)',
			MAXIMUM: 'Maximum (95% threshold)'
		};
		return levels[level as keyof typeof levels] || level;
	}
	
	function resetDemo() {
		result = null;
		error = null;
		processingTime = 0;
		referenceFile = null;
		targetFile = null;
		referencePreview = null;
		targetPreview = null;
		if (referenceInput) referenceInput.value = '';
		if (targetInput) targetInput.value = '';
	}
	
	async function handleSecurityChange(value: string) {
		securityLevel = value;
		if (referenceFile && targetFile) {
			await compareImages();
		}
	}
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title class="flex items-center gap-2">
			<Users class="h-5 w-5" />
			{title}
		</Card.Title>
		<Card.Description>{description}</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-6">
		<!-- Security Level Selection -->
		<div class="space-y-2">
			<label class="text-sm font-medium">Security Level</label>
			<Select.Root bind:value={securityLevel}>
				<Select.Trigger>
					{securityLevel === 'LOW' ? 'Low (70% threshold)' : 
					 securityLevel === 'MEDIUM' ? 'Medium (80% threshold)' : 
					 securityLevel === 'HIGH' ? 'High (90% threshold)' : 
					 securityLevel === 'MAXIMUM' ? 'Maximum (95% threshold)' : 
					 'Select security level'}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="LOW">Low (70% threshold)</Select.Item>
					<Select.Item value="MEDIUM">Medium (80% threshold)</Select.Item>
					<Select.Item value="HIGH">High (90% threshold)</Select.Item>
					<Select.Item value="MAXIMUM">Maximum (95% threshold)</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
		
		<!-- File Upload Section -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<!-- Reference Image -->
			<div class="space-y-2">
				<label class="text-sm font-medium">Reference Image</label>
				<div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
					<input
						bind:this={referenceInput}
						type="file"
						accept="image/*"
						onchange={handleReferenceFile}
						class="hidden"
					/>
					{#if referencePreview}
						<img src={referencePreview} alt="Reference" class="mx-auto h-32 w-32 object-cover rounded mb-2" />
					{:else}
						<Upload class="mx-auto h-12 w-12 text-gray-400 mb-2" />
					{/if}
					<Button size="sm" onclick={() => referenceInput?.click()} disabled={isProcessing}>
						{referenceFile ? 'Change Image' : 'Select Reference'}
					</Button>
				</div>
			</div>
			
			<!-- Target Image -->
			<div class="space-y-2">
				<label class="text-sm font-medium">Target Image</label>
				<div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
					<input
						bind:this={targetInput}
						type="file"
						accept="image/*"
						onchange={handleTargetFile}
						class="hidden"
					/>
					{#if targetPreview}
						<img src={targetPreview} alt="Target" class="mx-auto h-32 w-32 object-cover rounded mb-2" />
					{:else}
						<Upload class="mx-auto h-12 w-12 text-gray-400 mb-2" />
					{/if}
					<Button size="sm" onclick={() => targetInput?.click()} disabled={isProcessing}>
						{targetFile ? 'Change Image' : 'Select Target'}
					</Button>
				</div>
			</div>
		</div>
		
		{#if isProcessing}
			<div class="space-y-2">
				<div class="flex items-center justify-between text-sm">
					<span>Comparing faces...</span>
					<span>Please wait</span>
				</div>
				<Progress value={undefined} class="h-2" />
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
					<h3 class="text-lg font-semibold">Comparison Results</h3>
					<div class="flex items-center gap-2">
						{#if result.isMatch}
							<CheckCircle class="h-5 w-5 text-green-600" />
						{:else}
							<XCircle class="h-5 w-5 text-red-600" />
						{/if}
						<Badge variant={result.isMatch ? 'default' : 'destructive'}>
							{result.isMatch ? 'Match' : 'No Match'}
						</Badge>
					</div>
				</div>
				
				<!-- Similarity Score -->
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-base">Similarity Score</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="text-3xl font-bold {getMatchColor(result.isMatch)} mb-2">
							{result.similarityPercent}%
						</div>
						<Progress value={result.similarityPercent} class="h-2" />
						<p class="text-sm text-gray-600 mt-2">
							Threshold: {Math.round(result.comparisonResult.threshold * 100)}% ({securityLevel})
						</p>
					</Card.Content>
				</Card.Root>
				
				<!-- Comparison Details -->
				<Card.Root>
					<Card.Header class="pb-3">
						<Card.Title class="text-base">Analysis Details</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span class="font-medium">Confidence:</span>
								<span class="ml-2">{Math.round(result.confidence * 100)}%</span>
							</div>
							<div>
								<span class="font-medium">Verified:</span>
								<span class="ml-2">{result.verified ? 'Yes' : 'No'}</span>
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
				
				<!-- Quality Information -->
				{#if result.qualityResult}
					<Card.Root>
						<Card.Header class="pb-3">
							<Card.Title class="text-base">Image Quality</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="flex items-center gap-2 mb-2">
								<Badge variant={result.qualityResult.isGoodQuality ? 'default' : 'secondary'}>
									Quality Score: {result.qualityResult.score}/100
								</Badge>
								<Badge variant={result.qualityResult.isGoodQuality ? 'default' : 'destructive'}>
									{result.qualityResult.isGoodQuality ? 'Good' : 'Poor'}
								</Badge>
							</div>
							{#if result.qualityResult.issues.length > 0}
								<div class="text-sm text-red-600">
									Issues: {result.qualityResult.issues.map(i => i.code).join(', ')}
								</div>
							{/if}
						</Card.Content>
					</Card.Root>
				{/if}
				
				<!-- Actions -->
				<div class="flex gap-2">
					<Button variant="outline" onclick={resetDemo}>
						Test New Images
					</Button>
					<Button variant="outline" onclick={() => compareImages()}>
						Compare Again
					</Button>
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>

