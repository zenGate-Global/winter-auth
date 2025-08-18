#!/usr/bin/env bun

import { readFileSync } from 'fs';
import { join } from 'path';
import {
  extractGPSOnly,
  extractImageMetadata,
  hasGPSData,
  type ImageMetadata
} from '../src/modules/image-metadata';

const TEST_IMAGES = [
  '1.jpg', '2.jpg', '3.jpg', '4.jpg',
];

const formatGPS = (gps: any) => {
  if (!gps) return '❌ No GPS data';
  
  return `📍 ${gps.latitude.toFixed(6)}, ${gps.longitude.toFixed(6)}${
    gps.altitude ? ` (${gps.altitude.toFixed(1)}m)` : ''
  }`;
};

const formatCamera = (camera: any) => {
  const parts = [];
  
  if (camera.make && camera.model) {
    parts.push(`📷 ${camera.make} ${camera.model}`);
  }
  
  if (camera.iso) parts.push(`ISO ${camera.iso}`);
  if (camera.aperture) parts.push(`f/${camera.aperture}`);
  if (camera.shutterSpeed) parts.push(`${camera.shutterSpeed}`);
  if (camera.focalLength) parts.push(`${camera.focalLength}mm`);
  
  return parts.length > 0 ? parts.join(' • ') : '📷 No camera info';
};

const formatImage = (image: any) => {
  const parts = [];
  
  if (image.width && image.height) {
    parts.push(`🖼️ ${image.width}×${image.height}`);
  }
  
  if (image.colorSpace) parts.push(`${image.colorSpace}`);
  if (image.orientation) parts.push(`Orientation: ${image.orientation}`);
  
  return parts.length > 0 ? parts.join(' • ') : '🖼️ No image info';
};

const logRawData = (metadata: ImageMetadata) => {
  console.log('\n🔍 RAW EXTRACTED DATA:');
  console.log('─'.repeat(50));
  
  console.log('\n📍 GPS Object:');
  console.log(JSON.stringify(metadata.gps, null, 2));
  
  console.log('\n📷 Camera Object:');
  console.log(JSON.stringify(metadata.camera, null, 2));
  
  console.log('\n🖼️ Image Object:');
  console.log(JSON.stringify(metadata.image, null, 2));
  
  console.log('\n📅 DateTime Object:');
  console.log(JSON.stringify(metadata.dateTime, null, 2));
  
  console.log('\n📋 Additional Properties:');
  console.log(`hasGPS: ${metadata.hasGPS}`);
  console.log(`fileName: ${metadata.fileName}`);
  console.log(`fileSize: ${metadata.fileSize} bytes`);
  
  console.log('\n🗂️ All Available Properties:');
  Object.keys(metadata).forEach(key => {
    if (!['gps', 'camera', 'image', 'dateTime'].includes(key)) {
      console.log(`${key}: ${JSON.stringify((metadata as any)[key])}`);
    }
  });
};

const testImage = async (fileName: string) => {
  console.log(`\n🔍 Testing: ${fileName}`);
  console.log('='.repeat(50));
  
  try {
    const imagePath = join(process.cwd(), 'tests', fileName);
    const imageData = readFileSync(imagePath);
    const imageBuffer = imageData.buffer.slice(
      imageData.byteOffset,
      imageData.byteOffset + imageData.byteLength
    );
    
    const imageFile = new File([new Uint8Array(imageBuffer)], fileName, {
      type: `image/${fileName.split('.').pop()}`
    });
    
    console.log(`📁 File size: ${(imageFile.size / 1024).toFixed(1)} KB`);
    
    console.log('\n1️⃣ Quick GPS Check:');
    const hasGPS = await hasGPSData(imageFile);
    console.log(`   ${hasGPS ? '✅ Has GPS data' : '❌ No GPS data'}`);
    
    console.log('\n2️⃣ GPS-Only Extraction:');
    const gpsResult = await extractGPSOnly(imageFile);
    console.log(`   ${formatGPS(gpsResult.gps)}`);
    
    console.log('\n3️⃣ Full Metadata Extraction:');
    const fullResult = await extractImageMetadata(imageFile, {
      includeRawExif: false,
      validateGPS: true
    });
    
    if (fullResult.success && fullResult.data) {
      const { gps, camera, image, dateTime } = fullResult.data;
      
      console.log(`   ${formatGPS(gps)}`);
      console.log(`   ${formatCamera(camera)}`);
      console.log(`   ${formatImage(image)}`);
      
      if (dateTime.dateTimeOriginal) {
        console.log(`   📅 Taken: ${dateTime.dateTimeOriginal}`);
      }
      
      if (dateTime.dateTime) {
        console.log(`   📅 Modified: ${dateTime.dateTime}`);
      }
      
      console.log('\n📊 Technical Details:');
      if (camera.software) console.log(`   Software: ${camera.software}`);
      if (camera.lensModel) console.log(`   Lens: ${camera.lensModel}`);
      if (camera.flash) console.log(`   Flash: ${camera.flash}`);
      if (camera.whiteBalance) console.log(`   White Balance: ${camera.whiteBalance}`);
      
      if (image.xResolution && image.yResolution) {
        console.log(`   Resolution: ${image.xResolution}×${image.yResolution} DPI`);
      }
      
      logRawData(fullResult.data);
      
    } else {
      console.log(`   ❌ Error: ${fullResult.error?.message}`);
      console.log(`   ❌ Type: ${fullResult.error?.type}`);
    }
    
    console.log('\n⚡ Performance Test:');
    
    const start1 = performance.now();
    await hasGPSData(imageFile);
    const time1 = performance.now() - start1;
    
    const start2 = performance.now();
    await extractGPSOnly(imageFile);
    const time2 = performance.now() - start2;
    
    const start3 = performance.now();
    await extractImageMetadata(imageFile);
    const time3 = performance.now() - start3;
    
    console.log(`   hasGPSData(): ${time1.toFixed(1)}ms`);
    console.log(`   extractGPSOnly(): ${time2.toFixed(1)}ms`);
    console.log(`   extractImageMetadata(): ${time3.toFixed(1)}ms`);
    
    console.log('\n🔧 Full Extraction with Raw EXIF:');
    const rawResult = await extractImageMetadata(imageFile, {
      includeRawExif: true,
      validateGPS: true
    });
    
    if (rawResult.success && rawResult.data?.rawExif) {
      console.log('📋 Raw EXIF Keys Available:');
      Object.keys(rawResult.data.rawExif).forEach(key => {
        const section = rawResult.data!.rawExif![key];
        if (typeof section === 'object' && section !== null) {
          console.log(`   ${key}: ${Object.keys(section).length} properties`);
        }
      });
      
      console.log('\n🔍 Sample Raw EXIF Data (first 5 entries):');
      const sampleKeys = Object.keys(rawResult.data.rawExif).slice(0, 5);
      sampleKeys.forEach(key => {
        console.log(`   ${key}:`, JSON.stringify(rawResult.data!.rawExif![key], null, 4));
      });
    }
    
  } catch (error) {
    console.log(`❌ Failed to test ${fileName}:`);
    console.log(`   ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

const testFallbackScenario = async () => {
  console.log('\n🌐 Frontend Fallback Scenario Test');
  console.log('='.repeat(50));
  
  for (const fileName of TEST_IMAGES) {
    try {
      const imagePath = join(process.cwd(), 'tests', fileName);
      const imageData = readFileSync(imagePath);
      const imageFile = new File([new Uint8Array(imageData)], fileName, {
        type: `image/${fileName.split('.').pop()}`
      });
      
      const hasLocation = await hasGPSData(imageFile);
      
      console.log(`\n📱 ${fileName}:`);
      if (hasLocation) {
        console.log('   ✅ Image has GPS - can use for location tagging');
        const { gps } = await extractGPSOnly(imageFile);
        console.log(`   📍 Location: ${gps?.latitude}, ${gps?.longitude}`);
        console.log('   💡 Frontend can use this location data directly');
      } else {
        console.log('   ❌ No GPS in image');
        console.log('   💡 Frontend should request user location permission');
        console.log('   🔄 Example: navigator.geolocation.getCurrentPosition()');
        console.log('   📱 Show UI: "Allow location access to tag this photo"');
      }
      
    } catch (error) {
      console.log(`   ❌ Error processing ${fileName}`);
    }
  }
};

const main = async () => {
  console.log('🧪 Image Metadata Extraction - Local Test Runner');
  console.log('='.repeat(60));
  
  console.log('\n📋 Available test images:');
  for (const fileName of TEST_IMAGES) {
    console.log(`   • ${fileName}`);
  }
  
  for (const fileName of TEST_IMAGES) {
    await testImage(fileName);
  }
  
  await testFallbackScenario();
  
  console.log('\n✅ All metadata tests completed!');
};

main().catch(console.error);

export default main; 