import type { GPSCoordinates } from './types';

/**
 * Converts DMS (Degrees, Minutes, Seconds) to decimal degrees
 * @param degrees - Degrees value
 * @param minutes - Minutes value  
 * @param seconds - Seconds value
 * @param direction - Direction (N, S, E, W)
 * @returns Decimal degrees value
 */
export const dmsToDecimal = (
  degrees: number,
  minutes: number,
  seconds: number,
  direction: string
): number => {
  let decimal = degrees + minutes / 60 + seconds / 3600;
  
  if (direction === 'S' || direction === 'W') {
    decimal = -decimal;
  }
  
  return decimal;
};

/**
 * Parses GPS coordinates from EXIF data
 * @param gpsData - GPS data from EXIF (can be raw or processed)
 * @returns Parsed GPS coordinates or null if invalid
 */
export const parseGPSCoordinates = (gpsData: any): GPSCoordinates | null => {
  try {
    if (!gpsData) return null;

    // Check if ExifReader already processed the GPS data (expanded mode)
    if (gpsData.Latitude !== undefined && gpsData.Longitude !== undefined) {
      const latitude = parseFloat(gpsData.Latitude);
      const longitude = parseFloat(gpsData.Longitude);
      
      if (isNaN(latitude) || isNaN(longitude)) return null;
      if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;

      const result: GPSCoordinates = {
        latitude,
        longitude
      };

      if (gpsData.Altitude !== undefined) {
        const altitude = parseFloat(gpsData.Altitude);
        if (!isNaN(altitude)) {
          result.altitude = altitude;
        }
      }

      return result;
    }

    // Fallback to raw GPS data parsing
    const {
      GPSLatitude,
      GPSLongitude,
      GPSLatitudeRef,
      GPSLongitudeRef,
      GPSAltitude,
      GPSAltitudeRef
    } = gpsData;

    if (!GPSLatitude || !GPSLongitude || !GPSLatitudeRef || !GPSLongitudeRef) {
      return null;
    }

    const latArray = GPSLatitude.description || GPSLatitude;
    const latRef = GPSLatitudeRef.description || GPSLatitudeRef;
    const lngArray = GPSLongitude.description || GPSLongitude;
    const lngRef = GPSLongitudeRef.description || GPSLongitudeRef;

    let latitude: number;
    let longitude: number;

    if (Array.isArray(latArray) && latArray.length >= 3) {
      latitude = dmsToDecimal(latArray[0], latArray[1], latArray[2], latRef);
    } else if (typeof latArray === 'number') {
      latitude = latRef === 'S' ? -latArray : latArray;
    } else {
      const latString = String(latArray);
      const latMatch = latString.match(/(\d+)°?\s*(\d+)'?\s*(\d+(?:\.\d+)?)?"?/);
      if (latMatch?.[1] && latMatch[2] && latMatch[3]) {
        latitude = dmsToDecimal(
          parseFloat(latMatch[1]),
          parseFloat(latMatch[2]),
          parseFloat(latMatch[3]),
          latRef
        );
      } else {
        return null;
      }
    }

    if (Array.isArray(lngArray) && lngArray.length >= 3) {
      longitude = dmsToDecimal(lngArray[0], lngArray[1], lngArray[2], lngRef);
    } else if (typeof lngArray === 'number') {
      longitude = lngRef === 'W' ? -lngArray : lngArray;
    } else {
      const lngString = String(lngArray);
      const lngMatch = lngString.match(/(\d+)°?\s*(\d+)'?\s*(\d+(?:\.\d+)?)?"?/);
      if (lngMatch?.[1] && lngMatch[2] && lngMatch[3]) {
        longitude = dmsToDecimal(
          parseFloat(lngMatch[1]),
          parseFloat(lngMatch[2]),
          parseFloat(lngMatch[3]),
          lngRef
        );
      } else {
        return null;
      }
    }

    if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      return null;
    }

    const result: GPSCoordinates = {
      latitude,
      longitude,
      latitudeRef: latRef,
      longitudeRef: lngRef
    };

    if (GPSAltitude) {
      const altValue = GPSAltitude.description || GPSAltitude;
      const altRef = GPSAltitudeRef?.description || GPSAltitudeRef;
      
      if (typeof altValue === 'number') {
        result.altitude = altRef === '1' ? -altValue : altValue;
      } else if (typeof altValue === 'string') {
        const altitude = parseFloat(altValue);
        if (!isNaN(altitude)) {
          result.altitude = altRef === '1' ? -altitude : altitude;
        }
      }
    }

    return result;
  } catch (error) {
    console.warn('Error parsing GPS coordinates:', error);
    return null;
  }
};

/**
 * Safely extracts a string value from EXIF data
 * @param value - Raw EXIF value
 * @returns Cleaned string value or undefined
 */
export const safeExtractString = (value: any): string | undefined => {
  if (!value) return undefined;
  
  if (typeof value === 'string') {
    return value.trim();
  }
  
  if (value.description) {
    return String(value.description).trim();
  }
  
  if (value.value !== undefined) {
    return String(value.value).trim();
  }
  
  return String(value).trim();
};

/**
 * Safely extracts a numeric value from EXIF data
 * @param value - Raw EXIF value
 * @returns Numeric value or undefined
 */
export const safeExtractNumber = (value: any): number | undefined => {
  if (!value && value !== 0) return undefined;
  
  if (typeof value === 'number') {
    return value;
  }
  
  let numValue: number;
  
  if (value.description) {
    numValue = parseFloat(value.description);
  } else if (value.value !== undefined) {
    numValue = parseFloat(value.value);
  } else {
    numValue = parseFloat(String(value));
  }
  
  return isNaN(numValue) ? undefined : numValue;
};

/**
 * Formats shutter speed from EXIF data
 * @param value - Raw shutter speed value
 * @returns Formatted shutter speed string
 */
export const formatShutterSpeed = (value: unknown): string | undefined => {
  if (!value) return undefined;
  
  const stringValue = safeExtractString(value);
  if (!stringValue) return undefined;
  
  // If it's already formatted, return as is
  if (stringValue.includes('/') || stringValue.includes('s')) {
    return stringValue;
  }
  
  const numValue = parseFloat(stringValue);
  if (isNaN(numValue)) return stringValue;
  
  // Convert to fraction if less than 1
  if (numValue < 1 && numValue > 0) {
    const denominator = Math.round(1 / numValue);
    return `1/${denominator}s`;
  }
  
  return `${numValue}s`;
};

/**
 * Validates file type for metadata extraction
 * @param fileName - Name of the file
 * @returns Whether the file type is supported
 */ 
export const isValidImageFile = (fileName: string): boolean => {
  const supportedExtensions = ['.jpg', '.jpeg', '.tiff', '.tif', '.heic', '.heif'];
  const extension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  return supportedExtensions.includes(extension);
}; 