import ExifReader from 'exifreader';
import {
  formatShutterSpeed,
  isValidImageFile, 
  parseGPSCoordinates,
  safeExtractNumber,
  safeExtractString
} from '../../utils/metadata-helpers';
import {
  type ImageMetadata,
  MetadataExtractionError, 
  type MetadataExtractionOptions,
  type MetadataExtractionResult
} from '../../utils/types';

/**
 * Extracts comprehensive metadata from an image file
 * @param imageFile - The image file (File object or ArrayBuffer)
 * @param options - Extraction options
 * @returns Promise containing metadata extraction result
 */
export const extractImageMetadata = async (
  imageFile: File | ArrayBuffer,
  options: MetadataExtractionOptions = {}
): Promise<MetadataExtractionResult> => {
  try {
    if (!imageFile) {
      return {
        success: false,
        data: null,
        error: {
          type: MetadataExtractionError.INVALID_FILE,
          message: 'No image file provided'
        }
      };
    }

    let buffer: ArrayBuffer;
    let fileName: string | undefined;
    let fileSize: number | undefined;

    if (imageFile instanceof File) {
      fileName = imageFile.name;
      fileSize = imageFile.size;

      if (!isValidImageFile(fileName)) {
        return {
          success: false,
          data: null,
          error: {
            type: MetadataExtractionError.UNSUPPORTED_FORMAT,
            message: `Unsupported file format: ${fileName}`
          }
        };
      }

      buffer = await imageFile.arrayBuffer();
    } else {
      buffer = imageFile;
    }

    let exifData: any;
    try {
      exifData = ExifReader.load(buffer, { expanded: true });
    } catch (error) {
      return {
        success: false,
        data: null,
        error: {
          type: MetadataExtractionError.CORRUPTED_DATA,
          message: `Failed to read EXIF data: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      };
    }

    if (!exifData || Object.keys(exifData).length === 0) {
      return {
        success: false,
        data: null,
        error: {
          type: MetadataExtractionError.NO_EXIF_DATA,
          message: 'No EXIF data found in image'
        }
      };
    }

    const gpsData = exifData.gps;
    const gps = parseGPSCoordinates(gpsData);

    if (options.validateGPS && gps) {
      if (Math.abs(gps.latitude) > 90 || Math.abs(gps.longitude) > 180) {
        return {
          success: false,
          data: null,
          error: {
            type: MetadataExtractionError.GPS_PARSING_ERROR,
            message: 'Invalid GPS coordinates detected'
          }
        };
      }
    }

    const exif = exifData.exif || exifData.Exif || {};
    const ifd0 = exifData.ifd0 || exifData.Image || {};

    const camera = {
      make: safeExtractString(ifd0.Make),
      model: safeExtractString(ifd0.Model),
      software: safeExtractString(ifd0.Software),
      lensModel: safeExtractString(exif.LensModel),
      iso: safeExtractNumber(exif.ISO || exif.ISOSpeedRatings),
      aperture: safeExtractNumber(exif.FNumber || exif.ApertureValue),
      shutterSpeed: formatShutterSpeed(exif.ExposureTime || exif.ShutterSpeedValue),
      focalLength: safeExtractNumber(exif.FocalLength),
      flash: safeExtractString(exif.Flash),
      whiteBalance: safeExtractString(exif.WhiteBalance)
    };

    const image = {
      width: safeExtractNumber(exif.ExifImageWidth || ifd0.ImageWidth),
      height: safeExtractNumber(exif.ExifImageHeight || ifd0.ImageLength),
      colorSpace: safeExtractString(exif.ColorSpace),
      orientation: safeExtractNumber(ifd0.Orientation),
      xResolution: safeExtractNumber(ifd0.XResolution),
      yResolution: safeExtractNumber(ifd0.YResolution),
      bitsPerSample: safeExtractNumber(ifd0.BitsPerSample)
    };

    const dateTime = {
      dateTimeOriginal: safeExtractString(exif.DateTimeOriginal),
      dateTime: safeExtractString(ifd0.DateTime),
      dateTimeDigitized: safeExtractString(exif.DateTimeDigitized),
      offsetTime: safeExtractString(exif.OffsetTime || exif.OffsetTimeOriginal)
    };

    const metadata: ImageMetadata = {
      gps,
      camera,
      image,
      dateTime,
      hasGPS: gps !== null,
      fileName,
      fileSize
    };

    if (options.includeRawExif) {
      metadata.rawExif = exifData;
    }

    return {
      success: true,
      data: metadata
    };

  } catch (error) {
    return {
      success: false,
      data: null,
      error: {
        type: MetadataExtractionError.CORRUPTED_DATA,
        message: `Unexpected error during metadata extraction: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    };
  }
};

/**
 * Extracts only GPS coordinates from an image file (lightweight version)
 * @param imageFile - The image file (File object or ArrayBuffer)
 * @returns Promise containing GPS coordinates or null
 */
export const extractGPSOnly = async (
  imageFile: File | ArrayBuffer
): Promise<{ gps: any; hasGPS: boolean }> => {
  try {
    let buffer: ArrayBuffer;

    if (imageFile instanceof File) {
      buffer = await imageFile.arrayBuffer();
    } else {
      buffer = imageFile;
    }

    const exifData = ExifReader.load(buffer, { 
      expanded: true,
      includeUnknown: false
    });

    const gpsData = exifData.gps;
    const gps = parseGPSCoordinates(gpsData);

    return {
      gps,
      hasGPS: gps !== null
    };
  } catch (error) {
    console.warn('Error extracting GPS data:', error);
    return {
      gps: null,
      hasGPS: false
    };
  }
};

/**
 * Checks if an image file contains GPS metadata without full extraction
 * @param imageFile - The image file to check
 * @returns Promise indicating whether GPS data is present
 */
export const hasGPSData = async (imageFile: File | ArrayBuffer): Promise<boolean> => {
  const result = await extractGPSOnly(imageFile);
  return result.hasGPS;
}; 