<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Alert, AlertDescription } from "$lib/components/ui/alert/index.js";
	import * as Tabs from "$lib/components/ui/tabs/index.js";
	import { AlertTriangle, XCircle, CheckCircle, FileX, MapPin, Camera } from '@lucide/svelte';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
</script>

<DocPage title="Metadata Edge Cases" description="Handle common edge cases and problems when extracting image metadata">
	
	<div class="prose max-w-none">
		<p class="lead">
			Real-world images often have missing, corrupted, or inconsistent metadata. Learn how to handle these edge cases gracefully and provide meaningful fallbacks.
		</p>

		<h2>Common Edge Cases</h2>

		<div class="space-y-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2 text-red-600">
						<XCircle class="h-5 w-5" />
						Missing GPS Data
					</Card.Title>
					<Card.Description>Images without location information</Card.Description>
				</Card.Header>
				<Card.Content>
					<p class="mb-4">Many images, especially from social media or older devices, don't contain GPS coordinates.</p>
					
					<Tabs.Root value="problem" class="w-full">
						<Tabs.List>
							<Tabs.Trigger value="problem">Problem</Tabs.Trigger>
							<Tabs.Trigger value="detection">Detection</Tabs.Trigger>
							<Tabs.Trigger value="solution">Solution</Tabs.Trigger>
						</Tabs.List>
						
						<Tabs.Content value="problem">
							<div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
								<p class="text-sm mb-2"><strong>Common Causes:</strong></p>
								<ul class="text-sm space-y-1">
									<li>Location services disabled</li>
									<li>Privacy-focused apps stripping metadata</li>
									<li>Older cameras without GPS</li>
									<li>Social media platform processing</li>
								</ul>
							</div>
						</Tabs.Content>
						
						<Tabs.Content value="detection">
							<div>
								<CodeBlock language="typescript" code={`const metadata = await winterAuth.extractMetadata(imageFile);

// Check if GPS data exists
if (!metadata.gps || metadata.gps === null) {
  console.log('No GPS data found');
}

// Check for invalid coordinates (0,0)
if (metadata.gps && 
    metadata.gps.latitude === 0 && 
    metadata.gps.longitude === 0) {
  console.log('Invalid GPS coordinates');
}

// Check GPS accuracy
if (metadata.gps && metadata.gps.accuracy === 'low') {
  console.warn('GPS accuracy is low');
}`} />
							</div>
						</Tabs.Content>
						
						<Tabs.Content value="solution">
							<div>
								<CodeBlock language="typescript" code={`// Handle missing GPS with user location fallback
async function handleMissingGPS(metadata, file) {
  if (!metadata.gps) {
    console.log('No GPS in image, requesting user location...');
    
    try {
      // Check if geolocation is available
      if (!navigator.geolocation) {
        return { status: 'no_location', message: 'Geolocation not supported' };
      }
      
      // Request user's current location
      const position = await getCurrentPosition();
      
      return {
        status: 'user_location',
        coordinates: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        },
        source: 'device',
        message: 'Using current device location'
      };
      
    } catch (error) {
      // Handle location access errors
      if (error.code === error.PERMISSION_DENIED) {
        return {
          status: 'permission_denied',
          message: 'Location access denied. Enable in browser settings.',
          instructions: getLocationInstructions()
        };
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        return {
          status: 'unavailable',
          message: 'Location unavailable. Check GPS/WiFi settings.'
        };
      } else {
        return {
          status: 'timeout',
          message: 'Location request timed out. Try again.'
        };
      }
    }
  }
  
  return {
    status: 'image_gps',
    coordinates: metadata.gps,
    source: 'image'
  };
}

// Get user position with proper error handling
function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      reject,
      {
        enableHighAccuracy: true,
        timeout: 10000, // 10 seconds
        maximumAge: 300000, // 5 minutes cache
        ...options
      }
    );
  });
}

// Platform-specific instructions for enabling location
function getLocationInstructions() {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/iphone|ipad/.test(userAgent)) {
    return ['Settings → Privacy → Location Services → Enable for browser'];
  } else if (/android/.test(userAgent)) {
    return ['Settings → Apps → Browser → Permissions → Location → Allow'];
  } else {
    return ['Click location icon in address bar → Allow location access'];
  }
}`} />
							</div>
						</Tabs.Content>
					</Tabs.Root>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2 text-orange-600">
						<AlertTriangle class="h-5 w-5" />
						Corrupted EXIF Data
					</Card.Title>
					<Card.Description>Unreadable or malformed metadata</Card.Description>
				</Card.Header>
				<Card.Content>
					<p class="mb-4">EXIF data can become corrupted due to file transfers, editing software, or hardware issues.</p>
					
					<Tabs.Root value="problem" class="w-full">
						<Tabs.List>
							<Tabs.Trigger value="problem">Problem</Tabs.Trigger>
							<Tabs.Trigger value="detection">Detection</Tabs.Trigger>
							<Tabs.Trigger value="solution">Solution</Tabs.Trigger>
						</Tabs.List>
						
						<Tabs.Content value="problem">
							<div class="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
								<p class="text-sm mb-2"><strong>Signs of Corruption:</strong></p>
								<ul class="text-sm space-y-1">
									<li>Parsing errors or exceptions</li>
									<li>Nonsensical timestamp values</li>
									<li>Invalid camera settings (e.g., impossible aperture)</li>
									<li>Truncated or missing EXIF segments</li>
								</ul>
							</div>
						</Tabs.Content>
						
						<Tabs.Content value="detection">
							<div>
								<CodeBlock language="typescript" code={`try {
  const metadata = await winterAuth.extractMetadata(imageFile);
  
  // Validate timestamp
  const timestamp = new Date(metadata.timestamp.original);
  if (isNaN(timestamp.getTime())) {
    console.warn('Invalid timestamp in EXIF data');
  }
  
  // Check for reasonable camera settings
  if (metadata.camera.aperture && 
      (metadata.camera.aperture &lt; 0.5 || metadata.camera.aperture &gt; 64)) {
    console.warn('Suspicious aperture value:', metadata.camera.aperture);
  }
  
  // Validate ISO range
  if (metadata.camera.iso && 
      (metadata.camera.iso &lt; 25 || metadata.camera.iso &gt; 51200)) {
    console.warn('Unusual ISO value:', metadata.camera.iso);
  }
  
} catch (error) {
  if (error.code === 'CORRUPTED_EXIF') {
    console.error('EXIF data is corrupted');
  }
}`} />
							</div>
						</Tabs.Content>
						
						<Tabs.Content value="solution">
							<div>
								<CodeBlock language="typescript" code={`function sanitizeMetadata(metadata) {
  const sanitized = { ...metadata };
  
  // Clean timestamp
  if (sanitized.timestamp) {
    const date = new Date(sanitized.timestamp.original);
    if (isNaN(date.getTime())) {
      sanitized.timestamp.original = null;
      sanitized.timestamp.warning = 'Invalid timestamp detected';
    }
  }
  
  // Clean camera settings
  if (sanitized.camera) {
    // Reasonable aperture range: f/0.5 to f/64
    if (sanitized.camera.aperture &lt; 0.5 || sanitized.camera.aperture &gt; 64) {
      sanitized.camera.aperture = null;
    }
    
    // Reasonable ISO range: 25-51200
    if (sanitized.camera.iso &lt; 25 || sanitized.camera.iso &gt; 51200) {
      sanitized.camera.iso = null;
    }
  }
  
  return sanitized;
}

// Usage
const rawMetadata = await winterAuth.extractMetadata(imageFile);
const cleanMetadata = sanitizeMetadata(rawMetadata);`} />
							</div>
						</Tabs.Content>
					</Tabs.Root>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2 text-purple-600">
						<FileX class="h-5 w-5" />
						Unsupported File Formats
					</Card.Title>
					<Card.Description>Formats without metadata support</Card.Description>
				</Card.Header>
				<Card.Content>
					<p class="mb-4">Some image formats don't support EXIF data or have limited metadata capabilities.</p>
					
					<div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
						<div class="text-center">
							<Badge variant="default" class="mb-2">JPEG</Badge>
							<div class="text-xs">Full support</div>
						</div>
						<div class="text-center">
							<Badge variant="default" class="mb-2">TIFF</Badge>
							<div class="text-xs">Full support</div>
						</div>
						<div class="text-center">
							<Badge variant="secondary" class="mb-2">PNG</Badge>
							<div class="text-xs">Limited</div>
						</div>
						<div class="text-center">
							<Badge variant="destructive" class="mb-2">WebP</Badge>
							<div class="text-xs">No EXIF</div>
						</div>
					</div>
					
					<div>
						<CodeBlock language="typescript" code={`function checkFormatSupport(file) {
  const supportedFormats = ['image/jpeg', 'image/tiff'];
  const limitedFormats = ['image/png'];
  const unsupportedFormats = ['image/webp', 'image/gif', 'image/bmp'];
  
  if (supportedFormats.includes(file.type)) {
    return { status: 'full_support', message: 'Full metadata support' };
  } else if (limitedFormats.includes(file.type)) {
    return { status: 'limited_support', message: 'Basic metadata only' };
  } else if (unsupportedFormats.includes(file.type)) {
    return { status: 'no_support', message: 'No metadata support' };
  } else {
    return { status: 'unknown', message: 'Unknown format support' };
  }
}

// Usage before extraction
const formatInfo = checkFormatSupport(imageFile);
if (formatInfo.status === 'no_support') {
  console.warn('This format does not support metadata');
  return null;
}`} />
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Privacy-Stripped Images</h2>

		<p>Many platforms automatically remove metadata for privacy reasons. Here's how to detect and handle these cases:</p>

		<div class="my-6">
			<CodeBlock language="typescript" code={`function detectPrivacyStripping(metadata, originalFile) {
  const indicators = [];
  
  // Check file size vs resolution (compressed files might be reprocessed)
  const expectedSize = metadata.image.width * metadata.image.height * 0.3;
  if (originalFile.size < expectedSize) {
    indicators.push('file_recompressed');
  }
  
  // Missing common EXIF tags that cameras usually include
  const commonTags = ['Make', 'Model', 'DateTime', 'Software'];
  const missingTags = commonTags.filter(tag => !metadata.tags[tag]);
  if (missingTags.length > 2) {
    indicators.push('exif_stripped');
  }
  
  // GPS data completely missing (suspicious for mobile photos)
  if (!metadata.gps && originalFile.name.includes('IMG_')) {
    indicators.push('gps_removed');
  }
  
  return {
    isLikelyStripped: indicators.length > 1,
    indicators,
    confidence: indicators.length / 4 // 0-1 scale
  };
}`} />
		</div>

		<h2>Timezone Handling</h2>

		<p>Image timestamps can be tricky due to timezone issues and camera clock settings:</p>

		<div class="space-y-4 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">Local Time vs UTC</Card.Title>
				</Card.Header>
				<Card.Content>
					<div>
						<CodeBlock language="typescript" code={`function handleTimestamps(metadata) {
  const timestamps = metadata.timestamp;
  
  // Camera local time (no timezone info)
  const localTime = new Date(timestamps.original);
  
  // GPS timestamp (UTC)
  const gpsTime = metadata.gps?.timestamp ? 
    new Date(metadata.gps.timestamp) : null;
  
  // Calculate potential timezone offset
  if (gpsTime && localTime) {
    const offsetMs = localTime.getTime() - gpsTime.getTime();
    const offsetHours = Math.round(offsetMs / (1000 * 60 * 60));
    
    return {
      localTime,
      utcTime: gpsTime,
      timezoneOffset: offsetHours,
      isLikelyCorrect: Math.abs(offsetHours) <= 12
    };
  }
  
  return { localTime, warning: 'No GPS timestamp for validation' };
}`} />
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Error Handling</h2>

		<p>For detailed error codes and handling patterns specific to metadata extraction, see the <a href="/docs/api-reference/error-codes#metadata-extraction-errors" class="text-primary hover:underline">Metadata Extraction Errors</a> section.</p>

		<h2>Best Practices for Edge Cases</h2>

		<div class="not-prose my-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>Key Implementation Tips</Card.Title>
				</Card.Header>
				<Card.Content>
					<ul class="space-y-2 text-sm">
						<li>Always validate extracted GPS coordinates are within valid ranges before using them</li>
						<li>Handle missing GPS gracefully by requesting user location through the browser API</li>
						<li>Expect stripped metadata from social media images and provide appropriate fallbacks</li>
						<li>Log corrupted EXIF patterns to identify problematic image sources</li>
						<li>Use <code>hasGPSData()</code> to pre-check before attempting GPS extraction</li>
					</ul>
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Next Steps</h2>

		<div class="flex gap-4 mt-6">
			<Button href="/docs/modules/metadata-extractor/usage">
				Back to Usage Guide
			</Button>
			<Button variant="outline" href="/docs/api/utils">
				View Utility Functions
			</Button>
		</div>
	</div>
</DocPage>
