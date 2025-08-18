<script lang="ts">
import { onMount } from 'svelte';
import { browser } from '$app/environment';
import { highlighterService } from '$lib/services/highlighter';

	interface Props {
		code: string;
		language?: string;
		class?: string;
	}

	let { code, language = 'typescript', class: className = '' }: Props = $props();
	

let highlightedHtml = $state('');
let isLoading = $state(true);

// Detect theme (SvelteKit app uses 'dark' class on <html> for dark mode)
let theme = $state('github-light');

onMount(async () => {
	if (browser && typeof document !== 'undefined') {
		theme = document.documentElement.classList.contains('dark') ? 'github-dark' : 'github-light';
	}

	try {
		// Use the singleton highlighter service
		const highlighter = await highlighterService.getHighlighter();
		
		// Highlight the code with the detected theme
		highlightedHtml = highlighter.codeToHtml(code, {
			lang: language,
			theme
		});
		isLoading = false;
	} catch (error) {
		console.error('Failed to highlight code:', error);
		// Fallback to plain text
		highlightedHtml = `<pre><code>${code}</code></pre>`;
		isLoading = false;
	}
});
</script>

{#if isLoading}
	<!-- Show raw code while loading -->
	<pre class="overflow-x-auto bg-muted text-muted-foreground p-4 rounded-md {className}"><code>{code}</code></pre>
{:else if highlightedHtml}
	<!-- Show highlighted code once ready -->
	<div class="overflow-x-auto {className}">
		{@html highlightedHtml}
	</div>
{:else}
	<!-- Fallback to raw code if highlighting fails -->
	<pre class="overflow-x-auto bg-muted text-muted-foreground p-4 rounded-md {className}"><code>{code}</code></pre>
{/if}
