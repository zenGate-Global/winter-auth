# Image Metadata Extraction Module

The Image Metadata module provides comprehensive metadata extraction from image files, with a special focus on GPS location data and camera information. This module is essential for applications that need to process image metadata, extract location information, or handle cases where GPS data is unavailable.

## Features

- 📍 **GPS Location Extraction**: Extracts precise latitude, longitude, and altitude from image EXIF data
- 📷 **Camera Information**: Retrieves camera make, model, settings (ISO, aperture, shutter speed, etc.)
- 🖼️ **Image Properties**: Width, height, orientation, color space, and resolution
- 📅 **Date/Time Information**: When the photo was taken, created, and digitized
- 🔍 **Flexible Input**: Supports both File objects and ArrayBuffer
- ⚡ **Performance Options**: Lightweight GPS-only extraction for better performance
- 🛡️ **Error Handling**: Comprehensive error types and validation
- 🌐 **Browser Compatible**: Works in modern browsers with proper fallbacks

## Installation

The module is part of the `@zengate/winter-auth` package:

```bash
npm install @zengate/winter-auth
# or
pnpm install @zengate/winter-auth
# or
bun install @zengate/winter-auth
```

## Quick Start

```typescript
import { extractImageMetadata, hasGPSData } from '@zengate/winter-auth';

// Basic usage with file input
const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  
  if (!file) return;
  
  // Check if image has GPS data first
  const hasLocation = await hasGPSData(file);
  
  if (!hasLocation) {
    // Request user location permission as fallback
    console.log('No GPS in image - requesting user location');
    // Your location permission logic here
    return;
  }
  
  // Extract full metadata
  const result = await extractImageMetadata(file);
  
  if (result.success && result.data) {
    console.log('📍 Location:', result.data.gps);
    console.log('📷 Camera:', result.data.camera.make, result.data.camera.model);
    console.log('🖼️ Dimensions:', result.data.image.width, 'x', result.data.image.height);
  } else {
    console.error('Failed to extract metadata:', result.error?.message);
  }
};
```

## API Reference

### Main Functions

#### `extractImageMetadata(imageFile, options?)`

Extracts comprehensive metadata from an image file.

**Parameters:**
- `imageFile`: `File | ArrayBuffer` - The image file to process
- `options?`: `MetadataExtractionOptions` - Optional extraction configuration

**Returns:** `Promise<MetadataExtractionResult>`

```typescript
interface MetadataExtractionResult {
  success: boolean;
  data: ImageMetadata | null;
  error?: {
    type: MetadataExtractionError;
    message: string;
  };
}
```

**Example:**
```typescript
const result = await extractImageMetadata(file, {
  includeRawExif: true,
  validateGPS: true
});

if (result.success) {
  const { gps, camera, image, dateTime } = result.data!;
  
  // Use extracted data
  if (gps) {
    console.log(`📍 ${gps.latitude}, ${gps.longitude}`);
  }
}
```

#### `extractGPSOnly(imageFile)`

Lightweight function that extracts only GPS coordinates for better performance.

**Parameters:**
- `imageFile`: `File | ArrayBuffer` - The image file to process

**Returns:** `Promise<{ gps: GPSCoordinates | null; hasGPS: boolean }>`

**Example:**
```typescript
const { gps, hasGPS } = await extractGPSOnly(file);

if (hasGPS && gps) {
  console.log(`Location: ${gps.latitude}, ${gps.longitude}`);
} else {
  console.log('No GPS data - use browser geolocation API');
}
```

#### `hasGPSData(imageFile)`

Quickly checks if an image contains GPS metadata without full extraction.

**Parameters:**
- `imageFile`: `File | ArrayBuffer` - The image file to check

**Returns:** `Promise<boolean>`

**Example:**
```typescript
const hasLocation = await hasGPSData(file);

if (!hasLocation) {
  // Show UI to request user location
  showLocationPermissionDialog();
}
```

### Data Types

#### `ImageMetadata`

Complete metadata extracted from an image:

```typescript
interface ImageMetadata {
  gps: GPSCoordinates | null;        // GPS location data
  camera: CameraInfo;                // Camera and shooting info
  image: ImageInfo;                  // Image technical details
  dateTime: DateTimeInfo;            // Date/time information
  rawExif?: Record<string, any>;     // Raw EXIF data (optional)
  hasGPS: boolean;                   // Quick GPS availability flag
  fileName?: string;                 // File name (if File object used)
  fileSize?: number;                 // File size in bytes
}
```

#### `GPSCoordinates`

GPS location information:

```typescript
interface GPSCoordinates {
  latitude: number;          // Latitude in decimal degrees
  longitude: number;         // Longitude in decimal degrees
  altitude?: number;         // Altitude in meters (optional)
  latitudeRef?: string;      // Latitude reference (N/S)
  longitudeRef?: string;     // Longitude reference (E/W)
}
```

#### `CameraInfo`

Camera and shooting parameters:

```typescript
interface CameraInfo {
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
```

#### `MetadataExtractionOptions`

Configuration options for metadata extraction:

```typescript
interface MetadataExtractionOptions {
  includeRawExif?: boolean;      // Include raw EXIF data in result
  validateGPS?: boolean;         // Validate GPS coordinate ranges
  customFields?: string[];       // Custom EXIF fields to extract
}
```

## Error Handling

The module provides comprehensive error handling with specific error types:

```typescript
enum MetadataExtractionError {
  INVALID_FILE = 'INVALID_FILE',
  NO_EXIF_DATA = 'NO_EXIF_DATA',
  UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT',
  CORRUPTED_DATA = 'CORRUPTED_DATA',
  GPS_PARSING_ERROR = 'GPS_PARSING_ERROR'
}
```

**Example error handling:**
```typescript
const result = await extractImageMetadata(file);

if (!result.success) {
  switch (result.error?.type) {
    case MetadataExtractionError.NO_EXIF_DATA:
      console.log('Image has no metadata - showing fallback UI');
      break;
    case MetadataExtractionError.UNSUPPORTED_FORMAT:
      console.log('Unsupported file format');
      break;
    case MetadataExtractionError.CORRUPTED_DATA:
      console.log('File appears to be corrupted');
      break;
    default:
      console.log('Unknown error:', result.error?.message);
  }
}
```

## Supported File Formats

- **JPEG/JPG** (.jpg, .jpeg) - Full support
- **TIFF** (.tiff, .tif) - Full support  
- **HEIC/HEIF** (.heic, .heif) - Full support (modern iOS images)

## Usage Patterns

### 1. Location-Aware Photo Upload

```typescript
const handlePhotoUpload = async (file: File) => {
  // Quick GPS check first
  const hasLocation = await hasGPSData(file);
  
  if (hasLocation) {
    // Extract GPS for automatic tagging
    const { gps } = await extractGPSOnly(file);
    await uploadWithLocation(file, gps);
  } else {
    // Request user permission for location
    const userLocation = await requestUserLocation();
    await uploadWithLocation(file, userLocation);
  }
};
```

### 2. Photo Gallery with Metadata

```typescript
const processGalleryImage = async (file: File) => {
  const result = await extractImageMetadata(file, {
    includeRawExif: false  // Don't need raw data for UI
  });
  
  if (result.success) {
    const { gps, camera, image, dateTime } = result.data!;
    
    return {
      id: generateId(),
      file,
      location: gps,
      cameraMake: camera.make,
      cameraModel: camera.model,
      dimensions: `${image.width}×${image.height}`,
      dateTaken: dateTime.dateTimeOriginal,
      hasLocation: gps !== null
    };
  }
  
  return null;
};
```

### 3. Metadata Analysis Dashboard

```typescript
const analyzeImageBatch = async (files: File[]) => {
  const results = await Promise.all(
    files.map(file => extractImageMetadata(file, {
      includeRawExif: true,
      validateGPS: true
    }))
  );
  
  const stats = {
    totalImages: files.length,
    withGPS: results.filter(r => r.success && r.data?.hasGPS).length,
    cameraModels: new Set(
      results
        .filter(r => r.success && r.data?.camera.model)
        .map(r => r.data!.camera.model)
    ),
    averageFileSize: results
      .filter(r => r.success && r.data?.fileSize)
      .reduce((sum, r) => sum + (r.data!.fileSize || 0), 0) / results.length
  };
  
  return stats;
};
```

## Performance Considerations

1. **Use `hasGPSData()` for quick checks** - Much faster than full extraction
2. **Use `extractGPSOnly()` when you only need location** - Skips heavy camera/image parsing
3. **Set `includeRawExif: false`** unless you need the raw data - Reduces memory usage
4. **Process images in batches** - Use `Promise.all()` for parallel processing
5. **Consider file size limits** - Large images may take longer to process

## Browser Compatibility

- **Modern browsers**: Full support (Chrome 76+, Firefox 69+, Safari 13+)
- **File API**: Required for File object support
- **ArrayBuffer**: Required for buffer processing
- **Async/Await**: Required for the async API

## Common Issues and Solutions

### Issue: "No EXIF data found"
**Solution:** Some images (especially screenshots, edited images, or images from certain apps) may not contain metadata. Always provide fallback options.

### Issue: GPS coordinates seem wrong
**Solution:** Enable GPS validation with `validateGPS: true` option to catch invalid coordinates.

### Issue: Performance is slow with large images
**Solution:** Use `extractGPSOnly()` or `hasGPSData()` for lighter operations when you don't need full metadata.

### Issue: File reading fails in older browsers
**Solution:** Check for File API support before using:

```typescript
if (!window.File || !window.FileReader) {
  console.error('File API not supported');
  return;
}
```

## Testing

Run tests with the provided test image:

```bash
npm test
# or
pnpm test
# or  
bun test
```

The test suite includes:
- ✅ Basic metadata extraction
- ✅ GPS coordinate parsing
- ✅ Error handling
- ✅ File format validation
- ✅ Performance benchmarks
- ✅ Edge cases (corrupted files, missing data)

## Contributing

When contributing to this module:

1. **Add tests** for new functionality
2. **Update TypeScript types** for new data structures
3. **Document new features** in this README
4. **Follow error handling patterns** for consistency
5. **Test with real images** from different devices and cameras

For bug reports or feature requests, please include:
- Sample image files (if possible)
- Expected vs actual behavior
- Browser/environment details
- Error messages or logs 