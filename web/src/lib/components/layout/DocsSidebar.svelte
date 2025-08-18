<script lang="ts">
	import { docsNavigation } from '$lib/docs/navigation';
	import { 
		SidebarContent, 
		SidebarFooter, 
		SidebarGroup, 
		SidebarGroupContent, 
		SidebarGroupLabel, 
		SidebarHeader, 
		SidebarMenu, 
		SidebarMenuButton, 
		SidebarMenuItem
	} from '$lib/components/ui/sidebar';
	import { Badge } from '$lib/components/ui/badge';
	import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '$lib/components/ui/collapsible';
	import { Github, BookOpen, Settings, FileText, Play, Database, Shield, Download, ChevronDown, Code, Wrench, Globe, Info } from '@lucide/svelte';

	interface Props {
		currentPath: string;
	}

	let { currentPath }: Props = $props();
	
	function renderNavItems(items: any[], level = 0) {
		return items;
	}
	
	function isItemActive(item: any): boolean {
		if (item.href === currentPath) return true;
		if (item.items) {
			return item.items.some((subItem: any) => isItemActive(subItem));
		}
		return false;
	}
	
</script>

<SidebarHeader class="border-b p-4">
	<div class="flex items-center space-x-3">
		<div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
			<BookOpen class="h-5 w-5" />
		</div>
		<div class="flex flex-col">
			<span class="text-base font-semibold">wAuth</span>
			<span class="text-sm text-muted-foreground">Documentation</span>
		</div>
	</div>
</SidebarHeader>

<SidebarContent class="p-4">
	{#each docsNavigation as group}
		<SidebarGroup class="mb-4">
			<SidebarGroupLabel class="text-sm font-semibold px-2 py-1.5 text-sidebar-foreground mb-1.5">
				<div class="flex items-center">
					{#if group.title === 'Get Started'}
						<BookOpen class="h-4 w-4 mr-2" />
					{:else if group.title === 'Modules'}
						<Settings class="h-4 w-4 mr-2" />
					{:else if group.title === 'API Reference'}
						<FileText class="h-4 w-4 mr-2" />
					{:else}
						<BookOpen class="h-4 w-4 mr-2" />
					{/if}
					{group.title}
				</div>
			</SidebarGroupLabel>
			<SidebarGroupContent>
				<SidebarMenu class="space-y-1">
					{#each group.items as item}
						<SidebarMenuItem>
							{#if group.collapsible && group.title === 'Modules'}
								<Collapsible open={true}>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton 
											class="w-full justify-between h-8 px-2 text-sm font-normal hover:bg-sidebar-accent/50"
										>
											<div class="flex items-center">
												{#if item.title === 'Authorization'}
													<Shield class="h-3 w-3 mr-2 opacity-60" />
												{:else if item.title === 'Metadata Extractor'}
													<Database class="h-3 w-3 mr-2 opacity-60" />
												{:else}
													<BookOpen class="h-3 w-3 mr-2 opacity-60" />
												{/if}
												<span class="text-sm">{item.title}</span>
											</div>
											<ChevronDown class="h-3 w-3 transition-transform duration-200 group-data-[state=closed]:rotate-180" />
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenu class="ml-4 space-y-1">
											{#each item.items as subItem}
												<SidebarMenuItem>
													{#if subItem.category}
														<div class="text-xs text-muted-foreground font-medium px-2 py-1 mb-1">
															<div class="flex items-center">
																{#if subItem.title === 'Introduction'}
																	<Info class="h-3 w-3 mr-1.5 opacity-60" />
																{:else if subItem.title === 'Usage'}
																	<Code class="h-3 w-3 mr-1.5 opacity-60" />
																{:else if subItem.title === 'Providers'}
																	<Globe class="h-3 w-3 mr-1.5 opacity-60" />
																{:else if subItem.title === 'Edge Cases'}
																	<Settings class="h-3 w-3 mr-1.5 opacity-60" />
																{:else}
																	<BookOpen class="h-3 w-3 mr-1.5 opacity-60" />
																{/if}
																{subItem.title}
															</div>
														</div>
														{#if subItem.items}
															<SidebarMenu class="ml-4 space-y-1">
																{#each subItem.items as subSubItem}
																	<SidebarMenuItem>
																		<SidebarMenuButton 
																			asChild 
																			isActive={currentPath === subSubItem.href}
																			class="w-full  justify-start h-8 px-2 text-sm font-normal hover:bg-sidebar-accent/50 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
																		>
																			<a href={subSubItem.href} class="flex items-center w-full">
																				{#if subSubItem.title.endsWith('()')}
																					<Play class="h-3 w-3 mr-2 opacity-60" />
																				{:else}
																					<FileText class="h-3 w-3 mr-2 opacity-60" />
																				{/if}
																				<span class="text-sm">{subSubItem.title}</span>
																			</a>
																		</SidebarMenuButton>
																	</SidebarMenuItem>
																{/each}
															</SidebarMenu>
														{/if}
													{:else if subItem.href}
														<SidebarMenuButton 
															asChild 
															isActive={currentPath === subItem.href}
															class="w-full justify-start  h-8 px-2 text-sm font-normal hover:bg-sidebar-accent/50 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
														>
															<a href={subItem.href} class="flex items-center w-full">
																{#if subItem.title === 'Introduction'}
																	<Info class="h-3 w-3 mr-2 opacity-60" />
																{:else if subItem.title === 'Edge Cases'}
																	<Settings class="h-3 w-3 mr-2 opacity-60" />
																{:else}
																	<BookOpen class="h-3 w-3 mr-2 opacity-60" />
																{/if}
																<span class="text-sm">{subItem.title}</span>
															</a>
														</SidebarMenuButton>
													{/if}
												</SidebarMenuItem>
											{/each}
										</SidebarMenu>
									</CollapsibleContent>
								</Collapsible>
							{:else}
								<SidebarMenuButton 
									asChild 
									isActive={currentPath === item.href}
									class="w-full justify-start h-8 px-2 text-sm font-normal hover:bg-sidebar-accent/50 data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
								>
									<a href={item.href} class="flex items-center justify-between w-full">
										<div class="flex items-center">
											{#if item.title === 'Introduction'}
												<Info class="h-3 w-3 mr-2 opacity-60" />
											{:else if item.title === 'Installation'}
												<Download class="h-3 w-3 mr-2 opacity-60" />
											{:else if item.title === 'Changelog'}
												<FileText class="h-3 w-3 mr-2 opacity-60" />
											{:else if item.title === 'Types'}
												<FileText class="h-3 w-3 mr-2 opacity-60" />
											{:else if item.title === 'Utils'}
												<Wrench class="h-3 w-3 mr-2 opacity-60" />
											{:else}
												<BookOpen class="h-3 w-3 mr-2 opacity-60" />
											{/if}
											<span class="text-sm">{item.title}</span>
										</div>
										{#if item.disabled}
											<Badge variant="secondary" class="text-xs">Soon</Badge>
										{/if}
									</a>
								</SidebarMenuButton>
							{/if}
						</SidebarMenuItem>
					{/each}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	{/each}
</SidebarContent>

<SidebarFooter class="border-t p-4">
	<div class="flex items-center justify-between">
		<div class="flex items-center space-x-2">
			<Badge variant="outline" class="text-xs">zenGate Global</Badge>
		</div>
		<a 
			href="https://github.com/zengate/winter-authenticator" 
			class="flex items-center space-x-1 text-xs text-muted-foreground hover:text-primary transition-colors"
			target="_blank"
			rel="noopener noreferrer"
		>
			<Github class="h-3 w-3" />
			<span>GitHub</span>
		</a>
	</div>
</SidebarFooter>

