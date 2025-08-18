<script lang="ts">
	import { page } from '$app/stores';
	import { getNavItemByPath, getNavGroupByPath, getNextNavItem, getPreviousNavItem } from '$lib/docs/navigation';
	import DocsSidebar from './DocsSidebar.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Card from "$lib/components/ui/card/index.js";
	import ModeToggle from '$lib/components/misc/ModeToggle.svelte';
	import { Menu, Github, ArrowRight, ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { SidebarProvider, Sidebar, SidebarInset, SidebarTrigger } from '$lib/components/ui/sidebar';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();

	const currentPath = $derived($page.url.pathname);
	const currentItem = $derived(getNavItemByPath(currentPath));
	const currentGroup = $derived(getNavGroupByPath(currentPath));
	const nextItem = $derived(getNextNavItem(currentPath));
	const previousItem = $derived(getPreviousNavItem(currentPath));
</script>

<SidebarProvider>
	<Sidebar>
		<DocsSidebar {currentPath} />
	</Sidebar>
	<SidebarInset>
		<header class="flex h-14 shrink-0 items-center border-b px-6">
			<div class="flex items-center space-x-2">
				<SidebarTrigger class="-ml-1" />
				<Separator orientation="vertical" class="mr-2 h-4" />
				
				<!-- Breadcrumb -->
				<div class="flex items-center space-x-2">
					{#if currentGroup}
						<span class="text-sm text-muted-foreground">{currentGroup.title}</span>
						<ArrowRight class="h-4 w-4 text-muted-foreground" />
					{/if}
					{#if currentItem}
						<span class="text-sm font-medium">{currentItem.title}</span>
					{/if}
				</div>
			</div>

			<!-- Actions -->
			<div class="ml-auto flex items-center space-x-2">
				<Button variant="ghost" size="icon" asChild>
					<a href="https://github.com/zengate/winter-authenticator" target="_blank" rel="noopener noreferrer">
						<Github class="h-5 w-5" />
					</a>
				</Button>
				<ModeToggle />
			</div>
		</header>

		<!-- Content -->
		<main class="flex-1 overflow-auto">
			<div class="container max-w-5xl mx-auto px-6 py-12">
				<!-- Page Header -->
				{#if currentItem}
					<div class="mb-8">
						<h1 class="text-4xl font-bold tracking-tight mb-4">{currentItem.title}</h1>
						{#if currentItem.description}
							<p class="text-xl text-muted-foreground max-w-3xl">{currentItem.description}</p>
						{/if}
					</div>
				{/if}

				<!-- Content -->
				<div class="prose prose-lg max-w-none">
					{@render children?.()}
				</div>

				<!-- Navigation -->
				<div class="mt-16 pt-8 border-t">
					<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
						{#if previousItem}
						<a href={previousItem.href} class="block ">
							<Card.Root class="hover:shadow-md transition-shadow hover:bg-muted/50">
								<Card.Header class="pb-3">
									<Card.Description class="flex items-center text-sm text-primary">
										<ChevronLeft class="h-4 w-4 mr-1" />
										Previous
									</Card.Description>
								</Card.Header>
								<Card.Content>
									
										<Card.Title class="text-lg mb-1">{previousItem.title}</Card.Title>
										{#if previousItem.description}
											<Card.Description>{previousItem.description}</Card.Description>
										{/if}
									
								</Card.Content>
							</Card.Root>
							</a>
						{:else}
							<div></div>
						{/if}
						
						{#if nextItem}
						<a href={nextItem.href} class="block text-right">
							<Card.Root class="hover:shadow-md transition-shadow hover:bg-muted/50">
								<Card.Header class="pb-3">
									<Card.Description class="flex items-center justify-end text-sm text-primary">
										Next
										<ChevronRight class="h-4 w-4 ml-1" />
									</Card.Description>
								</Card.Header>
								<Card.Content>
									
										<Card.Title class="text-lg mb-1">{nextItem.title}</Card.Title>
										{#if nextItem.description}
											<Card.Description>{nextItem.description}</Card.Description>
										{/if}
									
								</Card.Content>
							</Card.Root>
							</a>
						{/if}
					</div>
				</div>
			</div>
		</main>
	</SidebarInset>
</SidebarProvider>



