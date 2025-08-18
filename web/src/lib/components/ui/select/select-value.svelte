<script lang="ts">
	import { cn } from "$lib/utils.js";
	import type { Snippet } from 'svelte';

	let {
		class: className,
		children,
		placeholder,
		...restProps
	}: {
		class?: string;
		children?: Snippet;
		placeholder?: string;
	} = $props();
</script>

<span
	data-slot="select-value"
	class={cn("text-sm placeholder:text-muted-foreground", className)}
	{...restProps}
>
	{#if placeholder}
		<span class="text-muted-foreground">{placeholder}</span>
	{/if}
	{@render children?.()}
</span>