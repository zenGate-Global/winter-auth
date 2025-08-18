<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import InteractiveExample from '$lib/components/docs/InteractiveExample.svelte';
	import { Button } from "$lib/components/ui/button/index.js";
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { ShieldCheck, Zap, Users, Settings, Upload, Eye, CheckCircle, Coins } from '@lucide/svelte';
</script>

<DocPage title="Introduction to Winter Authenticator" description="Enterprise-grade biometric face verification for secure identity authentication">
	
	<div class="prose max-w-none">
		<p class="lead">
			Winter Authenticator is a comprehensive, enterprise-grade biometric face verification library that provides secure authentication through facial recognition technology. Built with TypeScript and designed for modern web and mobile applications, it offers a robust provider system supporting multiple cloud services.
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
					<p class="text-sm text-muted-foreground">Currently supports AWS Rekognition with a flexible architecture that allows new providers to be added as needed</p>
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
		
		<div class="space-y-4">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<ShieldCheck class="h-5 w-5 text-blue-600" />
						Authorization Module
					</Card.Title>
					<Card.Description>Face verification and biometric authentication</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>Provides comprehensive face comparison methods including image-to-image comparison, live video verification with liveness detection, and image quality assessment for optimal results.</p>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Upload class="h-5 w-5 text-green-600" />
						Metadata Extraction Module
					</Card.Title>
					<Card.Description>Extract and analyze image metadata</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>Extract EXIF data, GPS coordinates, camera information, and timestamps from images. Includes optimized methods for specific data extraction and validation.</p>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Settings class="h-5 w-5 text-purple-600" />
						Credential Issuing Module (Handle.me)
					</Card.Title>
					<Card.Description>
						<Badge variant="secondary">Coming Soon</Badge>
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<p>Future module for issuing and managing verifiable credentials after successful biometric authentication. Will integrate with decentralized identity systems.</p>
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Winter Protocol Integration</h2>
		
		<p>Winter Authenticator integrates with Winter Protocol, a blockchain-based traceability system that ensures biometric verification before data is permanently recorded on-chain.</p>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<ShieldCheck class="h-5 w-5 text-green-600" />
						Biometric Verification
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-gray-600">Face verification ensures only authorized personnel can create immutable blockchain records</p>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Coins class="h-5 w-5 text-purple-600" />
						Winter Protocol Traceability
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<p class="text-sm text-gray-600">Verified identity data enables secure traceability records in Winter Protocol's blockchain system</p>
				</Card.Content>
			</Card.Root>
		</div>

		<h3>Integration Points</h3>
		
		<ul class="space-y-2">
			<li><strong>GPS Information:</strong> Collects location metadata for uploaded records</li>
			<li><strong>Database Storage:</strong> Admin uploads reference images for user comparison</li>
			<li><strong>Facial Verification:</strong> Uses Winter Authenticator to verify identity before blockchain minting</li>
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