<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Code, Play, Copy, Check } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	
	interface Props {
		title: string;
		description?: string;
		code?: string;
		language?: string;
		responseType?: string;
		responseExample?: string;
		children?: Snippet;
		demoComponent?: Snippet;
		demoComponentType?: any;
		defaultTab?: 'demo' | 'code';
	}
	
	let {
		title,
		description,
		code,
		language = 'javascript',
		responseType,
		responseExample,
		children,
		demoComponent,
		demoComponentType,
		defaultTab = 'demo'
	}: Props = $props();
	
	let isCopied = $state(false);
	
	async function copyCode() {
		if (code) {
			await navigator.clipboard.writeText(code);
			isCopied = true;
			setTimeout(() => isCopied = false, 2000);
		}
	}
	
	function formatCode(codeString: string): string {
		return codeString.trim();
	}
</script>

<div class="space-y-6">
	<div class="mb-4">
		<h3 class="text-xl font-semibold mb-2">{title}</h3>
		{#if description}
			<p class="text-muted-foreground">{description}</p>
		{/if}
	</div>

	<Tabs value={defaultTab} class="w-full">
		<TabsList class="grid w-full grid-cols-2">
			<TabsTrigger value="demo">
				<Play class="h-4 w-4 mr-2" />
				Interactive Demo
			</TabsTrigger>
			<TabsTrigger value="code">
				<Code class="h-4 w-4 mr-2" />
				Code Example
			</TabsTrigger>
		</TabsList>

		<TabsContent value="demo" class="mt-6">
			{#if demoComponent}
				{@render demoComponent()}
			{:else if demoComponentType}
				<svelte:component this={demoComponentType} />
			{:else}
				<Card.Root>
					<Card.Content class="p-8 text-center">
						<p class="text-muted-foreground">No interactive demo available</p>
					</Card.Content>
				</Card.Root>
			{/if}
		</TabsContent>

		<TabsContent value="code" class="mt-6">
			<div class="space-y-4">
				{#if code}
					<Card.Root>
						<Card.Header class="pb-3">
							<div class="flex items-center justify-between">
								<Card.Title class="text-base">Example Code</Card.Title>
								<div class="flex items-center gap-2">
									<Badge variant="outline">{language}</Badge>
									<Button
										variant="ghost"
										size="sm"
										onclick={copyCode}
										class="h-8 w-8 p-0"
									>
										{#if isCopied}
											<Check class="h-4 w-4" />
										{:else}
											<Copy class="h-4 w-4" />
										{/if}
									</Button>
								</div>
							</div>
						</Card.Header>
						<Card.Content>
							<pre class="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm"><code class="language-{language}">{formatCode(code)}</code></pre>
						</Card.Content>
					</Card.Root>
				{/if}

				{#if responseType && responseExample}
					<Card.Root>
						<Card.Header class="pb-3">
							<Card.Title class="text-base">Response Format</Card.Title>
							<Card.Description>Expected response structure</Card.Description>
						</Card.Header>
						<Card.Content>
							<div class="mb-2">
								<Badge variant="outline">{responseType}</Badge>
							</div>
							<pre class="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm"><code class="language-{responseType === 'interface' ? 'typescript' : 'json'}">{formatCode(responseExample)}</code></pre>
						</Card.Content>
					</Card.Root>
				{/if}

				{#if children}
					{@render children()}
				{/if}
			</div>
		</TabsContent>
	</Tabs>
</div>

