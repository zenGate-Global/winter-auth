<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Alert, AlertDescription } from "$lib/components/ui/alert/index.js";
	import { CheckCircle, AlertTriangle, ExternalLink, Key, Shield, Cloud, Settings } from '@lucide/svelte';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
</script>

<DocPage title="AWS Rekognition Provider" description="Setup and configuration guide for AWS Rekognition provider">
	
	<div class="prose max-w-none">
		<p class="lead">
			AWS Rekognition is the primary provider for Winter Authenticator, offering enterprise-grade face detection and comparison capabilities with global scalability.
		</p>

		<h2>Prerequisites</h2>
		
		<div class="not-prose mb-6">
			<Alert>
				<CheckCircle class="h-4 w-4" />
				<AlertDescription>
					You'll need an active AWS account with billing enabled and appropriate IAM permissions to use Rekognition services.
				</AlertDescription>
			</Alert>
		</div>

		<ul>
			<li><strong>AWS Account</strong> - Active account with billing enabled</li>
			<li><strong>IAM User</strong> - With programmatic access and Rekognition permissions</li>
			<li><strong>Region Access</strong> - Rekognition is available in most major AWS regions</li>
			<li><strong>Billing Setup</strong> - Pay-per-use pricing model</li>
		</ul>

		<h2>Step 1: Create IAM User</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Key class="h-5 w-5 text-blue-600" />
						IAM User Creation
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<ol class="text-sm space-y-2">
						<li>1. Open AWS IAM Console</li>
						<li>2. Click "Add user"</li>
						<li>3. Enable "Programmatic access"</li>
						<li>4. Attach permissions (next step)</li>
					</ol>
					<Button href="https://console.aws.amazon.com/iam/" class="mt-4" size="sm">
						<ExternalLink class="h-4 w-4 mr-2" />
						Open IAM Console
					</Button>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Shield class="h-5 w-5 text-green-600" />
						Required Permissions
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-sm space-y-2">
						<div><strong>Policy Name:</strong> AmazonRekognitionFullAccess</div>
						<div><strong>Or Custom Policy:</strong></div>
						<ul class="text-xs space-y-1">
							<li>rekognition:DetectFaces</li>
							<li>rekognition:CompareFaces</li>
							<li>rekognition:IndexFaces</li>
						</ul>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Step 2: Environment Configuration</h2>

		<p>Add your AWS credentials to your environment variables:</p>

		<div class="my-6">
			<CodeBlock language="typescript" code={`# .env or .env.local
WAUTH_PROVIDER=aws
WAUTH_ACCESS_KEY=AKIA...
WAUTH_SECRET_KEY=wJalr...
WAUTH_AWS_REGION=us-east-1

# Optional: Custom confidence thresholds
WAUTH_MIN_CONFIDENCE=0.75
WAUTH_SIMILARITY_THRESHOLD=0.80`} />
		</div>

		<div class="not-prose mb-6">
			<Alert variant="destructive">
				<AlertTriangle class="h-4 w-4" />
				<AlertDescription>
					<strong>Security Notice:</strong> Never commit AWS credentials to version control. Use environment variables or AWS IAM roles in production.
				</AlertDescription>
			</Alert>
		</div>

		<h2>Step 3: Code Implementation</h2>

		<p>Winter Authenticator automatically detects AWS configuration from environment variables:</p>

		<div class="my-6">
			<CodeBlock language="typescript" code={`import { createWinterAuth } from '@zengate/winter-auth';

// Direct mode (server-side only)
const winterAuth = createWinterAuth({
  mode: 'direct'  // Uses environment variables automatically
});

await winterAuth.initialize();

// Manual configuration (optional)
const winterAuth = createWinterAuth({
  mode: 'direct',
  provider: {
    type: 'aws',
    config: {
      accessKeyId: process.env.WAUTH_ACCESS_KEY,
      secretAccessKey: process.env.WAUTH_SECRET_KEY,
      region: process.env.WAUTH_AWS_REGION
    }
  }
});`} />
		</div>

		<h2>Regional Availability</h2>

		<div class="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">Americas</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs space-y-1">
						<div>us-east-1 (N. Virginia)</div>
						<div>us-west-2 (Oregon)</div>
						<div>ca-central-1 (Canada)</div>
						<div>sa-east-1 (São Paulo)</div>
					</div>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">Europe</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs space-y-1">
						<div>eu-west-1 (Ireland)</div>
						<div>eu-west-2 (London)</div>
						<div>eu-central-1 (Frankfurt)</div>
						<div>eu-south-1 (Milan)</div>
					</div>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">Asia Pacific</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs space-y-1">
						<div>ap-southeast-1 (Singapore)</div>
						<div>ap-southeast-2 (Sydney)</div>
						<div>ap-northeast-1 (Tokyo)</div>
						<div>ap-south-1 (Mumbai)</div>
					</div>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">Recommended</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs space-y-1">
						<div><Badge variant="default" class="text-xs">us-east-1</Badge> Fastest</div>
						<div><Badge variant="secondary" class="text-xs">eu-west-1</Badge> Europe</div>
						<div><Badge variant="secondary" class="text-xs">ap-southeast-1</Badge> Asia</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Pricing & Limits</h2>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">Face Detection</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-sm space-y-2">
						<div><strong>First 1M images/month:</strong> $0.001 per image</div>
						<div><strong>Next 9M images/month:</strong> $0.0008 per image</div>
						<div><strong>Over 10M images/month:</strong> $0.0006 per image</div>
					</div>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">Face Comparison</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-sm space-y-2">
						<div><strong>First 1M comparisons/month:</strong> $0.001 per comparison</div>
						<div><strong>Next 9M comparisons/month:</strong> $0.0008 per comparison</div>
						<div><strong>Over 10M comparisons/month:</strong> $0.0006 per comparison</div>
					</div>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm">Rate Limits</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-sm space-y-2">
						<div><strong>DetectFaces:</strong> 50 TPS</div>
						<div><strong>CompareFaces:</strong> 50 TPS</div>
						<div><strong>Max Image Size:</strong> 15MB</div>
						<div><strong>Min Image Size:</strong> 80x80 pixels</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Testing Your Setup</h2>

		<p>Verify your AWS Rekognition setup with a simple test:</p>

		<div class="my-6">
			<CodeBlock language="typescript" code={`// Test script
import { createWinterAuth } from '@zengate/winter-auth';

async function testAWSSetup() {
  const winterAuth = createWinterAuth({ mode: 'direct' });
  
  try {
    await winterAuth.initialize();
    console.log('✅ AWS Rekognition initialized successfully');
    
    // Test with a sample image
    const result = await winterAuth.checkImageQuality(imageFile);
    console.log('✅ Image quality check successful:', result.score);
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

testAWSSetup();`} />
		</div>

		<h2>Common Issues</h2>

		<div class="space-y-4 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm text-red-600">Invalid Credentials</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-sm space-y-2">
						<div><strong>Error:</strong> "The security token included in the request is invalid"</div>
						<div><strong>Solution:</strong> Verify ACCESS_KEY and SECRET_KEY are correct and active</div>
					</div>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm text-red-600">Access Denied</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-sm space-y-2">
						<div><strong>Error:</strong> "User is not authorized to perform: rekognition:DetectFaces"</div>
						<div><strong>Solution:</strong> Add AmazonRekognitionFullAccess policy to your IAM user</div>
					</div>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm text-red-600">Region Not Supported</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-sm space-y-2">
						<div><strong>Error:</strong> "Rekognition is not available in this region"</div>
						<div><strong>Solution:</strong> Use a supported region from the list above</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Next Steps</h2>

		<div class="flex gap-4 mt-6">
			<Button href="/docs/modules/authorization/usage">
				Start Using Authorization
			</Button>
			<Button variant="outline" href="/docs/modules/authorization/providers/google-vision">
				<Badge variant="secondary" class="mr-2">Coming Soon</Badge>
				Google Vision Provider
			</Button>
		</div>
	</div>
</DocPage>
