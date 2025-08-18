<script lang="ts">
	import DocPage from '$lib/components/docs/DocPage.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from '$lib/components/ui/badge';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import * as Tabs from '$lib/components/ui/tabs';
	import { CheckCircle, Download, Settings } from '@lucide/svelte';
	import CodeBlock from '$lib/components/ui/code-block.svelte';
</script>

<DocPage title="Installation" description="How to install and set up Winter Authenticator">
	<p>Get started with Winter Authenticator in your project.</p>

	<h2>Package Installation</h2>
	
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

	<h2>Requirements</h2>
	
	<div class="space-y-2 my-4">
		<div class="flex items-center gap-2">
			<CheckCircle class="h-4 w-4 text-green-500" />
			<span>Node.js 16+ or modern browser environment</span>
		</div>
		<div class="flex items-center gap-2">
			<CheckCircle class="h-4 w-4 text-green-500" />
			<span>TypeScript 4.5+ (recommended)</span>
		</div>
		<div class="flex items-center gap-2">
			<CheckCircle class="h-4 w-4 text-green-500" />
			<span>Valid AWS credentials for face recognition services</span>
		</div>
	</div>

	<h2>Environment Setup</h2>
	
	<p>Configure your authentication provider. See available providers:</p>
	
	<div class="my-4">
		<Card.Root>
			<Card.Header>
				<Card.Title>Available Providers</Card.Title>
			</Card.Header>
			<Card.Content>
				<div class="space-y-2">
					<a href="/docs/modules/authorization/providers/aws" class="flex items-center gap-2 text-primary hover:underline">
						<CheckCircle class="h-4 w-4 text-green-500" />
						AWS Rekognition
					</a>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<Alert class="my-6">
		<Settings class="h-4 w-4" />
		<AlertDescription>
			<strong>Security Note:</strong> Never commit your credentials to version control. Use environment variables and add <code>.env</code> to your <code>.gitignore</code> file.
		</AlertDescription>
	</Alert>

	<h2>Next Steps</h2>
	
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
		<Card.Root>
			<Card.Header>
				<Card.Title>Extract Metadata From Images</Card.Title>
			</Card.Header>
			<Card.Content>
				<p class="text-sm text-muted-foreground mb-4">Extract EXIF data, GPS coordinates, and camera information from images.</p>
				<Button size="sm" href="/docs/modules/metadata-extractor/introduction">Learn More</Button>
			</Card.Content>
		</Card.Root>
		
		<Card.Root>
			<Card.Header>
				<Card.Title>Compare Users by Face</Card.Title>
			</Card.Header>
			<Card.Content>
				<p class="text-sm text-muted-foreground mb-4">Perform biometric face verification between images or live video streams.</p>
				<Button size="sm" href="/docs/modules/authorization/introduction">Learn More</Button>
			</Card.Content>
		</Card.Root>
	</div>
</DocPage>

