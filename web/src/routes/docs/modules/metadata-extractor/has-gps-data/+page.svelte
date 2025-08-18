<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Table from '$lib/components/ui/table';
	import { Zap, CheckCircle, XCircle, Info } from '@lucide/svelte';
	import HasGPSDataDemo from '$lib/components/interactive/HasGPSDataDemo.svelte';
</script>

<DocPage title="hasGPSData()" description="Ultra-fast GPS availability check without full metadata extraction">
	
	<p class="text-muted-foreground mb-8">
		The <code>hasGPSData()</code> function provides the fastest way to check if an image contains GPS metadata. This ultra-lightweight method performs minimal processing to quickly determine GPS availability without extracting any actual coordinate data.
	</p>

	<div class="space-y-8">
		
		<!-- Interactive Demo Section -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Interactive Demo</h2>
			<HasGPSDataDemo />
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
						code={`hasGPSData(imageFile: File | ArrayBuffer): Promise<boolean>`}
					/>
				</Card.Content>
			</Card.Root>
		</section>

		<!-- Parameters & Return Value -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Parameters & Return Value</h2>
			
			<div class="grid gap-6 md:grid-cols-2">
				<Card.Root>
					<Card.Header>
						<Card.Title>Parameters</Card.Title>
					</Card.Header>
					<Card.Content>
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
									<Table.Cell>The image file to check for GPS data</Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Return Value</Card.Title>
					</Card.Header>
					<Card.Content>
						<div class="space-y-4">
							<div class="flex items-center gap-2">
								<CheckCircle class="h-4 w-4 text-green-600" />
								<code class="text-green-600">true</code>
								<span class="text-sm text-muted-foreground">- Image contains GPS metadata</span>
							</div>
							<div class="flex items-center gap-2">
								<XCircle class="h-4 w-4 text-red-600" />
								<code class="text-red-600">false</code>
								<span class="text-sm text-muted-foreground">- No GPS metadata found</span>
							</div>
						</div>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- Performance Characteristics -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Performance Characteristics</h2>
			
			<Alert.Root>
				<Zap class="h-4 w-4" />
				<Alert.Title>Ultra-Fast Checking</Alert.Title>
				<Alert.Description>
					This method is 10-20x faster than coordinate extraction because it only checks for GPS tag presence without parsing the actual coordinate values.
				</Alert.Description>
			</Alert.Root>

			<div class="mt-6 grid gap-4 md:grid-cols-3">
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-blue-600">Processing Times</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-2 text-sm">
							<li>Small images: <strong>1-5ms</strong></li>
							<li>Medium images: <strong>2-8ms</strong></li>
							<li>Large images: <strong>5-15ms</strong></li>
							<li>Batch of 100 images: <strong>~500ms</strong></li>
						</ul>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title class="text-green-600">Memory Usage</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-2 text-sm">
							<li><strong>Minimal RAM</strong> - only reads file headers</li>
							<li><strong>No coordinate parsing</strong> overhead</li>
							<li><strong>Early exit</strong> - stops at first GPS tag</li>
							<li><strong>Garbage collection friendly</strong></li>
						</ul>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title class="text-purple-600">Use Cases</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-2 text-sm">
							<li><strong>Pre-filtering</strong> large image collections</li>
							<li><strong>UI state</strong> - show/hide location features</li>
							<li><strong>Batch analysis</strong> - quick GPS statistics</li>
							<li><strong>Performance optimization</strong></li>
						</ul>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- Usage Examples -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Usage Examples</h2>
			
			<Tabs.Root value="basic" class="w-full">
				<Tabs.List class="grid w-full grid-cols-3">
					<Tabs.Trigger value="basic">Basic Check</Tabs.Trigger>
					<Tabs.Trigger value="ui">UI Integration</Tabs.Trigger>
					<Tabs.Trigger value="batch">Batch Analysis</Tabs.Trigger>
				</Tabs.List>
				
				<Tabs.Content value="basic" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`import { hasGPSData } from '@zengate/winter-auth';

// Simple GPS availability check
const checkImageGPS = async (file: File) => {
  const hasLocation = await hasGPSData(file);
  
  if (hasLocation) {
    console.log('✅ Image has GPS data - can extract location');
    // Proceed with GPS extraction if needed
    // const { gps } = await extractGPSOnly(file);
  } else {
    console.log('❌ No GPS data found');
    // Handle gracefully - maybe request user location
    // requestUserLocation();
  }
  
  return hasLocation;
};

// Usage with file input
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files || []);
  
  for (const file of files) {
    const hasGPS = await hasGPSData(file);
    console.log(\`\${file.name}: \${hasGPS ? 'Has GPS' : 'No GPS'}\`);
  }
};`}
					/>
				</Tabs.Content>
				
				<Tabs.Content value="ui" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`// Dynamic UI based on GPS availability
const setupImageUploadUI = () => {
  const fileInput = document.getElementById('imageUpload') as HTMLInputElement;
  const locationSection = document.getElementById('locationSection') as HTMLElement;
  const fallbackSection = document.getElementById('fallbackLocation') as HTMLElement;
  
  fileInput.addEventListener('change', async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    
    // Quick GPS check to update UI
    const hasGPS = await hasGPSData(file);
    
    if (hasGPS) {
      // Show GPS-based location UI
      locationSection.style.display = 'block';
      locationSection.innerHTML = \`
        <div class="location-status">
          ✅ Image contains location data
          <button onclick="extractAndShowLocation()">Show Location</button>
        </div>
      \`;
      fallbackSection.style.display = 'none';
    } else {
      // Show fallback location UI  
      locationSection.style.display = 'none';
      fallbackSection.style.display = 'block';
      fallbackSection.innerHTML = \`
        <div class="location-fallback">
          📍 No GPS data in image
          <button onclick="requestUserLocation()">Use Current Location</button>
        </div>
      \`;
    }
  });
};

// Reactive UI component example (React/Svelte style)
const ImageUploadComponent = () => {
  const [hasGPS, setHasGPS] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleImageChange = async (file: File) => {
    setLoading(true);
    try {
      const gpsAvailable = await hasGPSData(file);
      setHasGPS(gpsAvailable);
    } catch (error) {
      console.error('GPS check failed:', error);
      setHasGPS(false);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      {loading && <div>Checking GPS...</div>}
      
      {hasGPS === true && (
        <div className="gps-available">
          ✅ Location data available
          <button onClick={() => extractGPSAndShow()}>
            Show on Map
          </button>
        </div>
      )}
      
      {hasGPS === false && (
        <div className="gps-unavailable">
          📍 No location data
          <button onClick={() => requestUserLocation()}>
            Use Current Location
          </button>
        </div>
      )}
    </div>
  );
};`}
					/>
				</Tabs.Content>
				
				<Tabs.Content value="batch" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`// Batch analysis of image collections
const analyzeImageCollection = async (files: File[]) => {
  console.log(\`Analyzing \${files.length} images for GPS data...\`);
  
  // Process all files in parallel for maximum speed
  const results = await Promise.all(
    files.map(async (file, index) => ({
      fileName: file.name,
      fileSize: file.size,
      index,
      hasGPS: await hasGPSData(file)
    }))
  );
  
  // Generate statistics
  const stats = {
    totalFiles: files.length,
    withGPS: results.filter(r => r.hasGPS).length,
    withoutGPS: results.filter(r => !r.hasGPS).length,
    averageFileSize: Math.round(results.reduce((sum, r) => sum + r.fileSize, 0) / results.length / 1024),
    gpsPercentage: Math.round((results.filter(r => r.hasGPS).length / results.length) * 100)
  };
  
  console.log('Collection Analysis:', stats);
  
  // Group files by GPS availability
  const withGPS = results.filter(r => r.hasGPS).map(r => r.fileName);
  const withoutGPS = results.filter(r => !r.hasGPS).map(r => r.fileName);
  
  return {
    stats,
    withGPS,
    withoutGPS,
    details: results
  };
};

// Smart processing pipeline
const createProcessingPipeline = async (files: File[]) => {
  // Step 1: Quick GPS filtering
  const gpsCheck = await Promise.all(
    files.map(async (file) => ({
      file,
      hasGPS: await hasGPSData(file)
    }))
  );
  
  const filesWithGPS = gpsCheck.filter(item => item.hasGPS).map(item => item.file);
  const filesWithoutGPS = gpsCheck.filter(item => !item.hasGPS).map(item => item.file);
  
  console.log(\`Pre-filtering complete: \${filesWithGPS.length} with GPS, \${filesWithoutGPS.length} without\`);
  
  // Step 2: Only process GPS extraction for files that have GPS
  const locationData = await Promise.all(
    filesWithGPS.map(async (file) => {
      const { gps } = await extractGPSOnly(file); // Only extract from GPS-enabled files
      return {
        fileName: file.name,
        location: gps
      };
    })
  );
  
  // Step 3: Handle files without GPS differently
  const fallbackStrategy = filesWithoutGPS.map(file => ({
    fileName: file.name,
    needsUserLocation: true,
    location: null
  }));
  
  return {
    withLocation: locationData,
    needingLocation: fallbackStrategy,
    processingStats: {
      totalFiles: files.length,
      processedGPS: filesWithGPS.length,
      skippedGPS: filesWithoutGPS.length,
      efficiency: \`Skipped \${Math.round((filesWithoutGPS.length / files.length) * 100)}% of files from GPS processing\`
    }
  };
};`}
					/>
				</Tabs.Content>
			</Tabs.Root>
		</section>

		<!-- Decision Flow -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Decision Flow Integration</h2>
			
			<Card.Root>
				<Card.Header>
					<Card.Title>Smart Processing Pipeline</Card.Title>
					<Card.Description>Use hasGPSData() to optimize your image processing workflow</Card.Description>
				</Card.Header>
				<Card.Content>
					<CodeBlock 
						language="typescript" 
						code={`// Optimized image processing decision tree
const processImageIntelligently = async (file: File) => {
  // Step 1: Ultra-fast GPS check (1-5ms)
  const hasGPS = await hasGPSData(file);
  
  if (hasGPS) {
    console.log('📍 GPS detected - processing location data...');
    
    // Step 2: Extract GPS coordinates (10-30ms)
    const { gps } = await extractGPSOnly(file);
    
    if (gps) {
      // Use image GPS data
      return {
        strategy: 'image-gps',
        location: {
          latitude: gps.latitude,
          longitude: gps.longitude,
          source: 'exif'
        },
        processingTime: 'fast'
      };
    }
  }
  
  console.log('❌ No GPS data - requesting user location...');
  
  // Step 3: Fallback to user location
  try {
    const position = await getCurrentPosition();
    return {
      strategy: 'user-location',
      location: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        source: 'user'
      },
      processingTime: 'medium'
    };
  } catch {
    // Step 4: No location available
    return {
      strategy: 'no-location',
      location: null,
      processingTime: 'fast'
    };
  }
};

// Batch optimization example
const optimizedBatchProcessing = async (files: File[]) => {
  // Pre-filter with hasGPSData (very fast)
  const gpsResults = await Promise.all(
    files.map(async (file) => ({
      file,
      hasGPS: await hasGPSData(file)
    }))
  );
  
  const withGPS = gpsResults.filter(r => r.hasGPS);
  const withoutGPS = gpsResults.filter(r => !r.hasGPS);
  
  console.log(\`Optimization: Processing \${withGPS.length} GPS files, skipping \${withoutGPS.length}\`);
  
  // Only extract GPS from files that have it
  const locationResults = await Promise.all(
    withGPS.map(async ({ file }) => {
      const { gps } = await extractGPSOnly(file);
      return { file: file.name, location: gps };
    })
  );
  
  // Handle non-GPS files differently (maybe bulk user location)
  const nonGPSFiles = withoutGPS.map(({ file }) => ({
    file: file.name,
    location: null,
    needsAlternative: true
  }));
  
  return {
    processed: locationResults,
    skipped: nonGPSFiles,
    efficiency: \`Saved \${Math.round((withoutGPS.length / files.length) * 100)}% processing time\`
  };
};`}
					/>
				</Card.Content>
			</Card.Root>
		</section>

		<!-- Comparison Table -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Method Comparison</h2>
			
			<Card.Root>
				<Card.Header>
					<Card.Title>Performance & Use Case Comparison</Card.Title>
				</Card.Header>
				<Card.Content>
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Method</Table.Head>
								<Table.Head>Speed</Table.Head>
								<Table.Head>Returns</Table.Head>
								<Table.Head>Best For</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							<Table.Row>
								<Table.Cell class="font-medium">hasGPSData()</Table.Cell>
								<Table.Cell>
									<div class="flex items-center gap-1">
										<div class="w-2 h-2 bg-green-500 rounded-full"></div>
										Ultra Fast (1-5ms)
									</div>
								</Table.Cell>
								<Table.Cell><code>boolean</code></Table.Cell>
								<Table.Cell>Pre-filtering, UI state, batch analysis</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell class="font-medium">extractGPSOnly()</Table.Cell>
								<Table.Cell>
									<div class="flex items-center gap-1">
										<div class="w-2 h-2 bg-blue-500 rounded-full"></div>
										Fast (5-30ms)
									</div>
								</Table.Cell>
								<Table.Cell><code>&#123; gps, hasGPS &#125;</code></Table.Cell>
								<Table.Cell>Location features, mapping, geofencing</Table.Cell>
							</Table.Row>
							<Table.Row>
								<Table.Cell class="font-medium">extractImageMetadata()</Table.Cell>
								<Table.Cell>
									<div class="flex items-center gap-1">
										<div class="w-2 h-2 bg-orange-500 rounded-full"></div>
										Slower (20-200ms)
									</div>
								</Table.Cell>
								<Table.Cell><code>ImageMetadata</code></Table.Cell>
								<Table.Cell>Complete analysis, detailed information</Table.Cell>
							</Table.Row>
						</Table.Body>
					</Table.Root>
				</Card.Content>
			</Card.Root>
		</section>

		<!-- Error Handling -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Error Handling</h2>
			
			<p>This method rarely fails and returns false for any issues. For comprehensive error codes and handling patterns, see the <a href="/docs/api-reference/error-codes#metadata-extraction-errors" class="text-primary hover:underline">Metadata Extraction Errors</a> section.</p>

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
						<li>Use this as a pre-filter before <code>extractGPSOnly()</code> to avoid unnecessary processing</li>
						<li>Perfect for showing/hiding location UI elements (map icons, location badges) in image galleries</li>
						<li>Process batches with <code>Promise.all()</code> for parallel execution on multiple images</li>
						<li>Cache results when checking the same images repeatedly to improve performance</li>
						<li>This method never throws - it returns false on any error, making it safe for UI logic</li>
					</ul>
				</Card.Content>
			</Card.Root>
		</section>

	</div>
</DocPage>
