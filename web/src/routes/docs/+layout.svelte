<script lang="ts">
	import DocsLayout from '$lib/components/layout/DocsLayout.svelte';
	import MetadataHead from '$lib/components/misc/MetadataHead.svelte';
	import { createMetadataContext } from '$lib/context/metadata.svelte.js';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
	
	// Create metadata context for the docs section
	createMetadataContext();
</script>

<MetadataHead />

<DocsLayout>
	{@render children?.()}
</DocsLayout>