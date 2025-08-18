<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Table from '$lib/components/ui/table';
	import { MapPin, Zap, Info, Navigation } from '@lucide/svelte';
	import ExtractGPSOnlyDemo from '$lib/components/interactive/ExtractGPSOnlyDemo.svelte';
</script>

<DocPage title="extractGPSOnly()" description="Lightweight GPS extraction for optimal performance when you only need location data">
	
	<p class="text-muted-foreground mb-8">
		The <code>extractGPSOnly()</code> function provides a performance-optimized way to extract only GPS coordinates from image files. This lightweight method skips camera and image metadata parsing for faster processing when you only need location information.
	</p>

	<div class="space-y-8">
		
		<!-- Interactive Demo Section -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Interactive Demo</h2>
			<ExtractGPSOnlyDemo />
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
						code={`extractGPSOnly(
  imageFile: File | ArrayBuffer
): Promise<{ gps: GPSCoordinates | null; hasGPS: boolean }>`}
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
								</Table.Row>
							</Table.Header>
							<Table.Body>
								<Table.Row>
									<Table.Cell class="font-medium">imageFile</Table.Cell>
									<Table.Cell><code>File | ArrayBuffer</code></Table.Cell>
								</Table.Row>
							</Table.Body>
						</Table.Root>
						<p class="text-sm text-muted-foreground mt-3">
							The image file to extract GPS coordinates from.
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Return Value</Card.Title>
					</Card.Header>
					<Card.Content>
						<CodeBlock 
							language="typescript" 
							code={`{
  gps: GPSCoordinates | null;
  hasGPS: boolean;
}`}
						/>
						<p class="text-sm text-muted-foreground mt-3">
							Simple object with GPS data and availability flag.
						</p>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- GPS Coordinates Structure -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">GPS Coordinates Structure</h2>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<MapPin class="h-4 w-4" />
						GPSCoordinates Interface
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<CodeBlock 
						language="typescript" 
						code={`interface GPSCoordinates {
  latitude: number;          // Latitude in decimal degrees (-90 to 90)
  longitude: number;         // Longitude in decimal degrees (-180 to 180)
  altitude?: number;         // Altitude in meters (optional)
  latitudeRef?: string;      // Latitude reference ("N" or "S")
  longitudeRef?: string;     // Longitude reference ("E" or "W")
}

// Example GPS data
{
  gps: {
    latitude: 40.7589,
    longitude: -73.9851,
    altitude: 10.5,
    latitudeRef: "N",
    longitudeRef: "W"
  },
  hasGPS: true
}`}
					/>
				</Card.Content>
			</Card.Root>
		</section>

		<!-- Usage Examples -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Usage Examples</h2>
			
			<Tabs.Root value="basic" class="w-full">
				<Tabs.List class="grid w-full grid-cols-3">
					<Tabs.Trigger value="basic">Basic Usage</Tabs.Trigger>
					<Tabs.Trigger value="batch">Batch Processing</Tabs.Trigger>
					<Tabs.Trigger value="fallback">With Fallback</Tabs.Trigger>
				</Tabs.List>
				
				<Tabs.Content value="basic" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`import { extractGPSOnly } from '@zengate/winter-auth';

// Quick GPS extraction
const checkImageLocation = async (file: File) => {
  const { gps, hasGPS } = await extractGPSOnly(file);
  
  if (hasGPS && gps) {
    console.log(\`📍 Location found: \${gps.latitude}, \${gps.longitude}\`);
    
    if (gps.altitude) {
      console.log(\`⛰️  Altitude: \${gps.altitude}m\`);
    }
    
    // Use coordinates for mapping, geofencing, etc.
    showLocationOnMap(gps.latitude, gps.longitude);
    
  } else {
    console.log('📍 No GPS data found in image');
    // Handle missing GPS gracefully
    requestUserLocation();
  }
};

// Usage with file input
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (file) {
    await checkImageLocation(file);
  }
};`}
					/>
				</Tabs.Content>
				
				<Tabs.Content value="batch" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`// Process multiple images efficiently
const processImageBatch = async (files: File[]) => {
  console.log(\`Processing \${files.length} images for GPS data...\`);
  
  // Process all images in parallel for speed
  const results = await Promise.all(
    files.map(async (file, index) => {
      const { gps, hasGPS } = await extractGPSOnly(file);
      
      return {
        fileName: file.name,
        fileIndex: index,
        hasGPS,
        location: gps ? {
          lat: gps.latitude,
          lng: gps.longitude,
          alt: gps.altitude
        } : null
      };
    })
  );
  
  // Analyze results
  const withLocation = results.filter(r => r.hasGPS);
  const withoutLocation = results.filter(r => !r.hasGPS);
  
  console.log(\`Results: \${withLocation.length} with GPS, \${withoutLocation.length} without\`);
  
  // Group images by location proximity
  const locations = withLocation.map(r => r.location).filter(Boolean);
  const uniqueLocations = groupByProximity(locations, 0.01); // ~1km radius
  
  return {
    totalImages: files.length,
    withGPS: withLocation.length,
    withoutGPS: withoutLocation.length,
    locations: uniqueLocations,
    details: results
  };
};

// Helper function to group nearby locations
const groupByProximity = (locations: Array<{lat: number, lng: number}>, threshold: number) => {
  const groups: Array<{lat: number, lng: number, count: number}> = [];
  
  locations.forEach(loc => {
    const nearby = groups.find(group => 
      Math.abs(group.lat - loc.lat) < threshold && 
      Math.abs(group.lng - loc.lng) < threshold
    );
    
    if (nearby) {
      nearby.count++;
    } else {
      groups.push({ ...loc, count: 1 });
    }
  });
  
  return groups;
};`}
					/>
				</Tabs.Content>
				
				<Tabs.Content value="fallback" class="mt-6">
					<CodeBlock 
						language="typescript" 
						code={`// GPS extraction with fallback to user location
const getImageLocationWithFallback = async (file: File) => {
  try {
    // Try to extract GPS from image first
    const { gps, hasGPS } = await extractGPSOnly(file);
    
    if (hasGPS && gps) {
      return {
        source: 'exif',
        location: {
          latitude: gps.latitude,
          longitude: gps.longitude,
          altitude: gps.altitude,
          accuracy: 'high' // GPS from camera is usually accurate
        },
        timestamp: new Date().toISOString()
      };
    }
    
    // No GPS in image - request user location
    console.log('No GPS in image, requesting user location...');
    
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
    
    return {
      source: 'user',
      location: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        accuracy: position.coords.accuracy ? \`\${Math.round(position.coords.accuracy)}m\` : 'unknown'
      },
      timestamp: new Date(position.timestamp).toISOString()
    };
    
  } catch (geoError) {
    // Both image GPS and user location failed
    console.log('Location unavailable:', geoError);
    
    return {
      source: 'none',
      location: null,
      error: 'Location services unavailable or denied',
      timestamp: new Date().toISOString()
    };
  }
};

// Usage example
const handleImageWithLocation = async (file: File) => {
  const locationData = await getImageLocationWithFallback(file);
  
  switch (locationData.source) {
    case 'exif':
      console.log('✅ Using image GPS data');
      showLocationMessage(\`Photo taken at \${locationData.location?.latitude}, \${locationData.location?.longitude}\`);
      break;
      
    case 'user':
      console.log('📍 Using current user location');
      showLocationMessage(\`Current location: \${locationData.location?.latitude}, \${locationData.location?.longitude}\`);
      break;
      
    case 'none':
      console.log('❌ No location available');
      showLocationMessage('Location not available');
      break;
  }
  
  return locationData;
};`}
					/>
				</Tabs.Content>
			</Tabs.Root>
		</section>

		<!-- Performance Benefits -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Performance Benefits</h2>
			
			<Alert.Root>
				<Zap class="h-4 w-4" />
				<Alert.Title>Optimized for Speed</Alert.Title>
				<Alert.Description>
					This method is 3-5x faster than full metadata extraction when you only need GPS coordinates.
				</Alert.Description>
			</Alert.Root>

			<div class="mt-6 grid gap-4 md:grid-cols-2">
				<Card.Root>
					<Card.Header>
						<Card.Title class="text-green-600">Performance Gains</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-2 text-sm">
							<li><strong>3-5x faster</strong> than full metadata extraction</li>
							<li><strong>Lower memory usage</strong> - skips image/camera parsing</li>
							<li><strong>Minimal CPU overhead</strong> - GPS-specific processing only</li>
							<li><strong>Quick batch processing</strong> - ideal for multiple files</li>
							<li><strong>Early exit</strong> - stops processing once GPS is found</li>
						</ul>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Typical Processing Times</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul class="space-y-2 text-sm">
							<li>Small images (&lt; 1MB): ~5-15ms</li>
							<li>Medium images (1-5MB): ~10-30ms</li>
							<li>Large images (5-20MB): ~20-80ms</li>
							<li>Batch of 10 images: ~50-200ms total</li>
							<li>vs. full extraction: ~200ms-2s per image</li>
						</ul>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- Use Cases -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Common Use Cases</h2>
			
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				<Card.Root>
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							<MapPin class="h-4 w-4" />
							Photo Mapping
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-sm">
							Quickly extract GPS coordinates to plot photos on maps or create location-based galleries.
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title class="flex items-center gap-2">
							<Navigation class="h-4 w-4" />
							Geofencing
						</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-sm">
							Check if photos were taken within specific geographic boundaries or restricted areas.
						</p>
					</Card.Content>
				</Card.Root>

				<Card.Root>
					<Card.Header>
						<Card.Title>Location Analytics</Card.Title>
					</Card.Header>
					<Card.Content>
						<p class="text-sm">
							Analyze location patterns in photo collections without processing full metadata.
						</p>
					</Card.Content>
				</Card.Root>
			</div>
		</section>

		<!-- Real-world Examples -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Real-world Examples</h2>
			
			<Tabs.Root value="gallery" class="w-full">
				<Tabs.List class="grid w-full grid-cols-3">
					<Tabs.Trigger value="gallery">Photo Gallery</Tabs.Trigger>
					<Tabs.Trigger value="travel">Travel Logger</Tabs.Trigger>
					<Tabs.Trigger value="security">Security Check</Tabs.Trigger>
				</Tabs.List>
				
				<Tabs.Content value="gallery" class="mt-6">
					<Card.Root>
						<Card.Header>
							<Card.Title>Location-based Photo Gallery</Card.Title>
						</Card.Header>
						<Card.Content>
							<CodeBlock 
								language="typescript" 
								code={`// Create a photo gallery grouped by location
const createLocationGallery = async (photoFiles: File[]) => {
  const photoData = await Promise.all(
    photoFiles.map(async (file) => {
      const { gps, hasGPS } = await extractGPSOnly(file);
      
      return {
        file,
        name: file.name,
        hasLocation: hasGPS,
        coordinates: gps ? {
          lat: gps.latitude,
          lng: gps.longitude,
          display: \`\${gps.latitude.toFixed(4)}, \${gps.longitude.toFixed(4)}\`
        } : null
      };
    })
  );
  
  // Group photos by location (within ~1km)
  const locationGroups = new Map<string, typeof photoData>();
  const noLocationPhotos: typeof photoData = [];
  
  photoData.forEach(photo => {
    if (!photo.hasLocation || !photo.coordinates) {
      noLocationPhotos.push(photo);
      return;
    }
    
    // Find nearby location group
    const locationKey = \`\${Math.round(photo.coordinates.lat * 100)},\${Math.round(photo.coordinates.lng * 100)}\`;
    
    if (!locationGroups.has(locationKey)) {
      locationGroups.set(locationKey, []);
    }
    locationGroups.get(locationKey)!.push(photo);
  });
  
  return {
    locationGroups: Array.from(locationGroups.entries()).map(([key, photos]) => ({
      locationKey: key,
      location: photos[0]?.coordinates?.display || 'Unknown',
      photoCount: photos.length,
      photos
    })),
    noLocationPhotos,
    totalPhotos: photoFiles.length,
    withLocation: photoData.length - noLocationPhotos.length
  };
};`}
							/>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
				
				<Tabs.Content value="travel" class="mt-6">
					<Card.Root>
						<Card.Header>
							<Card.Title>Travel Route Logger</Card.Title>
						</Card.Header>
						<Card.Content>
							<CodeBlock 
								language="typescript" 
								code={`// Track travel route from photos
const analyzeTravelRoute = async (travelPhotos: File[]) => {
  const locations: Array<{
    coordinates: { lat: number; lng: number };
    fileName: string;
    timestamp: number;
  }> = [];
  
  for (const file of travelPhotos) {
    const { gps, hasGPS } = await extractGPSOnly(file);
    
    if (hasGPS && gps) {
      locations.push({
        coordinates: {
          lat: gps.latitude,
          lng: gps.longitude
        },
        fileName: file.name,
        timestamp: file.lastModified
      });
    }
  }
  
  // Sort by timestamp to create chronological route
  locations.sort((a, b) => a.timestamp - b.timestamp);
  
  // Calculate travel statistics
  let totalDistance = 0;
  const route = locations.map((loc, index) => {
    if (index > 0) {
      const prev = locations[index - 1];
      const distance = calculateDistance(
        prev.coordinates.lat, prev.coordinates.lng,
        loc.coordinates.lat, loc.coordinates.lng
      );
      totalDistance += distance;
    }
    
    return {
      ...loc,
      date: new Date(loc.timestamp).toLocaleDateString(),
      distanceFromPrevious: index > 0 ? calculateDistance(
        locations[index - 1].coordinates.lat,
        locations[index - 1].coordinates.lng,
        loc.coordinates.lat,
        loc.coordinates.lng
      ) : 0
    };
  });
  
  return {
    route,
    totalDistance: Math.round(totalDistance * 100) / 100,
    totalLocations: locations.length,
    dateRange: {
      start: new Date(locations[0]?.timestamp).toLocaleDateString(),
      end: new Date(locations[locations.length - 1]?.timestamp).toLocaleDateString()
    }
  };
};

// Haversine formula for distance calculation
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};`}
							/>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
				
				<Tabs.Content value="security" class="mt-6">
					<Card.Root>
						<Card.Header>
							<Card.Title>Security & Geofencing</Card.Title>
						</Card.Header>
						<Card.Content>
							<CodeBlock 
								language="typescript" 
								code={`// Check if photos were taken in allowed locations
const validatePhotoLocation = async (file: File, allowedZones: Array<{
  name: string;
  center: { lat: number; lng: number };
  radiusKm: number;
}>) => {
  const { gps, hasGPS } = await extractGPSOnly(file);
  
  if (!hasGPS || !gps) {
    return {
      valid: false,
      reason: 'No GPS data found in image',
      requiresManualReview: true
    };
  }
  
  // Check against each allowed zone
  for (const zone of allowedZones) {
    const distance = calculateDistance(
      gps.latitude, gps.longitude,
      zone.center.lat, zone.center.lng
    );
    
    if (distance <= zone.radiusKm) {
      return {
        valid: true,
        zone: zone.name,
        coordinates: { lat: gps.latitude, lng: gps.longitude },
        distanceFromCenter: Math.round(distance * 1000), // meters
        requiresManualReview: false
      };
    }
  }
  
  // Photo taken outside allowed zones
  return {
    valid: false,
    reason: 'Photo taken outside allowed geographic zones',
    coordinates: { lat: gps.latitude, lng: gps.longitude },
    nearestZone: findNearestZone(gps, allowedZones),
    requiresManualReview: true
  };
};

// Example usage for office building security
const validateOfficePhoto = async (photo: File) => {
  const officeZones = [
    {
      name: 'Main Office',
      center: { lat: 40.7589, lng: -73.9851 },
      radiusKm: 0.1 // 100m radius
    },
    {
      name: 'Remote Office',
      center: { lat: 40.7505, lng: -73.9934 },
      radiusKm: 0.05 // 50m radius
    }
  ];
  
  const result = await validatePhotoLocation(photo, officeZones);
  
  if (result.valid) {
    console.log(\`✅ Photo approved - taken at \${result.zone}\`);
  } else {
    console.log(\`❌ Photo flagged: \${result.reason}\`);
    if (result.requiresManualReview) {
      // Flag for manual security review
      flagForSecurityReview(photo, result);
    }
  }
  
  return result;
};`}
							/>
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
			</Tabs.Root>
		</section>

		<!-- Error Handling -->
		<section>
			<h2 class="text-2xl font-semibold mb-4">Error Handling</h2>
			
			<p>The function returns null GPS data when extraction fails. For comprehensive error codes and handling patterns, see <a href="/docs/api-reference/error-codes#metadata-extraction-errors" class="text-primary hover:underline">Metadata Extraction Errors</a>.</p>
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
						<li>Use this method instead of <code>extractImageMetadata()</code> when you only need GPS data - it's 3-5x faster</li>
						<li>Always check the <code>hasGPS</code> flag before accessing coordinates to avoid null reference errors</li>
						<li>Process multiple images in parallel using <code>Promise.all()</code> for batch operations</li>
						<li>Validate coordinates are within valid ranges (latitude: -90 to 90, longitude: -180 to 180)</li>
						<li>Consider falling back to browser geolocation API when GPS data is missing</li>
					</ul>
				</Card.Content>
			</Card.Root>
		</section>

	</div>
</DocPage>
