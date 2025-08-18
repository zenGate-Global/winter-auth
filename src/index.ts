export * from "./modules/authorization/index";
export * from "./modules/image-metadata/index";
// Re-export only image metadata related utilities to prevent duplicate biometric types
export type {
  GPSCoordinates,
  CameraInfo,
  ImageInfo,
  DateTimeInfo,
  ImageMetadata,
  MetadataExtractionOptions,
  MetadataExtractionResult,
  MetadataExtractionError,
  MetadataExtractionResult as ImageMetadataExtractionResult
} from "./utils/types";

