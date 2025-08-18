# Face Recognition Providers Setup Guide

This directory contains provider implementations for different face recognition services. Each provider implements the same interface to ensure consistency across services.

## 🎯 Quick Setup

### 1. Choose Your Provider
Set the environment variable:
```bash
WAUTH_PROVIDER=aws
```

### 2. Configure API Keys
Follow the provider-specific setup guide below.

## 🔧 Provider-Specific Setup

### AWS Rekognition (Recommended)

**Best for**: Production use, excellent accuracy, generous free tier

#### Step 1: Create AWS Account
1. Go to https://aws.amazon.com/
2. Click **"Create an AWS Account"**
3. Complete registration (you'll get $300 in credits if you're new)

#### Step 2: Create IAM User for API Access
1. **Go to IAM Console**: https://console.aws.amazon.com/iam/
2. Click **"Users"** in left sidebar
3. Click **"Create user"** button
4. **Username**: `winter-authenticator-api` (or any name you prefer)
5. Click **"Next"**

#### Step 3: Set Permissions
1. Choose **"Attach policies directly"**
2. Search and select: **`AmazonRekognitionFullAccess`**
3. Click **"Next"** → **"Create user"**

#### Step 4: Create API Keys ⚠️ **CRITICAL STEP**
1. Click on your newly created username
2. Click the **"Security credentials"** tab
3. Scroll down to **"Access keys"** section
4. Click **"Create access key"** button
5. **Use case**: Select **"Application running outside AWS"**
6. Check the confirmation box
7. Click **"Next"**
8. **IMMEDIATELY** click **"Download .csv file"**
9. **Save this file safely** - you can't get the secret key again!

#### Step 5: Set Environment Variables
From your downloaded CSV file, set:
```bash
WAUTH_PROVIDER=aws
WAUTH_ACCESS_KEY=AKIA... (your Access Key ID)
WAUTH_SECRET_KEY=wJalrXUtn... (your Secret Access Key)
WAUTH_AWS_REGION=us-east-1 (optional, defaults to us-east-1)
```

#### Step 6: Verify Setup
1. **Test Access**: https://console.aws.amazon.com/rekognition/
2. Go to Rekognition console to verify it's available

#### 💰 AWS Pricing
- **Free Tier**: 5,000 API calls per month for 12 months
- **Paid**: $0.001 per image (first 1M images)
- **Face Comparison**: Only charged for the source image (1 call per comparison)

---

### Other Providers (Coming Soon)

Additional providers like Azure Face API, Google Vision, and Kairos are planned for future releases. The architecture is designed to easily support multiple providers through the same interface.

---

## 🚀 Usage

Once configured, the library will automatically use your chosen provider:

```typescript
import { WinterAuthenticator } from './winter-authenticator';

// The library automatically reads environment variables
const wauth = new WinterAuthenticator();

// All methods work the same regardless of provider
const result = await wauth.compareByImage(referenceImage, targetImage);
const quality = await wauth.checkImageQuality(image);
const liveResult = await wauth.compareByLiveVideo(referenceImage, videoElement);
```

## 🔍 Troubleshooting

### Environment Variables Not Found
- **Browser**: Set variables on `window` object: `window.WAUTH_PROVIDER = 'aws'`
- **Node.js**: Use `.env` file or set in shell: `export WAUTH_PROVIDER=aws`
- **React/Next.js**: Use `.env.local` file with `NEXT_PUBLIC_` prefix for browser access

### AWS Errors
- **Invalid credentials**: Double-check Access Key ID and Secret Access Key
- **Access denied**: Ensure user has `AmazonRekognitionFullAccess` policy
- **Region issues**: Provider uses hardcoded `us-east-1` region

### Azure Errors
- **Invalid endpoint**: Ensure endpoint URL includes protocol (`https://`)
- **Quota exceeded**: Check your Azure pricing tier limits

### General Issues
- **Provider not found**: Check `WAUTH_PROVIDER` value matches supported providers
- **Network errors**: Verify internet connection and API service status

## 📋 Supported Providers

| Provider | Status | Best For | Free Tier |
|----------|--------|----------|-----------|
| AWS Rekognition | ✅ Ready | Production, accuracy | 5,000 calls/month |
| Azure Face API | 🔜 Coming Soon | Enterprise | 30,000 calls/month |
| Google Vision | 🔜 Coming Soon | Google Cloud users | 1,000 calls/month |
| Kairos | 🔜 Coming Soon | Privacy-focused | Limited |

## 🛠️ Adding New Providers

To add a new provider:

1. Create `your-provider.ts` extending `BaseFaceRecognitionProvider`
2. Implement all required methods
3. Add to `provider-factory.ts`
4. Update this README with setup instructions

See `aws-rekognition.ts` as a reference implementation.