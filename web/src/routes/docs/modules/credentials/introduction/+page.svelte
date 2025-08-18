<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
	import * as Card from "$lib/components/ui/card/index.js";
	import * as Alert from '$lib/components/ui/alert/index.js';
	import { Badge } from "$lib/components/ui/badge/index.js";
	import { Button } from "$lib/components/ui/button/index.js";
	import { Key, Shield, Users, AlertTriangle, Link, ExternalLink, Settings } from '@lucide/svelte';
</script>

<DocPage title="Credentials Module" description="Decentralized identity credentials using ADA Handles for Winter Protocol">
	
	<div class="prose max-w-none">
		<p class="lead">
			The Credentials module integrates decentralized identity management through ADA Handles, enabling secure, blockchain-based identity verification that links biometric authentication with on-chain credentials.
		</p>

		<Alert.Root>
			<AlertTriangle class="h-4 w-4" />
			<Alert.Title>Current Status: Manual Setup Required</Alert.Title>
			<Alert.Description>
				The Handle.me API is not fully prepared to handle our automated needs at this moment. Manual setup is required for credential minting and configuration until API improvements are implemented.
			</Alert.Description>
		</Alert.Root>

		<h2>What are ADA Handles?</h2>
		
		<p>ADA Handles are human-readable identifiers built on the Cardano blockchain that function as decentralized identity anchors. Similar to domain names, they provide a memorable way to reference blockchain addresses and associated credentials.</p>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Key class="h-5 w-5 text-blue-600" />
						Main Handles
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-sm space-y-2">
						<div><strong>Format:</strong> <code>$company</code></div>
						<div><strong>Purpose:</strong> Represents the organization/owner</div>
						<div><strong>Ownership:</strong> Company/Admin wallet</div>
						<div><strong>Function:</strong> Root identity for all sub-credentials</div>
					</div>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Users class="h-5 w-5 text-green-600" />
						Sub-Handles
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-sm space-y-2">
						<div><strong>Format:</strong> <code>$user@company</code></div>
						<div><strong>Purpose:</strong> Individual user credentials</div>
						<div><strong>Ownership:</strong> User or Admin-managed</div>
						<div><strong>Function:</strong> Personal identity anchored to main handle</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Architecture Overview</h2>
		
		<p>The credentials system combines off-chain data management with on-chain identity verification, leveraging the Winter Protocol for enhanced security and privacy.</p>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm flex items-center gap-2">
						<Shield class="h-4 w-4 text-purple-600" />
						1. Handle Setup
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs space-y-1">
						<div>Admin mints main handle</div>
						<div>Sub-handles created for users</div>
						<div>Wallet connection established</div>
						<div>Handles stored in wallet</div>
					</div>
					<Badge variant="outline" class="mt-2">Manual Process</Badge>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm flex items-center gap-2">
						<Settings class="h-4 w-4 text-blue-600" />
						2. Admin Configuration
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs space-y-1">
						<div>Connect wallet to admin panel</div>
						<div>Select handles to attach</div>
						<div>Assign handles to users</div>
						<div>Configure permissions</div>
					</div>
					<Badge variant="default" class="mt-2">Off-Chain Setup</Badge>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-sm flex items-center gap-2">
						<Key class="h-4 w-4 text-green-600" />
						3. Identity Verification
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-xs space-y-1">
						<div>User actions carry handle reference</div>
						<div>Biometric data links to handle</div>
						<div>On-chain verification occurs</div>
						<div>Identity proven via blockchain</div>
					</div>
					<Badge variant="default" class="mt-2">On-Chain Proof</Badge>
				</Card.Content>
			</Card.Root>
		</div>


		<h2>Manual Setup Requirements</h2>

		<Alert.Root>
			<Link class="h-4 w-4" />
			<Alert.Title>Required External Steps</Alert.Title>
			<Alert.Description>
				Until Handle.me API integration is complete, these steps must be performed manually through their website.
			</Alert.Description>
		</Alert.Root>

		<div class="grid grid-cols-1 gap-4 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<ExternalLink class="h-5 w-5 text-blue-600" />
						Manual Handle Creation Process
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<ol class="text-sm space-y-3">
						<li><strong>Visit Handle.me Website:</strong> Navigate to <a href="https://handle.me" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">handle.me</a></li>
						<li><strong>Connect Cardano Wallet:</strong> Use a compatible wallet (Vespr, Eternl, Lace, etc.)</li>
						<li><strong>Mint Main Handle:</strong> Purchase and mint your organization's main handle (e.g., <code>$mycompany</code>)</li>
						<li><strong>Create Sub-handles:</strong> Mint individual sub-handles for each user (e.g., <code>$user@mycompany</code>)</li>
						<li><strong>Verify Ownership:</strong> Ensure all handles appear in your connected wallet</li>
						<li><strong>Admin Panel Setup:</strong> Connect the same wallet to your admin panel</li>
						<li><strong>Handle Assignment:</strong> Map handles to user accounts within the admin interface</li>
					</ol>
				</Card.Content>
			</Card.Root>
		</div>

		<h2>Benefits of Handle Integration</h2>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Shield class="h-5 w-5 text-green-600" />
						Decentralized Identity
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<ul class="text-sm space-y-1">
						<li>No central authority dependency</li>
						<li>User-controlled identity ownership</li>
						<li>Blockchain-verified authenticity</li>
						<li>Interoperable across platforms</li>
					</ul>
				</Card.Content>
			</Card.Root>
			
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<Key class="h-5 w-5 text-purple-600" />
						Enhanced Security
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<ul class="text-sm space-y-1">
						<li>Cryptographic proof of identity</li>
						<li>Immutable credential records</li>
						<li>Tamper-resistant verification</li>
						<li>Multi-layer authentication</li>
					</ul>
				</Card.Content>
			</Card.Root>
		</div>



		<h2>Resources</h2>

		<div class="grid grid-cols-1 gap-4 my-6 not-prose">
			<Card.Root>
				<Card.Header>
					<Card.Title class="flex items-center gap-2">
						<ExternalLink class="h-5 w-5 text-blue-600" />
						External Resources
					</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-sm space-y-2">
						<div><a href="https://handle.me" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Handle.me Official Site</a></div>
						<div><a href="https://docs.handle.me/docs/Introduction/1_Welcome#ADA_Handles_Overview" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">ADA Handles Documentation</a></div>
						<div><a href="https://cardano.org" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">Cardano Blockchain</a></div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</DocPage>