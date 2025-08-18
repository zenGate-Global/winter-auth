<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import CodeBlock from '$lib/components/ui/code-block.svelte';
</script>

<DocPage title="Utility Functions" description="Helper functions exported by Winter Authenticator">
	
	<div class="prose max-w-none">
		<p class="lead">
			Winter Authenticator exports three utility functions for metadata processing, GPS coordinate conversion, and image validation.
		</p>

		<h2>Available Utilities</h2>

		<div class="space-y-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-blue-600">dmsToDecimal()</Card.Title>
					<Card.Description>Convert DMS coordinates to decimal degrees</Card.Description>
				</Card.Header>
				<Card.Content>
					<CodeBlock language="typescript" code={`import { dmsToDecimal } from '@zengate/winter-auth';

// Convert GPS coordinates from DMS to decimal format
const latitude = dmsToDecimal(40, 45, 30, 'N');  // → 40.758333
const longitude = dmsToDecimal(73, 59, 6, 'W');   // → -73.985

console.log(\`Coordinates: \${latitude}, \${longitude}\`);`} />
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title class="text-green-600">parseGPSCoordinates()</Card.Title>
					<Card.Description>Parse GPS coordinates from EXIF data</Card.Description>
				</Card.Header>
				<Card.Content>
					<CodeBlock language="typescript" code={`import { parseGPSCoordinates } from '@zengate/winter-auth';

// Parse GPS data from raw EXIF
const gpsCoordinates = parseGPSCoordinates(rawExifGpsData);

if (gpsCoordinates) {
  console.log('Location:', gpsCoordinates.latitude, gpsCoordinates.longitude);
  if (gpsCoordinates.altitude) {
    console.log('Altitude:', gpsCoordinates.altitude, 'm');
  }
} else {
  console.log('No valid GPS coordinates found');
}`} />
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title class="text-purple-600">isValidImageFile()</Card.Title>
					<Card.Description>Check if file type is supported for metadata extraction</Card.Description>
				</Card.Header>
				<Card.Content>
					<CodeBlock language="typescript" code={`import { isValidImageFile } from '@zengate/winter-auth';

// Check if file can have metadata extracted
if (isValidImageFile(file.name)) {
  console.log('✅ File type supported for metadata extraction');
  // Proceed with extraction
} else {
  console.log('❌ Unsupported file type for metadata');
  // Handle unsupported file
}

// Supported formats: JPEG, TIFF, PNG (with limitations)
const supportedFiles = ['photo.jpg', 'image.jpeg', 'scan.tiff'];
supportedFiles.forEach(filename => {
  console.log(\`\${filename}: \${isValidImageFile(filename) ? 'Supported' : 'Not supported'}\`);
});`} />
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Complete Import Reference</h2>

		<div class="my-6">
			<CodeBlock language="typescript" code={`// Import all three utility functions
import { 
  dmsToDecimal,
  parseGPSCoordinates,
  isValidImageFile 
} from '@zengate/winter-auth';

// Example usage combining all utilities
const validateAndProcessImage = async (file: File) => {
  // Validate the file type first
  if (!isValidImageFile(file.name)) {
    console.error('Unsupported file type');
    return;
  }
  
  // Extract GPS coordinates from EXIF data
  const metadata = await extractImageMetadata(file);
  if (metadata.success && metadata.data?.gps) {
    const { latitude, longitude } = metadata.data.gps;
    console.log('Location:', latitude, longitude);
  }
  
  // Convert DMS coordinates to decimal if needed
  const decimal = dmsToDecimal(40, 45, 30, 'N');
  console.log('Decimal coordinate:', decimal);
};`} />
		</div>

		<h2>TypeScript Types</h2>

		<div class="my-6">
			<CodeBlock language="typescript" code={`// GPS coordinates structure
interface GPSCoordinates {
  latitude: number;
  longitude: number;
  altitude?: number;
  latitudeRef?: string;
  longitudeRef?: string;
}

// Function signatures
type dmsToDecimal = (
  degrees: number, 
  minutes: number, 
  seconds: number, 
  direction: 'N' | 'S' | 'E' | 'W'
) => number;

type parseGPSCoordinates = (gpsData: any) => GPSCoordinates | null;

type isValidImageFile = (filename: string) => boolean;

// Import the types
import type { GPSCoordinates } from '@zengate/winter-auth/types';`} />
		</div>

		<h2>Next Steps</h2>

		<div class="flex gap-4 mt-6">
			<Button href="/docs/api-reference/type-definitions">
				View Type Definitions
			</Button>
			<Button variant="outline" href="/docs/api-reference/error-codes">
				Error Code Reference
			</Button>
		</div>
	</div>
</DocPage>