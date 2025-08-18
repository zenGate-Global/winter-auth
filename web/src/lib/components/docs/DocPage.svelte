<script lang="ts">
    import * as Card from "$lib/components/ui/card/index.js";
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		children?: Snippet;
	}

	let { title, description, children }: Props = $props();
</script>

<div class="max-w-4xl mx-auto p-6">
	<div class="mb-8">
		<h1 class="text-4xl font-bold mb-4">{title}</h1>
		{#if description}
			<p class="text-lg text-muted-foreground">{description}</p>
		{/if}
	</div>
	
	<Separator class="mb-8" />
	
	<div class="max-w-none">
		{@render children?.()}
	</div>
</div>
