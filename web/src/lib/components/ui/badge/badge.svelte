<script lang="ts" module>
	import { cn } from "$lib/utils.js";
	import { tv, type VariantProps } from "tailwind-variants";

	export const badgeVariants = tv({
		base: "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground",
				secondary: "bg-secondary text-secondary-foreground",
				destructive: "bg-destructive text-destructive-foreground",
				outline: "border border-input bg-background text-foreground",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type BadgeVariant = VariantProps<typeof badgeVariants>["variant"];
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';
	
	let {
		class: className,
		variant = "default",
		children,
		...restProps
	}: {
		class?: string;
		variant?: BadgeVariant;
		children?: Snippet;
	} & import("svelte/elements").HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={cn(badgeVariants({ variant }), className)} {...restProps}>
	{@render children?.()}
</div>