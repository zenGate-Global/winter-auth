<script lang="ts">
import { onMount } from 'svelte';
import { createHighlighter, type Highlighter } from 'shiki';
import { browser } from '$app/environment';

	interface Props {
		code: string;
		language?: string;
		class?: string;
	}

	let { code, language = 'typescript', class: className = '' }: Props = $props();
	

let highlightedHtml = $state('');
let highlighter: Highlighter | null = null;

// Detect theme (SvelteKit app uses 'dark' class on <html> for dark mode)
let theme = 'github-light';
if (browser && typeof document !== 'undefined') {
  theme = document.documentElement.classList.contains('dark') ? 'github-dark' : 'github-light';
}

onMount(async () => {
	try {
		highlighter = await createHighlighter({
			themes: ['github-light', 'github-dark'],
			langs: ['typescript', 'javascript', 'json', 'bash', 'html', 'css', 'svelte']
		});
		// Highlight the code with the detected theme
		highlightedHtml = highlighter.codeToHtml(code, {
			lang: language,
			theme,
			colorReplacements: {
				'#24292f': 'hsl(var(--foreground))',
				'#f6f8fa': 'hsl(var(--muted))',
				'#0969da': 'hsl(var(--primary))',
				'#953800': 'hsl(var(--destructive))',
				'#0550ae': 'hsl(var(--blue))',
				'#116329': 'hsl(var(--green))',
				'#a40e26': 'hsl(var(--red))',
				'#633c01': 'hsl(var(--yellow))',
				'#8250df': 'hsl(var(--purple))'
			}
		});
	} catch (error) {
		console.error('Failed to initialize syntax highlighter:', error);
		// Fallback to plain text
		highlightedHtml = `<pre><code>${code}</code></pre>`;
	}
});
</script>

{#if highlightedHtml}
	<div class="overflow-x-auto {className}">
		{@html highlightedHtml}
	</div>
{:else}
	<pre class="overflow-x-auto bg-muted text-muted-foreground p-4 rounded-md {className}"><code>{code}</code></pre>
{/if}
