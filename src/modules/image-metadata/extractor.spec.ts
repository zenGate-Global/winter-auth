import { readFileSync } from 'fs';
import { join } from 'path';
import { beforeAll, describe, expect, it } from 'vitest';
import { MetadataExtractionError } from '../../utils/types';
import {
  extractGPSOnly,
  extractImageMetadata,
  hasGPSData
} from './extractor';

describe('Image Metadata Extractor', () => {
  let testImageBuffer: ArrayBuffer;
  let testImageFile: File;

  beforeAll(async () => {
    // Load the test image
    try {
      const imagePath = join(process.cwd(), 'tests', '1.jpg');
      const imageData = readFileSync(imagePath);
      testImageBuffer = imageData.buffer.slice(
        imageData.byteOffset,
        imageData.byteOffset + imageData.byteLength
      );
      
      // Create a File object for testing
      testImageFile = new File([new Uint8Array(testImageBuffer)], '1.jpg', { type: 'image/jpeg' });
    } catch (error) {
      console.warn('Could not load test image, some tests may fail:', error);
    }
  });

  describe('extractImageMetadata', () => {
    it('should extract metadata from a valid image file', async () => {
      if (!testImageFile) {
        console.warn('Skipping test - no test image available');
        return;
      }

      const result = await extractImageMetadata(testImageFile);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.error).toBeUndefined();
      
      if (result.data) {
        // Check basic structure
        expect(result.data).toHaveProperty('gps');
        expect(result.data).toHaveProperty('camera');
        expect(result.data).toHaveProperty('image');
        expect(result.data).toHaveProperty('dateTime');
        expect(result.data).toHaveProperty('hasGPS');
        expect(result.data).toHaveProperty('fileName');
        expect(result.data).toHaveProperty('fileSize');
        
        // Check file info
        expect(result.data.fileName).toBe('1.jpg');
        expect(result.data.fileSize).toBeGreaterThan(0);
        
        // Check hasGPS flag consistency
        expect(result.data.hasGPS).toBe(result.data.gps !== null);
      }
    });

    it('should extract metadata from ArrayBuffer', async () => {
      if (!testImageBuffer) {
        console.warn('Skipping test - no test image available');
        return;
      }

      const result = await extractImageMetadata(testImageBuffer);
      
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      
      if (result.data) {
        expect(result.data.fileName).toBeUndefined(); // No filename for ArrayBuffer
        expect(result.data.fileSize).toBeUndefined(); // No file size for ArrayBuffer
      }
    });

    it('should include raw EXIF data when requested', async () => {
      if (!testImageFile) {
        console.warn('Skipping test - no test image available');
        return;
      }

      const result = await extractImageMetadata(testImageFile, {
        includeRawExif: true
      });
      
      expect(result.success).toBe(true);
      expect(result.data?.rawExif).toBeDefined();
      expect(typeof result.data?.rawExif).toBe('object');
    });

    it('should not include raw EXIF data by default', async () => {
      if (!testImageFile) {
        console.warn('Skipping test - no test image available');
        return;
      }

      const result = await extractImageMetadata(testImageFile);
      
      expect(result.success).toBe(true);
      expect(result.data?.rawExif).toBeUndefined();
    });

    it('should validate GPS coordinates when requested', async () => {
      if (!testImageFile) {
        console.warn('Skipping test - no test image available');
        return;
      }

      const result = await extractImageMetadata(testImageFile, {
        validateGPS: true
      });
      
      expect(result.success).toBe(true);
      
      if (result.data?.gps) {
        expect(Math.abs(result.data.gps.latitude)).toBeLessThanOrEqual(90);
        expect(Math.abs(result.data.gps.longitude)).toBeLessThanOrEqual(180);
      }
    });

    it('should handle invalid file input', async () => {
      const result = await extractImageMetadata(null as any);
      
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error?.type).toBe(MetadataExtractionError.INVALID_FILE);
    });

    it('should handle unsupported file format', async () => {
      const textFile = new File(['hello world'], 'test.txt', { type: 'text/plain' });
      const result = await extractImageMetadata(textFile);
      
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.error?.type).toBe(MetadataExtractionError.UNSUPPORTED_FORMAT);
    });

    it('should handle corrupted image data', async () => {
      const corruptedBuffer = new ArrayBuffer(10);
      const corruptedFile = new File([new Uint8Array(corruptedBuffer)], 'corrupt.jpg', { type: 'image/jpeg' });
      
      const result = await extractImageMetadata(corruptedFile);
      
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect([
        MetadataExtractionError.CORRUPTED_DATA,
        MetadataExtractionError.NO_EXIF_DATA
      ]).toContain(result.error?.type);
    });
  });

  describe('extractGPSOnly', () => {
    it('should extract GPS data from image file', async () => {
      if (!testImageFile) {
        console.warn('Skipping test - no test image available');
        return;
      }

      const result = await extractGPSOnly(testImageFile);
      
      expect(result).toHaveProperty('gps');
      expect(result).toHaveProperty('hasGPS');
      expect(result.hasGPS).toBe(result.gps !== null);
    });

    it('should extract GPS data from ArrayBuffer', async () => {
      if (!testImageBuffer) {
        console.warn('Skipping test - no test image available');
        return;
      }

      const result = await extractGPSOnly(testImageBuffer);
      
      expect(result).toHaveProperty('gps');
      expect(result).toHaveProperty('hasGPS');
    });

    it('should handle corrupted data gracefully', async () => {
      const corruptedBuffer = new ArrayBuffer(10);
      const result = await extractGPSOnly(corruptedBuffer);
      
      expect(result.gps).toBeNull();
      expect(result.hasGPS).toBe(false);
    });
  });

  describe('hasGPSData', () => {
    it('should check for GPS data in image file', async () => {
      if (!testImageFile) {
        console.warn('Skipping test - no test image available');
        return;
      }

      const hasGPS = await hasGPSData(testImageFile);
      expect(typeof hasGPS).toBe('boolean');
    });

    it('should check for GPS data in ArrayBuffer', async () => {
      if (!testImageBuffer) {
        console.warn('Skipping test - no test image available');
        return;
      }

      const hasGPS = await hasGPSData(testImageBuffer);
      expect(typeof hasGPS).toBe('boolean');
    });

    it('should return false for corrupted data', async () => {
      const corruptedBuffer = new ArrayBuffer(10);
      const hasGPS = await hasGPSData(corruptedBuffer);
      expect(hasGPS).toBe(false);
    });
  });

  describe('GPS parsing edge cases', () => {
    it('should handle images without GPS data', async () => {
      // Create a minimal JPEG without GPS
      const minimalJpeg = new Uint8Array([
        0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46,
        0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00,
        0xFF, 0xD9
      ]);
      
      const file = new File([minimalJpeg], 'no-gps.jpg', { type: 'image/jpeg' });
      const result = await extractImageMetadata(file);
      
      if (result.success) {
        expect(result.data?.gps).toBeNull();
        expect(result.data?.hasGPS).toBe(false);
      }
    });
  });

  describe('Camera and image information extraction', () => {
    it('should extract camera information when available', async () => {
      if (!testImageFile) {
        console.warn('Skipping test - no test image available');
        return;
      }

      const result = await extractImageMetadata(testImageFile);
      
      if (result.success && result.data) {
        const { camera } = result.data;
        
        // Camera object should exist
        expect(camera).toBeDefined();
        expect(typeof camera).toBe('object');
        
        // Properties should be properly typed
        if (camera.make) expect(typeof camera.make).toBe('string');
        if (camera.model) expect(typeof camera.model).toBe('string');
        if (camera.iso) expect(typeof camera.iso).toBe('number');
        if (camera.aperture) expect(typeof camera.aperture).toBe('number');
        if (camera.focalLength) expect(typeof camera.focalLength).toBe('number');
      }
    });

    it('should extract image information when available', async () => {
      if (!testImageFile) {
        console.warn('Skipping test - no test image available');
        return;
      }

      const result = await extractImageMetadata(testImageFile);
      
      if (result.success && result.data) {
        const { image } = result.data;
        
        // Image object should exist
        expect(image).toBeDefined();
        expect(typeof image).toBe('object');
        
        // Properties should be properly typed
        if (image.width) expect(typeof image.width).toBe('number');
        if (image.height) expect(typeof image.height).toBe('number');
        if (image.orientation) expect(typeof image.orientation).toBe('number');
      }
    });

    it('should extract date/time information when available', async () => {
      if (!testImageFile) {
        console.warn('Skipping test - no test image available');
        return;
      }

      const result = await extractImageMetadata(testImageFile);
      
      if (result.success && result.data) {
        const { dateTime } = result.data;
        
        // DateTime object should exist
        expect(dateTime).toBeDefined();
        expect(typeof dateTime).toBe('object');
        
        // Properties should be properly typed
        if (dateTime.dateTimeOriginal) expect(typeof dateTime.dateTimeOriginal).toBe('string');
        if (dateTime.dateTime) expect(typeof dateTime.dateTime).toBe('string');
      }
    });
  });
}); 