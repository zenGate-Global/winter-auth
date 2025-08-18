<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Server, Globe, Shield, AlertTriangle, CheckCircle } from '@lucide/svelte';
</script>

<DocPage title="Authorization Setup" description="Initialize Winter Auth for client-side (proxy mode) or server-side (direct mode) usage">
	
	<div class="prose max-w-none">
		<p class="lead">
			Winter Auth supports two initialization modes: <strong>Direct Mode</strong> for server-side usage with environment variables, and <strong>Proxy Mode</strong> for client-side usage through an API endpoint.
		</p>

		<Alert.Root class="my-6">
			<Shield class="h-4 w-4" />
			<Alert.Description>
				<strong>Security Note:</strong> Never expose your provider API keys (AWS, Azure, etc.) in client-side code. Always use Proxy Mode for frontend applications.
			</Alert.Description>
		</Alert.Root>

		<h2>Choose Your Mode</h2>

		<div class="grid md:grid-cols-2 gap-6 my-8 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Server class="h-5 w-5 text-blue-600" />
						Direct Mode
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="space-y-3">
						<div>
							<Badge variant="default" class="mb-2">Server-Side</Badge>
							<p class="text-sm text-muted-foreground">
								Uses environment variables directly. Suitable for server applications, API routes, and backend services.
							</p>
						</div>
						<div class="text-sm">
							<strong>Use Cases:</strong>
							<ul class="mt-1 space-y-1 ml-4">
								<li> Node.js/Express servers</li>
								<li> API endpoints</li>
								<li> Backend microservices</li>
								<li> Server-side rendering</li>
							</ul>
						</div>
						<div class="text-sm">
							<strong>Requirements:</strong>
							<ul class="mt-1 space-y-1 ml-4">
								<li> Environment variables configured</li>
								<li> Server-side execution only</li>
							</ul>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Globe class="h-5 w-5 text-green-600" />
						Proxy Mode
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="space-y-3">
						<div>
							<Badge variant="secondary" class="mb-2">Client-Side</Badge>
							<p class="text-sm text-muted-foreground">
								Connects to your API endpoint that handles the authentication. Safe for frontend applications.
							</p>
						</div>
						<div class="text-sm">
							<strong>Use Cases:</strong>
							<ul class="mt-1 space-y-1 ml-4">
								<li> Non-SSR Frameworks</li>
								<li> Mobile applications</li>
								<li> Progressive web apps</li>
								<li> Browser environments</li>
							</ul>
						</div>
						<div class="text-sm">
							<strong>Requirements:</strong>
							<ul class="mt-1 space-y-1 ml-4">
								<li> API endpoint configured</li>
								<li> Server handling actual auth</li>
							</ul>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Installation</h2>

		<p>First, install the Winter Auth package:</p>

<Tabs.Root value="npm" class="my-6">
		<Tabs.List class="grid w-full grid-cols-4">
			<Tabs.Trigger value="npm">npm</Tabs.Trigger>
			<Tabs.Trigger value="pnpm">pnpm</Tabs.Trigger>
			<Tabs.Trigger value="yarn">yarn</Tabs.Trigger>
			<Tabs.Trigger value="bun">bun</Tabs.Trigger>
		</Tabs.List>
		
		<Tabs.Content value="npm" class="mt-4">
			<CodeBlock language="bash" code={`npm install @zengate/winter-auth`} />
		</Tabs.Content>
		
		<Tabs.Content value="pnpm" class="mt-4">
			<CodeBlock language="bash" code={`pnpm add @zengate/winter-auth`} />
		</Tabs.Content>
		
		<Tabs.Content value="yarn" class="mt-4">
			<CodeBlock language="bash" code={`yarn add @zengate/winter-auth`} />
		</Tabs.Content>
		
		<Tabs.Content value="bun" class="mt-4">
			<CodeBlock language="bash" code={`bun add @zengate/winter-auth`} />
		</Tabs.Content>
	</Tabs.Root>
		<h2>Direct Mode Setup</h2>

		<Alert.Root class="my-6">
			<AlertTriangle class="h-4 w-4" />
			<Alert.Description>
				<strong>Server-Side Only:</strong> Direct mode exposes provider API keys and must only be used in secure server environments.
			</Alert.Description>
		</Alert.Root>

		<h3>1. Configure Environment Variables</h3>

		<p>Set up your provider credentials (AWS Rekognition example):</p>

		<CodeBlock language="bash" code={`# .env file
WAUTH_PROVIDER=aws
WAUTH_ACCESS_KEY=AKIA...
WAUTH_SECRET_KEY=wJalrXUtn...
WAUTH_AWS_REGION=us-east-1`} />

		<h3>2. Initialize in Server Code</h3>

		<Tabs.Root value="node" class="w-full">
			<Tabs.List class="grid w-full grid-cols-3">
				<Tabs.Trigger value="node">Node.js/Express</Tabs.Trigger>
				<Tabs.Trigger value="nextjs">Next.js API</Tabs.Trigger>
				<Tabs.Trigger value="sveltekit">SvelteKit API</Tabs.Trigger>
			</Tabs.List>
			
			<Tabs.Content value="node" class="mt-6">
				<CodeBlock language="typescript" code={`import { createWinterAuth, SecurityStrength } from '@zengate/winter-auth';

// Initialize with direct mode (reads from environment variables)
const winterAuth = createWinterAuth({
  mode: 'direct',
  securityLevel: SecurityStrength.MEDIUM,
  enableConsoleLogging: true
});

// Initialize the authenticator
await winterAuth.initialize();

// Use in your API endpoint
app.post('/api/verify-face', async (req, res) => {
  try {
    const { referenceImage, targetImage } = req.body;
    
    const result = await winterAuth.compareByImage(
      referenceImage, 
      targetImage
    );
    
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`} />
			</Tabs.Content>
			
			<Tabs.Content value="nextjs" class="mt-6">
				<CodeBlock language="typescript" code={`// pages/api/winter-auth.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createWinterAuth, SecurityStrength } from '@zengate/winter-auth';

let winterAuth: ReturnType<typeof createWinterAuth> | null = null;

async function getWinterAuth() {
  if (!winterAuth) {
    winterAuth = createWinterAuth({
      mode: 'direct',
      securityLevel: SecurityStrength.MEDIUM
    });
    await winterAuth.initialize();
  }
  return winterAuth;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const auth = await getWinterAuth();
    const { method, params } = req.body;

    let result;
    switch (method) {
      case 'checkImageQuality':
        result = await auth.checkImageQuality(params.image);
        break;
      case 'compareByImage':
        result = await auth.compareByImage(
          params.referenceImage, 
          params.targetImage
        );
        break;
      default:
        return res.status(400).json({ error: 'Unknown method' });
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}`} />
			</Tabs.Content>
			
			<Tabs.Content value="sveltekit" class="mt-6">
				<CodeBlock language="typescript" code={`// src/routes/api/winter-auth/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createWinterAuth, SecurityStrength } from '@zengate/winter-auth';

let winterAuth: ReturnType<typeof createWinterAuth> | null = null;

async function getWinterAuth() {
  if (!winterAuth) {
    winterAuth = createWinterAuth({
      mode: 'direct',
      securityLevel: SecurityStrength.MEDIUM
    });
    await winterAuth.initialize();
  }
  return winterAuth;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { method, params } = await request.json();
    const auth = await getWinterAuth();

    let result;
    switch (method) {
      case 'checkImageQuality':
        result = await auth.checkImageQuality(params.image);
        break;
      case 'compareByImage':
        result = await auth.compareByImage(
          params.referenceImage, 
          params.targetImage
        );
        break;
      default:
        return json({ error: 'Unknown method' }, { status: 400 });
    }

    return json({ success: true, result });
  } catch (error) {
    return json({ error: error.message }, { status: 500 });
  }
};`} />
			</Tabs.Content>
		</Tabs.Root>

		<h2>Proxy Mode Setup</h2>

		<div class="bg-green-50 border-l-4 border-green-400 p-4 my-6">
			<div class="flex">
				<CheckCircle class="h-5 w-5 text-green-400 mt-0.5 mr-3" />
				<div>
					<p class="text-sm text-green-700">
						<strong>Recommended for Frontend:</strong> Proxy mode keeps your API keys secure on the server while allowing client-side usage.
					</p>
				</div>
			</div>
		</div>

		<h3>1. Set Up API Endpoint</h3>

		<p>First, create a server endpoint using Direct Mode (see examples above). This endpoint will handle the actual authentication.</p>

		<h3>2. Initialize in Client Code</h3>

		<Tabs.Root value="react" class="w-full">
			<Tabs.List class="grid w-full grid-cols-3">
				<Tabs.Trigger value="react">React</Tabs.Trigger>
				<Tabs.Trigger value="vue">Vue.js</Tabs.Trigger>
				<Tabs.Trigger value="svelte">Svelte</Tabs.Trigger>
			</Tabs.List>
			
			<Tabs.Content value="react" class="mt-6">
				<CodeBlock language="typescript" code={`import { createWinterAuth, SecurityStrength } from '@zengate/winter-auth';
import { useState, useEffect } from 'react';

function useWinterAuth() {
  const [winterAuth, setWinterAuth] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initializeAuth() {
      try {
        const auth = createWinterAuth({
          mode: 'proxy',
          apiBaseUrl: '/api/winter-auth', // Your API endpoint
          securityLevel: SecurityStrength.MEDIUM
        });
        
        await auth.initialize();
        setWinterAuth(auth);
      } catch (error) {
        console.error('Failed to initialize Winter Auth:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initializeAuth();
  }, []);

  return { winterAuth, isLoading };
}

// Usage in component
function FaceVerification() {
  const { winterAuth, isLoading } = useWinterAuth();
  
  const handleImageUpload = async (file) => {
    if (!winterAuth) return;
    
    try {
      const result = await winterAuth.checkImageQuality(file);
      console.log('Quality check:', result);
    } catch (error) {
      console.error('Quality check failed:', error);
    }
  };

  if (isLoading) return <div>Loading Winter Auth...</div>;
  
  return (
    <div>
      <input type="file" onChange={(e) => handleImageUpload(e.target.files[0])} />
    </div>
  );
}`} />
			</Tabs.Content>
			
			<Tabs.Content value="vue" class="mt-6">
				<CodeBlock language="typescript" code={`<template>
  <div>
    <div v-if="isLoading">Loading Winter Auth...</div>
    <div v-else>
      <input type="file" @change="handleImageUpload" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { createWinterAuth, SecurityStrength } from '@zengate/winter-auth';

const winterAuth = ref(null);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const auth = createWinterAuth({
      mode: 'proxy',
      apiBaseUrl: '/api/winter-auth',
      securityLevel: SecurityStrength.MEDIUM
    });
    
    await auth.initialize();
    winterAuth.value = auth;
  } catch (error) {
    console.error('Failed to initialize Winter Auth:', error);
  } finally {
    isLoading.value = false;
  }
});

const handleImageUpload = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!winterAuth.value || !file) return;
  
  try {
    const result = await winterAuth.value.checkImageQuality(file);
    console.log('Quality check:', result);
  } catch (error) {
    console.error('Quality check failed:', error);
  }
};
</script>`} />
			</Tabs.Content>
			
			<Tabs.Content value="svelte" class="mt-6">
				<CodeBlock language="typescript" code={`<script lang="ts">
  import { onMount } from 'svelte';
  import { createWinterAuth, SecurityStrength } from '@zengate/winter-auth';

  let winterAuth = null;
  let isLoading = true;

  onMount(async () => {
    try {
      const auth = createWinterAuth({
        mode: 'proxy',
        apiBaseUrl: '/api/winter-auth',
        securityLevel: SecurityStrength.MEDIUM
      });
      
      await auth.initialize();
      winterAuth = auth;
    } catch (error) {
      console.error('Failed to initialize Winter Auth:', error);
    } finally {
      isLoading = false;
    }
  });

  async function handleImageUpload(event) {
    const file = event.target.files?.[0];
    if (!winterAuth || !file) return;
    
    try {
      const result = await winterAuth.checkImageQuality(file);
      console.log('Quality check:', result);
    } catch (error) {
      console.error('Quality check failed:', error);
    }
  }
</script>

{#if isLoading}
  <div>Loading Winter Auth...</div>
{:else}
  <input type="file" on:change={handleImageUpload} />
{/if}`} />
			</Tabs.Content>
		</Tabs.Root>

		<h2>Configuration Options</h2>

		<Card.Root class="my-6">
			<Card.Header>
				<Card.Title>WinterAuthConfig</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="overflow-x-auto">
					<table class="min-w-full divide-y divide-gray-100">
						<thead>
							<tr>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Property</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Type</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Default</th>
								<th class="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">Description</th>
							</tr>
						</thead>
						<tbody class="bg-background divide-y divide-gray-100">
							<tr>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"><code>mode</code></td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><code>'direct' | 'proxy'</code></td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><code>'direct'</code></td>
								<td class="px-6 py-4 text-sm text-gray-500">Initialization mode</td>
							</tr>
							<tr>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"><code>apiBaseUrl</code></td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><code>string</code></td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><code>undefined</code></td>
								<td class="px-6 py-4 text-sm text-gray-500">Required for proxy mode</td>
							</tr>
							<tr>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"><code>securityLevel</code></td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><code>SecurityStrength</code></td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><code>MEDIUM</code></td>
								<td class="px-6 py-4 text-sm text-gray-500">Default security level for comparisons</td>
							</tr>
							<tr>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"><code>enableConsoleLogging</code></td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><code>boolean</code></td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><code>false</code></td>
								<td class="px-6 py-4 text-sm text-gray-500">Enable debug logging</td>
							</tr>
							<tr>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"><code>enableLivenessCheck</code></td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><code>boolean</code></td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><code>true</code></td>
								<td class="px-6 py-4 text-sm text-gray-500">Enable liveness detection</td>
							</tr>
							<tr>
								<td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"><code>enableChallenges</code></td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><code>boolean</code></td>
								<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><code>true</code></td>
								<td class="px-6 py-4 text-sm text-gray-500">Enable interactive challenges</td>
							</tr>
						</tbody>
					</table>
				</div>
			</Card.Content>
		</Card.Root>

		<h2>Next Steps</h2>

		<p>Once you have Winter Auth initialized, you can start using the core methods:</p>

		<div class="grid md:grid-cols-3 gap-4 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-base">Image Quality</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground mb-3">
						Check if images are suitable for face recognition before processing.
					</p>
					<a href="/docs/modules/authorization/check-image-quality" class="text-sm font-medium hover:underline">
						Learn checkImageQuality() →
					</a>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title class="text-base">Face Comparison</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground mb-3">
						Compare two images to verify if they contain the same person.
					</p>
					<a href="/docs/modules/authorization/compare-by-image" class="text-sm font-medium hover:underline">
						Learn compareByImage() →
					</a>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title class="text-base">Live Verification</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground mb-3">
						Real-time face verification with liveness detection using camera.
					</p>
					<a href="/docs/modules/authorization/compare-by-live-video" class="text-sm font-medium hover:underline">
						Learn compareByLiveVideo() →
					</a>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</DocPage>