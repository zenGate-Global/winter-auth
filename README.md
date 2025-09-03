# Winter Auth

TypeScript library for biometric authentication and image metadata extraction for verifiable credentials.

## Installation and Setup

[Documentation](https://winter-auth.vercel.app/)

## Local Dev

```bash
# Development
npm run dev

# Development for Documentation
# Needs to have the library builded locally, for that you can use

npm run build:watch

npm run dev:web


```

### Environment Variables for /web

```bash
# AWS Rekognition
WAUTH_PROVIDER=aws
WAUTH_ACCESS_KEY=AKI...123
WAUTH_SECRET_KEY=vHe...c0m
WAUTH_AWS_REGION=us-east-1
#
```

## Architecture

- **Authorization Module**: Face verification with AWS Rekognition
  -- **Dual Mode**: Direct (server) and proxy (client) operation modes
- **Metadata Extractor**: EXIF/GPS data extraction from images

## Project Structure

```
src/
├── modules/
│   ├── authorization/          # Face verification
│   └── image-metadata/         # EXIF/GPS extraction
├── types/                      # TypeScript definitions
└── utils/                      # Shared utilities
│
tests/                          # Images to run build tests
└
web/                            # Documentation on Svelte
└
```

## Documentation

Comprehensive documentation available at module level:

- **[Provider Configuration](https://github.com/zenGate-Global/winter-auth/blob/main/src/modules/authorization/providers/README.md)** - AWS Rekognition configuration
- **[Metadata Extraction](https://github.com/zenGate-Global/winter-auth/blob/main/src/modules/image-metadata/README.md)** - EXIF/GPS data extraction guide

## API Reference

### Core Methods

| Method                   | Description             | Returns                     |
| ------------------------ | ----------------------- | --------------------------- |
| `compareByImage()`       | Compare two face images | `Promise<ComparisonResult>` |
| `compareByLiveVideo()`   | Live video verification | `Promise<VideoResult>`      |
| `checkImageQuality()`    | Assess image quality    | `Promise<QualityResult>`    |
| `extractImageMetadata()` | Extract EXIF/GPS data   | `Promise<MetadataResult>`   |

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Test specific module
npm run test:metadata
```

## Repository

- **GitHub**: [zenGate-Global/winter-auth](https://github.com/zenGate-Global/winter-auth)
- **Issues**: [Report bugs](https://github.com/zenGate-Global/winter-auth/issues)
- **NPM**: [@zengate/winter-auth](https://www.npmjs.com/package/@zengate/winter-auth)
