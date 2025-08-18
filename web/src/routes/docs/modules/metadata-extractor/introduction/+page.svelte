<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { MapPin, Camera, Clock, FileImage } from '@lucide/svelte';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
</script>

<DocPage title="Image Metadata Extractor" description="Extract GPS coordinates and EXIF data from images">
	
	<div class="prose max-w-none">
		<p class="lead">
			The Image Metadata Extractor module provides comprehensive EXIF data extraction, with a focus on GPS coordinates for location-based verification workflows.
		</p>

		<h2>Overview</h2>
		
		<p>This module is essential for blockchain traceability systems where location verification is required. It extracts GPS coordinates, camera settings, timestamps, and other metadata from uploaded images.</p>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<MapPin class="h-5 w-5 text-red-600" />
						GPS Extraction
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm">Extract latitude, longitude, altitude, and GPS timestamp from image metadata</p>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Camera class="h-5 w-5 text-blue-600" />
						Camera Data
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm">Camera make, model, lens information, and capture settings</p>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Clock class="h-5 w-5 text-green-600" />
						Timestamps
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm">Creation date, modification date, and GPS timestamp extraction</p>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<FileImage class="h-5 w-5 text-purple-600" />
						Image Properties
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm">Dimensions, orientation, color space, and compression details</p>
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Core Functions</h2>

		<h3><code>extractImageMetadata(file: File, options?: MetadataExtractionOptions)</code></h3>
		
		<p>The primary function for extracting all available metadata from an image file.</p>

		<div class="my-6">
			<CodeBlock language="typescript" code={`import { extractImageMetadata } from '@zengate/winter-auth';

const result = await extractImageMetadata(imageFile);

if (result.success && result.data && result.data.hasGPS) {
  console.log(\`Location: \${result.data.gps.latitude}, \${result.data.gps.longitude}\`);
  console.log(\`Altitude: \${result.data.gps.altitude}m\`);
  console.log(\`Camera: \${result.data.camera.make} \${result.data.camera.model}\`);
}`}`} />
		</div>

		<h3><code>extractGPSOnly(file: File | ArrayBuffer)</code></h3>
		
		<p>Quick GPS-only extraction for location verification workflows.</p>

		<div class="my-6">
			<CodeBlock language="typescript" code={`import { extractGPSOnly, hasGPSData } from '@zengate/winter-auth';

// Quick check if GPS data exists
const hasGPS = await hasGPSData(imageFile);

if (hasGPS) {
  const result = await extractGPSOnly(imageFile);
  if (result.hasGPS && result.gps) {
    console.log(\`Location: \${result.gps.latitude}, \${result.gps.longitude}\`);
  }
}`} />
		</div>

		<h2>Real Test Cases</h2>

		<div class="space-y-6">
			<h3>GPS-Enabled Images</h3>
			
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose">
				<Card.Root>
					<Card.Header>
						<Card.Title>Smartphone Photo</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="text-sm space-y-2">
							<div><strong>Device:</strong> iPhone 14 Pro</div>
							<div><strong>GPS:</strong> 37.7749° N, 122.4194° W</div>
							<div><strong>Altitude:</strong> 16.8m</div>
							<div><strong>Timestamp:</strong> 2024-03-15 14:30:22 UTC</div>
							<div><strong>Expected Result:</strong> ✅ GPS extraction successful</div>
						</div>
					</Card.Content>
				</Card.Root>
				
				<Card.Root>
					<Card.Header>
						<Card.Title>DSLR Camera</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="text-sm space-y-2">
							<div><strong>Device:</strong> Canon EOS R5</div>
							<div><strong>GPS:</strong> 51.5074° N, 0.1278° W</div>
							<div><strong>Lens:</strong> RF 24-70mm f/2.8L IS USM</div>
							<div><strong>Settings:</strong> f/2.8, 1/125s, ISO 400</div>
							<div><strong>Expected Result:</strong> ✅ Full metadata available</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>

			<h3>Edge Cases</h3>
			
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose">
				<Card.Root>
					<Card.Header>
						<Card.Title>No GPS Data</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="text-sm space-y-2">
							<div><strong>Source:</strong> Web download</div>
							<div><strong>GPS:</strong> Not available</div>
							<div><strong>Camera:</strong> Unknown</div>
							<Badge variant="destructive">GPS Missing</Badge>
						</div>
					</Card.Content>
				</Card.Root>
				
				<Card.Root>
					<Card.Header>
						<Card.Title>Corrupted EXIF</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="text-sm space-y-2">
							<div><strong>Source:</strong> Edited image</div>
							<div><strong>EXIF:</strong> Partially corrupted</div>
							<div><strong>GPS:</strong> Invalid coordinates</div>
							<Badge variant="destructive">Corrupted</Badge>
						</div>
					</Card.Content>
				</Card.Root>
				
				<Card.Root>
					<Card.Header>
						<Card.Title>Privacy Stripped</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="text-sm space-y-2">
							<div><strong>Source:</strong> Social media</div>
							<div><strong>EXIF:</strong> Stripped for privacy</div>
							<div><strong>GPS:</strong> Removed</div>
							<Badge variant="secondary">Stripped</Badge>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</div>

		<h2>Response Format</h2>

		<div class="my-6">
			<CodeBlock language="typescript" code={`interface MetadataExtractionResult {
  success: boolean;
  data: ImageMetadata | null;
  error?: {
    type: MetadataExtractionError;
    message: string;
  };
}

interface ImageMetadata {
  gps: GPSCoordinates | null;        // GPS location data (null if not available)
  camera: CameraInfo;                // Camera and photo technical information
  image: ImageInfo;                  // Image dimensions and technical details
  dateTime: DateTimeInfo;            // Date and time information
  rawExif?: Record<string, unknown>; // Raw EXIF data for advanced use cases
  hasGPS: boolean;                   // Whether GPS data was found in the image
  fileName?: string;                 // File name
  fileSize?: number;                 // File size in bytes
}

interface GPSCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  latitudeRef?: string;
  longitudeRef?: string;
}`}`} />
		</div>

		<h2>Blockchain Integration</h2>

		<p>In blockchain traceability systems, GPS metadata serves as crucial verification data:</p>

		<ul class="space-y-2">
			<li><strong>Location Verification:</strong> Confirm records are captured at expected locations</li>
			<li><strong>Timestamp Validation:</strong> Verify capture time against system records</li>
			<li><strong>Device Authentication:</strong> Track which devices capture verification images</li>
			<li><strong>Audit Trail:</strong> Maintain immutable record of where and when images were captured</li>
		</ul>

		<h2>Error Handling</h2>

		<p>For comprehensive error handling including metadata extraction errors, see the <a href="/docs/api-reference/error-codes#metadata-extraction-errors" class="text-primary hover:underline">Error Codes API Reference</a>.</p>

		<h2>Performance Considerations</h2>

		<ul class="space-y-2">
			<li><strong>File Size:</strong> Large files (>10MB) may take longer to process</li>
			<li><strong>Format Support:</strong> JPEG and TIFF have the richest EXIF data</li>
			<li><strong>Memory Usage:</strong> Processing is done in-memory, consider file size limits</li>
			<li><strong>Browser Compatibility:</strong> Uses FileReader API, supported in modern browsers</li>
		</ul>

	</div>
</DocPage>
