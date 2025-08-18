<script lang="ts">
	import { hasGPSData } from '@zengate/winter-auth';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from '$lib/components/ui/button';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Badge } from '$lib/components/ui/badge';
	import { Zap, Upload, CheckCircle, XCircle, Copy, Clock, FileText } from '@lucide/svelte';
	import CodeBlock from '$lib/components/ui/code-block/CodeBlock.svelte';
	
	let fileInput: HTMLInputElement;
	let isLoading = $state(false);
	let result: boolean | null = $state(null);
	let error: string | null = $state(null);
	let selectedFiles: File[] = $state([]);
	let processingTime = $state<number>(0);
	let batchResults: Array<{fileName: string, hasGPS: boolean, time: number}> = $state([]);

	async function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files) {
			selectedFiles = Array.from(target.files);
			await checkGPSBatch(Array.from(target.files));
		}
		// Reset input to allow selecting the same files again
		target.value = '';
	}

	async function checkGPSBatch(files: File[]) {
		if (!files.length) return;
		
		isLoading = true;
		error = null;
		result = null;
		batchResults = [];
		
		const startTime = performance.now();
		
		try {
			if (files.length === 1) {
				// Single file
				const hasGPS = await hasGPSData(files[0]);
				result = hasGPS;
				processingTime = Math.round(performance.now() - startTime);
			} else {
				// Batch processing
				const results = await Promise.all(
					files.map(async (file) => {
						const fileStartTime = performance.now();
						const hasGPS = await hasGPSData(file);
						const fileTime = Math.round(performance.now() - fileStartTime);
						return {
							fileName: file.name,
							hasGPS,
							time: fileTime
						};
					})
				);
				batchResults = results;
				processingTime = Math.round(performance.now() - startTime);
			}
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to check GPS data';
			processingTime = Math.round(performance.now() - startTime);
		} finally {
			isLoading = false;
		}
	}

	function triggerFileSelect() {
		// Clear previous results first
		result = null;
		error = null;
		selectedFiles = [];
		processingTime = 0;
		batchResults = [];
		
		fileInput?.click();
	}

	function copyToClipboard() {
		const codeExample = generateCodeExample();
		navigator.clipboard.writeText(codeExample);
	}

	function generateCodeExample() {
		if (selectedFiles.length === 1) {
			return `import { hasGPSData } from '@zengate/winter-auth';

const hasGPS = await hasGPSData(imageFile);

if (hasGPS) {
  console.log('GPS available');
  // Enable location features
} else {
  console.log('No GPS');
}`;
		} else {
			return `import { hasGPSData } from '@zengate/winter-auth';

const checks = await Promise.all(
  files.map(file => hasGPSData(file))
);

const withGPS = checks.filter(Boolean).length;
console.log(\`\${withGPS}/\${files.length} images have GPS\`);
`;
		}
	}

	const totalWithGPS = $derived(batchResults.filter(r => r.hasGPS).length);
	const gpsPercentage = $derived(batchResults.length ? Math.round((totalWithGPS / batchResults.length) * 100) : 0);

</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title class="flex items-center gap-2">
			<Zap class="h-5 w-5" />
			hasGPSData() Demo
		</Card.Title>
		<Card.Description>
			Ultra-fast GPS availability check - perfect for pre-filtering and batch analysis
		</Card.Description>
	</Card.Header>
	
	<Card.Content class="space-y-6">
		<!-- File Upload -->
		<div class="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
			<input
				bind:this={fileInput}
				type="file"
				accept="image/*"
				multiple
				onchange={handleFileSelect}
				class="hidden"
			/>
			
			{#if selectedFiles.length > 0}
				<div class="space-y-2">
					<CheckCircle class="h-8 w-8 text-green-600 mx-auto" />
					<p class="text-sm font-medium">
						{selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
					</p>
					<div class="flex flex-wrap justify-center gap-2 mt-3">
						{#each selectedFiles.slice(0, 3) as file}
							<Badge variant="outline" class="text-xs">{file.name}</Badge>
						{/each}
						{#if selectedFiles.length > 3}
							<Badge variant="secondary" class="text-xs">+{selectedFiles.length - 3} more</Badge>
						{/if}
					</div>
					<Button onclick={triggerFileSelect} variant="outline" size="sm">
						Choose New Images
					</Button>
				</div>
			{:else}
				<div class="space-y-4">
					<Upload class="h-12 w-12 text-muted-foreground mx-auto" />
					<div>
						<Button onclick={triggerFileSelect} variant="outline">
							Choose Image Files
						</Button>
						<p class="text-xs text-muted-foreground mt-2">
							Check GPS availability
						</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Loading State -->
		{#if isLoading}
			<div class="flex items-center justify-center py-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				<span class="ml-3 text-muted-foreground">
					{selectedFiles.length === 1 ? 'Checking GPS...' : `Analyzing ${selectedFiles.length} images...`}
				</span>
			</div>
		{/if}

		<!-- Error State -->
		{#if error}
			<Alert variant="destructive">
				<XCircle class="h-4 w-4" />
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		{/if}

		<!-- Single File Result -->
		{#if result !== null && selectedFiles.length === 1 && !isLoading}
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						{#if result}
							<CheckCircle class="h-5 w-5 text-green-600" />
							<span class="font-medium text-green-800">GPS data available</span>
						{:else}
							<XCircle class="h-5 w-5 text-orange-600" />
							<span class="font-medium text-orange-800">No GPS data found</span>
						{/if}
					</div>
					<div class="flex items-center gap-2">
						<Clock class="h-4 w-4 text-muted-foreground" />
						<span class="text-xs text-muted-foreground">{processingTime}ms</span>
					</div>
				</div>

				<Card.Root class="border">
					<Card.Content class="text-center py-4">
						{#if result}
							<CheckCircle class="h-6 w-6 text-green-600 mx-auto mb-2" />
							<p class="text-sm text-foreground">GPS Available</p>
						{:else}
							<XCircle class="h-6 w-6 text-muted-foreground mx-auto mb-2" />
							<p class="text-sm text-muted-foreground">No GPS</p>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>
		{/if}

		<!-- Batch Results -->
		{#if batchResults.length > 1 && !isLoading}
			<div class="space-y-4">
				<!-- Summary -->
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<FileText class="h-5 w-5 text-purple-600" />
						<span class="font-medium">Batch Analysis Complete</span>
					</div>
					<div class="flex items-center gap-2">
						<Clock class="h-4 w-4 text-muted-foreground" />
						<span class="text-xs text-muted-foreground">{processingTime}ms total</span>
					</div>
				</div>

				<!-- Statistics -->
				<Card.Root class="border-2">
					<Card.Header class="pb-3">
						<Card.Title class="text-lg flex items-center gap-2">
							<Zap class="h-5 w-5 text-purple-600" />
							Analysis Results
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
							<div class="bg-card border rounded p-4">
								<div class="text-2xl font-bold text-primary">{batchResults.length}</div>
								<div class="text-xs text-muted-foreground">Images Analyzed</div>
							</div>
							<div class="bg-card border rounded p-4">
								<div class="text-2xl font-bold text-green-600">{totalWithGPS}</div>
								<div class="text-xs text-muted-foreground">With GPS Data</div>
							</div>
							<div class="bg-card border rounded p-4">
								<div class="text-2xl font-bold text-blue-600">{gpsPercentage}%</div>
								<div class="text-xs text-muted-foreground">GPS Coverage</div>
							</div>
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Detailed Results -->
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-lg">File-by-File Results</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="max-h-64 overflow-y-auto space-y-2">
							{#each batchResults as result}
								<div class="flex items-center justify-between p-3 bg-muted rounded-lg">
									<div class="flex items-center gap-3">
										{#if result.hasGPS}
											<CheckCircle class="h-4 w-4 text-green-500" />
										{:else}
											<XCircle class="h-4 w-4 text-muted-foreground" />
										{/if}
										<span class="text-sm truncate max-w-48">{result.fileName}</span>
									</div>
									<div class="flex items-center gap-2">
										<Badge variant={result.hasGPS ? "default" : "secondary"} class="text-xs">
											{result.hasGPS ? "GPS" : "No GPS"}
										</Badge>
										<span class="text-xs text-muted-foreground">{result.time}ms</span>
									</div>
								</div>
							{/each}
						</div>
					</Card.Content>
				</Card.Root>

				<!-- Performance Stats -->
				<div class="bg-muted border rounded-lg p-4">
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
						<div class="text-center">
							<div class="font-semibold text-foreground">Total Time</div>
							<div class="text-primary">{processingTime}ms</div>
						</div>
						<div class="text-center">
							<div class="font-semibold text-foreground">Average per File</div>
							<div class="text-primary">{Math.round(processingTime / batchResults.length)}ms</div>
						</div>
						<div class="text-center">
							<div class="font-semibold text-foreground">Processing Rate</div>
							<div class="text-primary">{Math.round(batchResults.length / (processingTime / 1000))} files/sec</div>
						</div>
					</div>
				</div>
			</div>
		{/if}

		<!-- Generated Code Example -->
		{#if (result !== null || batchResults.length > 0)}
			<Card.Root class="bg-muted/50">
				<Card.Header>
					<div class="flex items-center justify-between">
						<Card.Title class="text-lg">Generated Code Example</Card.Title>
						<Button 
							onclick={copyToClipboard} 
							variant="outline" 
							size="sm"
							class="flex items-center gap-2"
						>
							<Copy class="h-4 w-4" />
							Copy
						</Button>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="max-h-64 overflow-y-auto">
						<CodeBlock code={generateCodeExample()} language="typescript" showCopyButton={false} />
					</div>
				</Card.Content>
			</Card.Root>
		{/if}

		<!-- Help Text -->
		<div class="bg-muted border rounded-lg p-4">
			<p class="text-sm text-muted-foreground">
				<strong>⚡ Ultra-Fast:</strong> This method is 10-20x faster than coordinate extraction because it only checks for GPS tag presence without parsing values. Perfect for pre-filtering large image collections!
			</p>
		</div>
	</Card.Content>
</Card.Root>