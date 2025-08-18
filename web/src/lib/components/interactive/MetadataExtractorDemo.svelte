<script lang="ts">
	import { extractImageMetadata } from '@zengate/winter-auth';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from '$lib/components/ui/button';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Badge } from '$lib/components/ui/badge';
	import { MapPin, Camera, Clock, FileImage, Upload, CheckCircle, XCircle, Copy, ExternalLink } from '@lucide/svelte';
	import CodeBlock from '$lib/components/ui/code-block/CodeBlock.svelte';
	import type { MetadataExtractionResult } from '@zengate/winter-auth';
	
	let fileInput: HTMLInputElement;
	let isLoading = $state(false);
	let result: MetadataExtractionResult | null = $state(null);
	let error: string | null = $state(null);
	let selectedFile: File | null = $state(null);

	async function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			// Clear previous results first
			result = null;
			error = null;
			
			selectedFile = target.files[0];
			await extractMetadata(target.files[0]);
		}
		// Reset input to allow selecting the same file again
		target.value = '';
	}

	async function extractMetadata(file: File) {
		if (!file) return;
		
		isLoading = true;
		error = null;
		result = null;
		
		try {
			// Use the actual metadata extraction API
			const metadataResult = await extractImageMetadata(file, {
				includeRawExif: false,
				validateGPS: true
			});
			result = metadataResult;
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to extract metadata';
		} finally {
			isLoading = false;
		}
	}

	function triggerFileSelect() {
		// Clear previous results first
		result = null;
		error = null;
		selectedFile = null;
		
		fileInput?.click();
	}

	function copyToClipboard() {
		const codeExample = generateCodeExample();
		navigator.clipboard.writeText(codeExample);
	}


	function generateCodeExample() {
		if (!result || !result.success || !result.data) return '';
		
		return `import { extractImageMetadata } from '@zengate/winter-auth';

const result = await extractImageMetadata(imageFile);

if (result.success && result.data) {
  if (result.data.hasGPS && result.data.gps) {
    console.log('GPS:', result.data.gps.latitude, result.data.gps.longitude);
    // Use with your map library (e.g., Leaflet, Google Maps)
  }
  
  console.log('Camera:', result.data.camera.make, result.data.camera.model);
  console.log('Dimensions:', result.data.image.width, 'x', result.data.image.height);
}`;
	}
</script>

<Card.Root class="w-full">
	<Card.Header>
		<Card.Title class="flex items-center gap-2">
			<FileImage class="h-5 w-5" />
			Image Metadata Extractor Demo
		</Card.Title>
		<Card.Description>
			Upload an image to extract GPS coordinates, camera information, and EXIF data
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
					<p class="text-xs text-muted-foreground">{Math.round(selectedFile.size / 1024)} KB</p>
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
						<p class="text-xs text-muted-foreground mt-2">JPEG, PNG, TIFF</p>
					</div>
				</div>
			{/if}
		</div>

		<!-- Loading State -->
		{#if isLoading}
			<div class="flex items-center justify-center py-8">
				<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				<span class="ml-3 text-muted-foreground">Extracting metadata...</span>
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
			{#if result.success && result.data}
				<div class="space-y-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<CheckCircle class="h-4 w-4 text-green-600" />
							<span class="text-sm text-foreground">Extracted</span>
						</div>
						<Badge variant="outline" class="text-xs">
							{result.data.fileName || 'Unknown file'}
						</Badge>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
						<!-- GPS Information -->
						<Card.Root class="border-2">
							<Card.Header class="pb-3">
								<Card.Title class="text-lg flex items-center gap-2">
									<MapPin class="h-5 w-5 text-red-600" />
									GPS Data
								</Card.Title>
							</Card.Header>
							<Card.Content>
								{#if result.data.hasGPS && result.data.gps}
									<div class="space-y-2 text-sm">
										<div class="flex justify-between">
											<span class="font-medium">Latitude:</span>
											<span class="font-mono">{result.data.gps.latitude.toFixed(6)}°</span>
										</div>
										<div class="flex justify-between">
											<span class="font-medium">Longitude:</span>
											<span class="font-mono">{result.data.gps.longitude.toFixed(6)}°</span>
										</div>
										{#if result.data.gps.altitude}
											<div class="flex justify-between">
												<span class="font-medium">Altitude:</span>
												<span class="font-mono">{result.data.gps.altitude}m</span>
											</div>
										{/if}
										{#if result.data.gps.latitudeRef || result.data.gps.longitudeRef}
											<div class="flex justify-between">
												<span class="font-medium">Reference:</span>
												<span class="font-mono">{result.data.gps.latitudeRef}{result.data.gps.longitudeRef}</span>
											</div>
										{/if}
										<div class="mt-3 flex items-center justify-between">
											<Badge variant="default" class="text-xs">
												GPS
											</Badge>
											<Button 
												onclick={() => window.open(`https://maps.google.com/?q=${result.data.gps.latitude},${result.data.gps.longitude}`, '_blank')}
												variant="outline" 
												size="sm"
												class="flex items-center gap-1"
											>
												<ExternalLink class="h-3 w-3" />
												Maps
											</Button>
										</div>
									</div>
								{:else}
									<div class="text-center py-2">
										<p class="text-sm text-muted-foreground">No GPS</p>
									</div>
								{/if}
							</Card.Content>
						</Card.Root>

						<!-- Camera Information -->
						<Card.Root class="border-2">
							<Card.Header class="pb-3">
								<Card.Title class="text-lg flex items-center gap-2">
									<Camera class="h-5 w-5 text-blue-600" />
									Camera Info
								</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="space-y-2 text-sm">
									{#if result.data.camera.make || result.data.camera.model}
										<div class="flex justify-between">
											<span class="font-medium">Device:</span>
											<span class="truncate max-w-32">
												{result.data.camera.make || ''} {result.data.camera.model || ''}
											</span>
										</div>
									{/if}
									{#if result.data.camera.lensModel}
										<div class="flex justify-between">
											<span class="font-medium">Lens:</span>
											<span class="truncate max-w-32">{result.data.camera.lensModel}</span>
										</div>
									{/if}
									{#if result.data.camera.iso}
										<div class="flex justify-between">
											<span class="font-medium">ISO:</span>
											<span>{result.data.camera.iso}</span>
										</div>
									{/if}
									{#if result.data.camera.aperture}
										<div class="flex justify-between">
											<span class="font-medium">Aperture:</span>
											<span>f/{result.data.camera.aperture}</span>
										</div>
									{/if}
									{#if result.data.camera.shutterSpeed}
										<div class="flex justify-between">
											<span class="font-medium">Shutter:</span>
											<span>{result.data.camera.shutterSpeed}</span>
										</div>
									{/if}
									{#if result.data.camera.focalLength}
										<div class="flex justify-between">
											<span class="font-medium">Focal Length:</span>
											<span>{result.data.camera.focalLength}mm</span>
										</div>
									{/if}
								</div>
								{#if !result.data.camera.make && !result.data.camera.model}
									<div class="text-center py-2">
										<p class="text-xs text-muted-foreground">No camera info</p>
									</div>
								{/if}
							</Card.Content>
						</Card.Root>

						<!-- Image Properties -->
						<Card.Root class="border-2">
							<Card.Header class="pb-3">
								<Card.Title class="text-lg flex items-center gap-2">
									<FileImage class="h-5 w-5 text-purple-600" />
									Image Properties
								</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="space-y-2 text-sm">
									{#if result.data.image.width && result.data.image.height}
										<div class="flex justify-between">
											<span class="font-medium">Dimensions:</span>
											<span>{result.data.image.width} × {result.data.image.height}</span>
										</div>
									{/if}
									{#if result.data.image.colorSpace}
										<div class="flex justify-between">
											<span class="font-medium">Color Space:</span>
											<span>{result.data.image.colorSpace}</span>
										</div>
									{/if}
									{#if result.data.image.orientation}
										<div class="flex justify-between">
											<span class="font-medium">Orientation:</span>
											<span>{result.data.image.orientation}</span>
										</div>
									{/if}
									{#if result.data.fileSize}
										<div class="flex justify-between">
											<span class="font-medium">File Size:</span>
											<span>{Math.round(result.data.fileSize / 1024)} KB</span>
										</div>
									{/if}
									{#if result.data.image.xResolution && result.data.image.yResolution}
										<div class="flex justify-between">
											<span class="font-medium">Resolution:</span>
											<span>{result.data.image.xResolution}×{result.data.image.yResolution} DPI</span>
										</div>
									{/if}
								</div>
							</Card.Content>
						</Card.Root>

						<!-- Date/Time Information -->
						<Card.Root class="border-2">
							<Card.Header class="pb-3">
								<Card.Title class="text-lg flex items-center gap-2">
									<Clock class="h-5 w-5 text-green-600" />
									Date & Time
								</Card.Title>
							</Card.Header>
							<Card.Content>
								<div class="space-y-2 text-sm">
									{#if result.data.dateTime.dateTimeOriginal}
										<div class="flex justify-between">
											<span class="font-medium">Taken:</span>
											<span class="font-mono text-xs">{result.data.dateTime.dateTimeOriginal}</span>
										</div>
									{/if}
									{#if result.data.dateTime.dateTime}
										<div class="flex justify-between">
											<span class="font-medium">Modified:</span>
											<span class="font-mono text-xs">{result.data.dateTime.dateTime}</span>
										</div>
									{/if}
									{#if result.data.dateTime.dateTimeDigitized}
										<div class="flex justify-between">
											<span class="font-medium">Digitized:</span>
											<span class="font-mono text-xs">{result.data.dateTime.dateTimeDigitized}</span>
										</div>
									{/if}
									{#if result.data.dateTime.offsetTime}
										<div class="flex justify-between">
											<span class="font-medium">Timezone:</span>
											<span class="font-mono">{result.data.dateTime.offsetTime}</span>
										</div>
									{/if}
								</div>
								{#if !result.data.dateTime.dateTimeOriginal && !result.data.dateTime.dateTime}
									<div class="text-center py-2">
										<p class="text-xs text-muted-foreground">No timestamps</p>
									</div>
								{/if}
							</Card.Content>
						</Card.Root>
					</div>
				</div>
			{:else if result.error}
				<Alert variant="destructive">
					<XCircle class="h-4 w-4" />
					<AlertDescription>
						<strong>{result.error.type}:</strong> {result.error.message}
					</AlertDescription>
				</Alert>
			{/if}
		{/if}

		<!-- Generated Code Example -->
		{#if result && result.success && result.data}
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
					<div class="max-h-96 overflow-y-auto">
						<CodeBlock code={generateCodeExample()} language="typescript" showCopyButton={false} />
					</div>
				</Card.Content>
			</Card.Root>
		{/if}

		<!-- Help Text -->
		<div class="bg-muted border rounded-lg p-4">
			<p class="text-sm text-muted-foreground">
				<strong>💡 Tip:</strong> For best results, upload a photo taken with a smartphone that has GPS enabled. 
				Screenshots and downloaded images typically won't contain location data.
			</p>
		</div>
	</Card.Content>
</Card.Root>