<script lang="ts">
	import { createHighlighter } from 'shiki';
	import { onMount } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { Copy, Check } from '@lucide/svelte';
	
	interface Props {
		code: string;
		language?: string;
		title?: string;
		showCopyButton?: boolean;
		class?: string;
	}
	
	let { 
		code, 
		language = 'typescript', 
		title,
		showCopyButton = true,
		class: className = ''
	}: Props = $props();
	
	let highlightedCode = $state('');
	let copied = $state(false);
	let isLoading = $state(true);
	
	onMount(async () => {
		try {
			const highlighter = await createHighlighter({
				themes: ['github-light', 'github-dark'],
				langs: ['typescript', 'javascript', 'json', 'bash', 'shell']
			});
			
			// Detect dark mode
			const isDarkMode = document.documentElement.classList.contains('dark');
			
			highlightedCode = highlighter.codeToHtml(code, {
				lang: language,
				theme: isDarkMode ? 'github-dark' : 'github-light'
			});
		} catch (error) {
			console.error('Failed to highlight code:', error);
			// Fallback to plain text
			highlightedCode = `<pre><code>${code}</code></pre>`;
		} finally {
			isLoading = false;
		}
	});
	
	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => copied = false, 2000);
		} catch (error) {
			console.error('Failed to copy code:', error);
		}
	}
</script>

<div class="relative group {className}">
	{#if title}
		<div class="flex items-center justify-between px-4 py-2 bg-muted border-b">
			<span class="text-sm font-medium text-muted-foreground">{title}</span>
			{#if showCopyButton}
				<Button
					variant="ghost"
					size="sm"
					onclick={copyToClipboard}
					class="h-6 w-6 p-0"
				>
					{#if copied}
						<Check class="h-3 w-3" />
					{:else}
						<Copy class="h-3 w-3" />
					{/if}
				</Button>
			{/if}
		</div>
	{:else if showCopyButton}
		<Button
			variant="ghost"
			size="sm"
			onclick={copyToClipboard}
			class="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
		>
			{#if copied}
				<Check class="h-3 w-3" />
			{:else}
				<Copy class="h-3 w-3" />
			{/if}
		</Button>
	{/if}
	
	<div class="relative overflow-x-auto">
		{#if isLoading}
			<div class="p-4 bg-muted animate-pulse">
				<div class="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
				<div class="h-4 bg-muted-foreground/20 rounded w-1/2 mb-2"></div>
				<div class="h-4 bg-muted-foreground/20 rounded w-2/3"></div>
			</div>
		{:else}
			<div class="[&>pre]:m-0 [&>pre]:p-4 [&>pre]:bg-muted [&>pre]:border-0 [&>pre]:text-sm [&>pre]:leading-relaxed [&_code]:bg-transparent">
				{@html highlightedCode}
			</div>
		{/if}
	</div>
</div>
