<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from '$lib/components/ui/badge';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { Cloud, DollarSign, Settings, Star } from '@lucide/svelte';
</script>

<DocPage title="Providers" description="Overview of cloud providers and setup">
	<p>Winter Authenticator supports multiple cloud providers for face recognition services. Each provider has different capabilities, pricing, and setup requirements.</p>

	<h2>Supported Providers</h2>
	
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<Cloud class="h-5 w-5" />
					AWS Rekognition
				</Card.Title>
				<Card.Description>Amazon's facial recognition service</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				<div class="flex items-center gap-2">
					<Star class="h-4 w-4 text-yellow-500" />
					<span class="text-sm"><strong>Accuracy:</strong> High</span>
				</div>
				<div class="flex items-center gap-2">
					<DollarSign class="h-4 w-4 text-green-500" />
					<span class="text-sm"><strong>Pricing:</strong> Pay per image</span>
				</div>
				<div class="flex items-center gap-2">
					<Settings class="h-4 w-4 text-blue-500" />
					<span class="text-sm"><strong>Setup:</strong> AWS credentials</span>
				</div>
				<div class="pt-2">
					<Badge variant="outline">Face comparison</Badge>
					<Badge variant="outline">Liveness detection</Badge>
					<Badge variant="outline">Emotion analysis</Badge>
				</div>
			</Card.Content>
		</Card.Root>
		
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<Cloud class="h-5 w-5" />
					Azure Face API
				</Card.Title>
				<Card.Description>Microsoft's cognitive services</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				<div class="flex items-center gap-2">
					<Star class="h-4 w-4 text-yellow-500" />
					<span class="text-sm"><strong>Accuracy:</strong> High</span>
				</div>
				<div class="flex items-center gap-2">
					<DollarSign class="h-4 w-4 text-green-500" />
					<span class="text-sm"><strong>Pricing:</strong> Tiered pricing</span>
				</div>
				<div class="flex items-center gap-2">
					<Settings class="h-4 w-4 text-blue-500" />
					<span class="text-sm"><strong>Setup:</strong> Azure subscription</span>
				</div>
				<div class="pt-2">
					<Badge variant="outline">Face verification</Badge>
					<Badge variant="outline">Identification</Badge>
					<Badge variant="outline">Emotion recognition</Badge>
				</div>
			</Card.Content>
		</Card.Root>
		
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex items-center gap-2">
					<Settings class="h-5 w-5" />
					Custom Provider
				</Card.Title>
				<Card.Description>Your own implementation</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-2">
				<div class="flex items-center gap-2">
					<Star class="h-4 w-4 text-yellow-500" />
					<span class="text-sm"><strong>Accuracy:</strong> Depends on implementation</span>
				</div>
				<div class="flex items-center gap-2">
					<DollarSign class="h-4 w-4 text-green-500" />
					<span class="text-sm"><strong>Pricing:</strong> Your implementation</span>
				</div>
				<div class="flex items-center gap-2">
					<Settings class="h-4 w-4 text-blue-500" />
					<span class="text-sm"><strong>Setup:</strong> Custom configuration</span>
				</div>
				<div class="pt-2">
					<Badge variant="outline">Customizable</Badge>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<h2>Quick Setup</h2>
	
	<pre><code>{`import { WinterAuthenticator } from 'winter-authenticator';

// AWS Rekognition
const awsAuth = new WinterAuthenticator({
  provider: 'aws-rekognition',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'us-east-1'
  }
});

// Azure Face API
const azureAuth = new WinterAuthenticator({
  provider: 'azure-face-api',
  credentials: {
    apiKey: process.env.AZURE_FACE_API_KEY,
    endpoint: process.env.AZURE_FACE_API_ENDPOINT
  }
});`}</code></pre>

	<h2>Next Steps</h2>
	
	<div class="flex gap-4 mt-6">
		<Button href="/docs/modules/authorization/usage">Usage Guide</Button>
		<Button variant="outline" href="/docs/get-started/installation">Installation</Button>
	</div>
</DocPage>

