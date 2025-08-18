<script lang="ts">
	import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from '$lib/components/ui/badge';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { CodeBlock } from '$lib/components/ui/code-block';
	import { Code, Play } from '@lucide/svelte';

	interface Props {
		title: string;
		description: string;
		examples?: Record<string, string>;
		codeExample?: string;
		children?: any;
		language?: string;
		showTabs?: boolean;
		additionalExamples?: Array<{
			title: string;
			code: string;
			language?: string;
		}>;
	}

	let {
		title,
		description,
		examples = {},
		codeExample,
		children,
		language = 'typescript',
		showTabs = true,
		additionalExamples = []
	}: Props = $props();
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="space-y-2">
		<h3 class="text-2xl font-semibold tracking-tight">{title}</h3>
		<p class="text-muted-foreground">{description}</p>
	</div>

	<!-- Side-by-side layout -->
	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Left side: Code Examples -->
		<div class="space-y-4">
			<Card.Root>
				<Card.Header class="pb-3">
					<div class="flex items-center justify-between">
						<Card.Title class="text-lg flex items-center gap-2">
							<Code class="h-5 w-5" />
							Code Example
						</Card.Title>
						<Badge variant="secondary">{language}</Badge>
					</div>
				</Card.Header>
				<Card.Content>
					{#if examples && Object.keys(examples).length > 0}
						<Tabs value={Object.keys(examples)[0]} class="w-full">
							<TabsList class="grid w-full" style="grid-template-columns: repeat({Object.keys(examples).length}, minmax(0, 1fr));">
								{#each Object.keys(examples) as key}
									<TabsTrigger value={key}>{key}</TabsTrigger>
								{/each}
							</TabsList>
							{#each Object.entries(examples) as [key, code]}
								<TabsContent value={key}>
									<CodeBlock code={code} language={language} showCopyButton={true} />
								</TabsContent>
							{/each}
						</Tabs>
					{:else if codeExample}
						<CodeBlock code={codeExample} language={language} showCopyButton={true} />
					{:else if showTabs && additionalExamples.length > 0}
						<Tabs value="main" class="w-full">
							<TabsList class="grid w-full" style="grid-template-columns: repeat({1 + additionalExamples.length}, minmax(0, 1fr));">
								<TabsTrigger value="main">Basic Example</TabsTrigger>
								{#each additionalExamples as example, i}
									<TabsTrigger value="example-{i}">{example.title}</TabsTrigger>
								{/each}
							</TabsList>
							<TabsContent value="main">
								<CodeBlock code={codeExample || ''} language={language} showCopyButton={true} />
							</TabsContent>
							{#each additionalExamples as example, i}
								<TabsContent value="example-{i}">
									<CodeBlock code={example.code} language={example.language || language} showCopyButton={true} />
								</TabsContent>
							{/each}
						</Tabs>
					{:else}
						<p class="text-muted-foreground">No code example available</p>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>

		<!-- Right side: Interactive Demo -->
		<div class="space-y-4">
			<Card.Root>
				<Card.Header class="pb-3">
					<Card.Title class="text-lg flex items-center gap-2">
						<Play class="h-5 w-5" />
						Interactive Demo
					</Card.Title>
					<Card.Description>
						Try the function live with your own data
					</Card.Description>
				</Card.Header>
				<Card.Content>
					{#if children}
						{@render children()}
					{:else}
						<p class="text-muted-foreground">No interactive demo available</p>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
