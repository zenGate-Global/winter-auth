<script lang="ts">
	import { extractGPSOnly } from '@zengate/winter-auth';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from '$lib/components/ui/button';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Badge } from '$lib/components/ui/badge';
	import { MapPin, Upload, CheckCircle, XCircle, Copy, Clock, ExternalLink } from '@lucide/svelte';
	import CodeBlock from '$lib/components/ui/code-block/CodeBlock.svelte';
	
	let fileInput: HTMLInputElement;
	let isLoading = $state(false);
	let result: { gps: any; hasGPS: boolean } | null = $state(null);
	let error: string | null = $state(null);
	let selectedFile: File | null = $state(null);
	let processingTime = $state<number>(0);

	async function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			selectedFile = target.files[0];
			await extractGPS(target.files[0]);
		}
		// Reset input to allow selecting the same file again
		target.value = '';
	}

	async function extractGPS(file: File) {
		if (!file) return;
		
		isLoading = true;
		error = null;
		result = null;
		
		const startTime = performance.now();
		
		try {
			// Use the actual GPS-only extraction API
			const gpsResult = await extractGPSOnly(file);
			result = gpsResult;
			processingTime = Math.round(performance.now() - startTime);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to extract GPS data';
			processingTime = Math.round(performance.now() - startTime);
		} finally {
			isLoading = false;
		}
	}

	function triggerFileSelect() {
		// Clear previous results first
		result = null;
		error = null;
		selectedFile = null;
		processingTime = 0;
		
		fileInput?.click();
	}

	function copyToClipboard() {
		const codeExample = generateCodeExample();
		navigator.clipboard.writeText(codeExample);
	}

	function generateCodeExample() {
		if (!result) return '';
		
		return `import { extractGPSOnly } from '@zengate/winter-auth';

const { gps, hasGPS } = await extractGPSOnly(imageFile);

if (hasGPS && gps) {
  console.log('GPS:', gps.latitude, gps.longitude);
  // Use with your map component
} else {
  console.log('No GPS data');
}`;
	}

</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title class="flex items-center gap-2">
			<MapPin class="h-5 w-5" />
			extractGPSOnly() Demo
		</Card.Title>
		<Card.Description>
			Fast GPS-only extraction - optimal performance when you only need location data
		</Card.Description>
	</Card.Header>
	
	<Card.Content class="space-y-6">
		<!-- File Upload -->
		<div class="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
			<input
				bind:this={fileInput}
				type="file"
				accept="image/*"
				onchange={handleFileSelect}
				class="hidden"
			/>
			
			{#if selectedFile}
				<div class="space-y-2">
					<CheckCircle class="h-8 w-8 text-green-600 mx-auto" />
					<p class="text-sm font-medium">{selectedFile.name}</p>
					<p class="text-xs text-gray-500">{Math.round(selectedFile.size / 1024)} KB</p>
					<Button onclick={triggerFileSelect} variant="outline" size="sm">
						Choose New Image
					</Button>
				</div>
			{:else}
				<div class="space-y-4">
					<Upload class="h-12 w-12 text-muted-foreground mx-auto" />
					<div>
						<Button onclick={triggerFileSelect} variant="outline">
							Choose Image File
						</Button>
						<p class="text-xs text-muted-foreground mt-2">Extract GPS coordinates</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Loading State -->
		{#if isLoading}
			<div class="flex items-center justify-center py-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				<span class="ml-3 text-muted-foreground">Extracting GPS...</span>
			</div>
		{/if}

		<!-- Error State -->
		{#if error}
			<Alert variant="destructive">
				<XCircle class="h-4 w-4" />
				<AlertDescription>{error}</AlertDescription>
			</Alert>
		{/if}

		<!-- Results -->
		{#if result && !isLoading}
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						{#if result.hasGPS}
							<CheckCircle class="h-5 w-5 text-green-600" />
							<span class="font-medium text-green-800">GPS coordinates found</span>
						{:else}
							<XCircle class="h-5 w-5 text-orange-600" />
							<span class="font-medium text-orange-800">No GPS data found</span>
						{/if}
					</div>
					<div class="flex items-center gap-2">
						{#if processingTime}
							<Clock class="h-4 w-4 text-gray-500" />
							<span class="text-xs text-gray-500">{processingTime}ms</span>
						{/if}
						<Badge variant="outline" class="text-xs bg-green-50 border-green-300">
							GPS Only
						</Badge>
					</div>
				</div>

				{#if result.hasGPS && result.gps}
					<!-- GPS Information Card -->
					<Card.Root class="border-2 border-green-500/30 bg-green-50/50 dark:bg-green-900/10 dark:border-green-500/30">
						<Card.Header class="pb-3">
							<Card.Title class="text-lg flex items-center gap-2">
								<MapPin class="h-5 w-5 text-green-600" />
								Location Data
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
								<div class="flex justify-between">
									<span class="font-medium">Latitude:</span>
									<span class="font-mono">{result.gps.latitude.toFixed(6)}°</span>
								</div>
								<div class="flex justify-between">
									<span class="font-medium">Longitude:</span>
									<span class="font-mono">{result.gps.longitude.toFixed(6)}°</span>
								</div>
								{#if result.gps.altitude}
									<div class="flex justify-between">
										<span class="font-medium">Altitude:</span>
										<span class="font-mono">{result.gps.altitude}m</span>
									</div>
								{/if}
								{#if result.gps.latitudeRef || result.gps.longitudeRef}
									<div class="flex justify-between">
										<span class="font-medium">Reference:</span>
										<span class="font-mono">{result.gps.latitudeRef}{result.gps.longitudeRef}</span>
									</div>
								{/if}
							</div>
							
							<!-- Coordinate Copy Button -->
							<div class="mt-4 p-3 bg-muted border rounded-lg">
								<div class="flex items-center justify-between">
									<code class="text-sm">{result.gps.latitude.toFixed(4)}, {result.gps.longitude.toFixed(4)}</code>
									<Button 
										onclick={() => window.open(`https://maps.google.com/?q=${result.gps.latitude},${result.gps.longitude}`, '_blank')}
										variant="outline" 
										size="sm"
										class="flex items-center gap-1"
									>
										<ExternalLink class="h-3 w-3" />
										Maps
									</Button>
								</div>
							</div>
						</Card.Content>
					</Card.Root>
				{:else}
					<!-- No GPS Found -->
					<Card.Root class="border-2 border-muted">
						<Card.Content class="text-center py-4">
							<p class="text-sm text-muted-foreground">No GPS data</p>
						</Card.Content>
					</Card.Root>
				{/if}

				<!-- Performance Info -->
				<div class="bg-muted/50 border rounded-lg p-4">
					<div class="flex items-center justify-between text-sm">
						<div class="flex items-center gap-2">
							<Clock class="h-4 w-4 text-primary" />
							<span class="font-medium text-foreground">Processing Time: {processingTime}ms</span>
						</div>
						<Badge variant="secondary" class="text-xs">
							3-5x faster than full extraction
						</Badge>
					</div>
					<p class="text-xs text-muted-foreground mt-2">
						💡 This method only extracts GPS data, making it much faster than full metadata extraction.
					</p>
				</div>
			</div>
		{/if}

		<!-- Generated Code Example -->
		{#if result}
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
				<strong>🚀 Performance Tip:</strong> Use this method when you only need GPS coordinates. 
				It's 3-5x faster than full metadata extraction and perfect for location-based features.
			</p>
		</div>
	</Card.Content>
</Card.Root>