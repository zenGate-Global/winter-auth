<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Table from '$lib/components/ui/table';
	import * as Badge from "$lib/components/ui/badge/index.js";
	import { MapPin, Camera, Clock, FileImage, Info, Zap } from '@lucide/svelte';
	import MetadataExtractorDemo from '$lib/components/interactive/MetadataExtractorDemo.svelte';
</script>

<DocPage title="extractImageMetadata()" description="Extract comprehensive metadata including GPS, camera settings, and EXIF data from images">
	
	<p class="text-muted-foreground mb-8">
		The <code>extractImageMetadata()</code> function is the primary method for extracting comprehensive metadata from image files, including GPS coordinates, camera settings, timestamps, and technical image information.
	</p>

	<div class="space-y-8">
		
		<!-- Interactive Demo Section -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Interactive Demo</h2>
			<MetadataExtractorDemo />
		</section>

		<!-- API Reference -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">API Reference</h2>
			
			<Card.Root>
				<Card.Header>
					<Card.Title>Method Signature</Card.Title>
				</Card.Header>
				<Card.Content>
					<CodeBlock 
						language="typescript" 
						code={`extractImageMetadata(
  imageFile: File | ArrayBuffer,
  options?: MetadataExtractionOptions
): Promise<MetadataExtractionResult>`}
					/>
				</Card.Content>
			</Card.Root>
		</section>

		<!-- Parameters -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Parameters</h2>
			
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Parameter</Table.Head>
						<Table.Head>Type</Table.Head>
						<Table.Head>Description</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						<Table.Cell class="font-medium">imageFile</Table.Cell>
						<Table.Cell><code>File | ArrayBuffer</code></Table.Cell>
						<Table.Cell>The image file to extract metadata from</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="font-medium">options.includeRawExif</Table.Cell>
						<Table.Cell><code>boolean</code></Table.Cell>
						<Table.Cell>Include raw EXIF data in the result (default: false)</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="font-medium">options.validateGPS</Table.Cell>
						<Table.Cell><code>boolean</code></Table.Cell>
						<Table.Cell>Validate GPS coordinate ranges (default: true)</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="font-medium">options.customFields</Table.Cell>
						<Table.Cell><code>string[]</code></Table.Cell>
						<Table.Cell>Custom EXIF fields to extract</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</section>

		<!-- Return Value -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Return Value</h2>
			
			<CodeBlock 
				language="typescript" 
				code={`interface MetadataExtractionResult {
  success: boolean;
  data: ImageMetadata | null;
  error?: {
    type: MetadataExtractionError;
    message: string;
  };
}

interface ImageMetadata {
  gps: GPSCoordinates | null;        // GPS location data
  camera: CameraInfo;                // Camera and shooting info
  image: ImageInfo;                  // Image technical details  
  dateTime: DateTimeInfo;            // Date/time information
  rawExif?: Record<string, any>;     // Raw EXIF data (optional)
  hasGPS: boolean;                   // Quick GPS availability flag
  fileName?: string;                 // File name (if File object used)
  fileSize?: number;                 // File size in bytes
}`}
			/>
		</section>

		<!-- Data Types -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Metadata Structure</h2>
			
			<Tabs.Root value="gps" class="w-full">
				<Tabs.List class="grid w-full grid-cols-4">
					<Tabs.Trigger value="gps">GPS Data</Tabs.Trigger>
					<Tabs.Trigger value="camera">Camera Info</Tabs.Trigger>
					<Tabs.Trigger value="image">Image Details</Tabs.Trigger>
					<Tabs.Trigger value="datetime">Date/Time</Tabs.Trigger>
				</Tabs.List>
				
				<Tabs.Content value="gps" class="mt-6">
					<Card.Root>
						<Card.Header>
							<Card.Title class="flex items-center gap-2">
								<MapPin class="h-4 w-4" />
								GPS Coordinates
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<CodeBlock 
								language="typescript" 
								code={`interface GPSCoordinates {
  latitude: number;          // Latitude in decimal degrees
  longitude: number;         // Longitude in decimal degrees
  altitude?: number;         // Altitude in meters (optional)
  latitudeRef?: string;      // Latitude reference (N/S)
  longitudeRef?: string;     // Longitude reference (E/W)
}

// Example GPS data
{
  latitude: 40.7589,
  longitude: -73.9851,
  altitude: 10.5,
  latitudeRef: "N",
  longitudeRef: "W"
}`}
							/>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
				
				<Tabs.Content value="camera" class="mt-6">
					<Card.Root>
						<Card.Header>
							<Card.Title class="flex items-center gap-2">
								<Camera class="h-4 w-4" />
								Camera Information
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<CodeBlock 
								language="typescript" 
								code={`interface CameraInfo {
  make?: string;             // Camera manufacturer
  model?: string;            // Camera model
  software?: string;         // Camera software/firmware
  lensModel?: string;        // Lens model
  iso?: number;              // ISO sensitivity
  aperture?: number;         // Aperture value (f-stop)
  shutterSpeed?: string;     // Shutter speed (formatted)
  focalLength?: number;      // Focal length in mm
  flash?: string;            // Flash mode
  whiteBalance?: string;     // White balance setting
}

// Example camera data
{
  make: "Apple",
  model: "iPhone 15 Pro",
  software: "iOS 17.1",
  iso: 200,
  aperture: 1.8,
  shutterSpeed: "1/60",
  focalLength: 26,
  flash: "No Flash",
  whiteBalance: "Auto"
}`}
							/>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
				
				<Tabs.Content value="image" class="mt-6">
					<Card.Root>
						<Card.Header>
							<Card.Title class="flex items-center gap-2">
								<FileImage class="h-4 w-4" />
								Image Properties
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<CodeBlock 
								language="typescript" 
								code={`interface ImageInfo {
  width?: number;            // Image width in pixels
  height?: number;           // Image height in pixels
  colorSpace?: string;       // Color space
  orientation?: number;      // Orientation/rotation
  xResolution?: number;      // Resolution in DPI
  yResolution?: number;      // Resolution in DPI  
  bitsPerSample?: number;    // Bits per sample
}

// Example image data
{
  width: 4032,
  height: 3024,
  colorSpace: "sRGB",
  orientation: 1,
  xResolution: 72,
  yResolution: 72,
  bitsPerSample: 8
}`}
							/>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
				
				<Tabs.Content value="datetime" class="mt-6">
					<Card.Root>
						<Card.Header>
							<Card.Title class="flex items-center gap-2">
								<Clock class="h-4 w-4" />
								Date/Time Information
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<CodeBlock 
								language="typescript" 
								code={`interface DateTimeInfo {
  dateTimeOriginal?: string; // Original date/time when photo was taken
  dateTime?: string;         // Date/time when file was created
  dateTimeDigitized?: string; // Date/time when file was digitized
  offsetTime?: string;       // Timezone offset
}

// Example date/time data
{
  dateTimeOriginal: "2024-01-15 14:30:25",
  dateTime: "2024-01-15 14:30:25",
  dateTimeDigitized: "2024-01-15 14:30:25", 
  offsetTime: "-05:00"
}`}
							/>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
			</Tabs.Root>
		</section>

		<!-- Usage Examples -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Usage Examples</h2>
			
			<Tabs.Root value="basic" class="w-full">
				<Tabs.List class="grid w-full grid-cols-3">
					<Tabs.Trigger value="basic">Basic Extraction</Tabs.Trigger>
					<Tabs.Trigger value="detailed">Detailed Analysis</Tabs.Trigger>
					<Tabs.Trigger value="validation">With Validation</Tabs.Trigger>
				</Tabs.List>
				
				<Tabs.Content value="basic" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`import { extractImageMetadata } from '@zengate/winter-auth';

// Basic metadata extraction
const handleImageUpload = async (file: File) => {
  const result = await extractImageMetadata(file);
  
  if (result.success && result.data) {
    const { gps, camera, image, dateTime } = result.data;
    
    console.log('File:', file.name, '(' + (file.size / 1024).toFixed(1) + ' KB)');
    
    if (gps) {
      console.log(\`📍 Location: \${gps.latitude}, \${gps.longitude}\`);
      if (gps.altitude) {
        console.log(\`⛰️  Altitude: \${gps.altitude}m\`);
      }
    } else {
      console.log('📍 No GPS data found');
    }
    
    if (camera.make && camera.model) {
      console.log(\`📷 Camera: \${camera.make} \${camera.model}\`);
    }
    
    console.log(\`🖼️  Dimensions: \${image.width} × \${image.height}\`);
    
    if (dateTime.dateTimeOriginal) {
      console.log(\`📅 Taken: \${dateTime.dateTimeOriginal}\`);
    }
  } else {
    console.error('Failed to extract metadata:', result.error?.message);
  }
};`}
					/>
				</Tabs.Content>
				
				<Tabs.Content value="detailed" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`// Detailed extraction with all options
const extractDetailedMetadata = async (file: File) => {
  const result = await extractImageMetadata(file, {
    includeRawExif: true,      // Include raw EXIF data
    validateGPS: true,         // Validate GPS coordinates
    customFields: [            // Extract custom EXIF fields
      'ColorSpace',
      'SceneCaptureType',
      'ExifImageWidth'
    ]
  });
  
  if (result.success && result.data) {
    const metadata = result.data;
    
    // Comprehensive metadata analysis
    const analysis = {
      file: {
        name: metadata.fileName || 'Unknown',
        size: metadata.fileSize ? \`\${(metadata.fileSize / 1024 / 1024).toFixed(2)} MB\` : 'Unknown',
        hasGPS: metadata.hasGPS
      },
      location: metadata.gps ? {
        coordinates: \`\${metadata.gps.latitude}, \${metadata.gps.longitude}\`,
        altitude: metadata.gps.altitude ? \`\${metadata.gps.altitude}m\` : 'Not available',
        reference: \`\${metadata.gps.latitudeRef || ''}\${metadata.gps.longitudeRef || ''}\`
      } : null,
      camera: {
        device: \`\${metadata.camera.make || 'Unknown'} \${metadata.camera.model || ''}\`.trim(),
        settings: {
          iso: metadata.camera.iso || 'Not available',
          aperture: metadata.camera.aperture ? \`f/\${metadata.camera.aperture}\` : 'Not available',
          shutter: metadata.camera.shutterSpeed || 'Not available',
          focal: metadata.camera.focalLength ? \`\${metadata.camera.focalLength}mm\` : 'Not available'
        }
      },
      technical: {
        dimensions: \`\${metadata.image.width} × \${metadata.image.height}\`,
        orientation: metadata.image.orientation || 1,
        colorSpace: metadata.image.colorSpace || 'Unknown',
        resolution: metadata.image.resolution ? 
          \`\${metadata.image.resolution.x} × \${metadata.image.resolution.y} DPI\` : 'Unknown'
      },
      timing: {
        taken: metadata.dateTime.dateTimeOriginal || 'Not available',
        digitized: metadata.dateTime.dateTimeDigitized || 'Not available',
        modified: metadata.dateTime.dateTime || 'Not available'
      }
    };
    
    console.log('Detailed Metadata Analysis:', analysis);
    
    // Raw EXIF data (if requested)
    if (metadata.rawExif) {
      console.log('Raw EXIF Data:', metadata.rawExif);
    }
  }
};`}
					/>
				</Tabs.Content>
				
				<Tabs.Content value="validation" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`// Metadata extraction with validation and error handling
const validateAndExtractMetadata = async (file: File) => {
  // Validate file first
  if (!file.type.startsWith('image/')) {
    throw new Error('File is not an image');
  }
  
  if (file.size > 50 * 1024 * 1024) { // 50MB limit
    throw new Error('File is too large');
  }
  
  try {
    const result = await extractImageMetadata(file, {
      validateGPS: true,
      includeRawExif: false
    });
    
    if (!result.success) {
      // Handle specific extraction errors
      switch (result.error?.type) {
        case 'NO_EXIF_DATA':
          console.log('Image has no metadata - likely a screenshot or edited image');
          return { hasMetadata: false, data: null };
          
        case 'UNSUPPORTED_FORMAT':
          console.log('Image format is not supported for metadata extraction');
          return { hasMetadata: false, data: null };
          
        case 'CORRUPTED_DATA':
          console.log('Image file appears to be corrupted');
          return { hasMetadata: false, data: null };
          
        case 'GPS_PARSING_ERROR':
          console.log('GPS data found but could not be parsed');
          // Try again without GPS validation
          const retryResult = await extractImageMetadata(file, { validateGPS: false });
          return { hasMetadata: retryResult.success, data: retryResult.data };
          
        default:
          console.log('Unknown extraction error:', result.error?.message);
          return { hasMetadata: false, data: null };
      }
    }
    
    // Validate extracted data
    const data = result.data!;
    const validationIssues: string[] = [];
    
    if (data.hasGPS && data.gps) {
      // GPS validation
      if (Math.abs(data.gps.latitude) > 90) {
        validationIssues.push('Invalid latitude value');
      }
      if (Math.abs(data.gps.longitude) > 180) {
        validationIssues.push('Invalid longitude value');
      }
    }
    
    // Image validation
    if (data.image.width < 1 || data.image.height < 1) {
      validationIssues.push('Invalid image dimensions');
    }
    
    return {
      hasMetadata: true,
      data: data,
      validationIssues: validationIssues,
      isValid: validationIssues.length === 0
    };
    
  } catch (error) {
    console.error('Extraction failed:', error);
    return { hasMetadata: false, data: null, error: error.message };
  }
};`}
					/>
				</Tabs.Content>
			</Tabs.Root>
		</section>

		<!-- Performance Considerations -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Performance Considerations</h2>
			
			<div class="grid gap-4 md:grid-cols-2">
				<Card.Root>
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							<Zap class="h-4 w-4" />
							Optimization Tips
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-2 text-sm">
							<li>Use <code>extractGPSOnly()</code> when you only need location</li>
							<li>Set <code>includeRawExif: false</code> unless needed</li>
							<li>Process multiple files in parallel with <code>Promise.all()</code></li>
							<li>Consider file size limits for large images</li>
							<li>Cache results for repeated operations</li>
						</ul>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Processing Times</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-2 text-sm">
							<li>Small images (&lt; 1MB): ~10-50ms</li>
							<li>Medium images (1-5MB): ~50-200ms</li>
							<li>Large images (5-20MB): ~200-800ms</li>
							<li>RAW EXIF extraction adds ~20-100ms</li>
						</ul>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- Error Handling -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Error Handling</h2>
			
			<p>The function returns structured error information for different failure scenarios. For comprehensive error codes and handling patterns, see the <a href="/docs/api-reference/error-codes#metadata-extraction-errors" class="text-primary hover:underline">Metadata Extraction Errors</a> section.</p>
		</section>

		<!-- Best Practices -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Best Practices</h2>
			
			<Card.Root>
				<Card.Header>
					<Card.Title>Key Implementation Tips</Card.Title>
				</Card.Header>
				<Card.Content>
					<ul class="space-y-2 text-sm">
						<li>Use <code>extractGPSOnly()</code> or <code>hasGPSData()</code> when you only need location data for better performance</li>
						<li>Always handle the "no metadata" case gracefully - many images from social media have stripped EXIF data</li>
						<li>Check file size before processing - consider rejecting files over 20MB or processing them asynchronously</li>
						<li>Format timestamps and GPS coordinates in user-friendly ways (e.g., "2 hours ago", "Times Square, NY")</li>
					</ul>
				</Card.Content>
			</Card.Root>
		</section>

	</div>
</DocPage>
