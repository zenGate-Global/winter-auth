<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import InteractiveExample from '$lib/components/docs/InteractiveExample.svelte';
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { ShieldCheck, Zap, Users, Settings, Upload, Eye, CheckCircle, Coins } from '@lucide/svelte';
</script>

<DocPage title="Welcome to Winter Auth" description="Verifiable Credentials security layer">
	
	<div class="prose max-w-none">
		<p class="lead">
			Winter Auth is a TypeScript library that provides a framework‑agnostic security layer for implementing verifiable credentials using the DID method of your choice.
		</p>

		<h2>Core Capabilities</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Users class="h-5 w-5 text-blue-600" />
						Provider Support
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">Currently supports AWS Rekognition with a flexible architecture that allows new biometric providers to be added as needed</p>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<ShieldCheck class="h-5 w-5 text-green-600" />
						Security-First Design
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">Configurable security levels, liveness detection, and anti-spoofing challenges for maximum protection</p>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Zap class="h-5 w-5 text-yellow-600" />
						Production Ready
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-muted-foreground">HTTP connection pooling, provider instance reuse, and comprehensive error handling</p>
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Three Core Modules</h2>
		
<section class="space-y-12">
  <div class="grid gap-8 md:grid-cols-1">
    <div class="flex flex-col space-y-3">
      <div class="flex items-center gap-2">
        <ShieldCheck class="h-8 w-8 text-blue-600" />
        <h3 class="text-xl font-semibold">Authorization Module</h3>
      </div>
      <p class="text-muted-foreground">
        Face verification and biometric authentication with image-to-image
        comparison, live video verification (with liveness detection), and image
        quality assessment for optimal results.
      </p>
    </div>

    <div class="flex flex-col space-y-3">
      <div class="flex items-center gap-2">
        <Upload class="h-8 w-8 text-green-600" />
        <h3 class="text-xl font-semibold">Metadata Extraction Module</h3>
      </div>
      <p class="text-muted-foreground">
        Extract EXIF data, GPS coordinates, camera information, and timestamps
        from images. Includes optimized methods for targeted data extraction and
        validation.
      </p>
    </div>

    <div class="flex flex-col space-y-3">
      <div class="flex items-center gap-2">
        <Settings class="h-8 w-8 text-purple-600" />
        <h3 class="text-xl font-semibold flex items-center gap-2">
          Credential Issuing Module
          <span class="rounded-full bg-primary px-2 py-0.5 text-xs">Coming Soon</span>
        </h3>
      </div>
      <p class="text-muted-foreground">
        Issue and manage verifiable credentials after successful biometric
        authentication. Designed to integrate seamlessly with decentralized
        identity systems.
      </p>
    </div>
  </div>
</section>

		<h2>Winter Protocol Integration</h2>

		<p>Winter Auth is designed to be used with Winter Protocol, a blockchain-based traceability system, but it can be implemented in any environment that requires secure and verifiable identity management.</p>

		<h3>Integration Points</h3>
		
		<ul class="space-y-2">
			<li><strong>GPS Information:</strong> Collects location metadata for uploaded records</li>
			<li><strong>Database Storage:</strong> Admin uploads reference images for user comparison</li>
			<li><strong>Facial Verification:</strong> Winter Auth can be used to verify identity before blockchain data submission</li>
			<li><strong>Immutable Records:</strong> Successfully verified records become permanent blockchain assets</li>
		</ul>

		<h2>Dual-Mode Architecture</h2>
		
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title>Direct Mode</Card.Title>
					<Card.Description>Server-side with API keys</Card.Description>
				</Card.Header>
				<Card.Content>
					<ul class="text-sm space-y-1">
						<li>Uses environment variables</li>
						<li>Direct provider communication</li>
						<li>Maximum security</li>
						<li>Backend applications</li>
					</ul>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title>Proxy Mode</Card.Title>
					<Card.Description>Frontend-safe via API endpoints</Card.Description>
				</Card.Header>
				<Card.Content>
					<ul class="text-sm space-y-1">
						<li>No API keys exposed</li>
						<li>Proxied through your API</li>
						<li>Frontend applications</li>
						<li>Browser compatibility</li>
					</ul>
				</Card.Content>
			</Card.Root>
		</div>

		<div class="flex gap-4 mt-8">
			<Button href="/docs/get-started/installation">
				Get Started
			</Button>
			<Button variant="outline" href="/docs/modules/authorization/introduction">
				API Documentation
			</Button>
		</div>
	</div>
</DocPage>