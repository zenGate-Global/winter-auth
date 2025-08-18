<script lang="ts">
	import DocsLayout from '$lib/components/layout/DocsLayout.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<DocsLayout>
	{@render children?.()}
</DocsLayout>