export interface NavItem {
	title: string;
	href?: string;
	disabled?: boolean;
	external?: boolean;
	icon?: string;
	description?: string;
	collapsible?: boolean;
	category?: boolean;
	items?: NavItem[];
}

export interface NavGroup {
	title: string;
	items: NavItem[];
	collapsible?: boolean;
	icon?: string;
}

export const docsNavigation: NavGroup[] = [
	{
		title: "Get Started",
		collapsible: false,
		items: [
			{
				title: "Introduction",
				href: "/docs/get-started/introduction"
			},
			{
				title: "Installation",
				href: "/docs/get-started/installation"
			}
		]
	},
	{
		title: "Modules",
		collapsible: true,
		items: [
			{
				title: "Authorization",
				category: true,
				items: [
										{
						title: "Introduction",
						href: "/docs/modules/authorization/introduction"
					},
					{
						title: "Methods",
						category: true,
						items: [
					{
						title: "checkImageQuality()",
						href: "/docs/modules/authorization/check-image-quality"
					},
					{
						title: "compareByImage()",
						href: "/docs/modules/authorization/compare-by-image"
					},
					{
						title: "compareByLiveVideo()",
						href: "/docs/modules/authorization/compare-by-live-video"
					}
						]
					},
					{
						title: "Providers",
						category: true,
						items: [
							{
								title: "AWS Rekognition",
								href: "/docs/modules/authorization/providers/aws"
							}
						]
					}
				]
			},
			{
				title: "Metadata Extractor",
				category: true,
				items: [
					{
						title: "Introduction",
						href: "/docs/modules/metadata-extractor/introduction"
					},
					{
						title: "Methods",
						category: true,
						items: [
{
						title: "extractImageMetadata()",
						href: "/docs/modules/metadata-extractor/extract-image-metadata"
					},
					{
						title: "extractGPSOnly()",
						href: "/docs/modules/metadata-extractor/extract-gps-only"
					},
					{
						title: "hasGPSData()",
						href: "/docs/modules/metadata-extractor/has-gps-data"
					},
						]
					},					
					{
						title: "Edge Cases",
						href: "/docs/modules/metadata-extractor/edge-cases"
					}
				]
			},
			{
				title: "Credentials",
				category: true,
				items: [
					{
						title: "Introduction",
						href: "/docs/modules/credentials/introduction"
					}
				]
			}
		]
	},
	{
		title: "API Reference",
		collapsible: false,
		items: [
			{
				title: "Utils",
				href: "/docs/api/utils"
			},
			{
				title: "Error Codes",
				href: "/docs/api-reference/error-codes"
			},
			{
				title: "Type Definitions",
				href: "/docs/api-reference/type-definitions"
			}
		]
	}
];

export function getNavItemByPath(path: string): NavItem | null {
	for (const group of docsNavigation) {
		for (const item of group.items) {
			if (item.href === path) {
				return item;
			}
			// Check nested items
			if (item.items) {
				for (const nestedItem of item.items) {
					if (nestedItem.href === path) {
						return nestedItem;
					}
					// Check double nested items (providers)
					if (nestedItem.items) {
						for (const doubleNestedItem of nestedItem.items) {
							if (doubleNestedItem.href === path) {
								return doubleNestedItem;
							}
						}
					}
				}
			}
		}
	}
	return null;
}

export function getNavGroupByPath(path: string): NavGroup | null {
	for (const group of docsNavigation) {
		for (const item of group.items) {
			if (item.href === path) {
				return group;
			}
			// Check nested items
			if (item.items) {
				for (const nestedItem of item.items) {
					if (nestedItem.href === path) {
						return group;
					}
					// Check double nested items (providers)
					if (nestedItem.items) {
						for (const doubleNestedItem of nestedItem.items) {
							if (doubleNestedItem.href === path) {
								return group;
							}
						}
					}
				}
			}
		}
	}
	return null;
}

export function getAllNavItems(): NavItem[] {
	const allItems: NavItem[] = [];
	
	for (const group of docsNavigation) {
		for (const item of group.items) {
			if (item.href) {
				allItems.push(item);
			}
			// Add nested items
			if (item.items) {
				for (const nestedItem of item.items) {
					if (nestedItem.href) {
						allItems.push(nestedItem);
					}
					// Add double nested items (providers)
					if (nestedItem.items) {
						for (const doubleNestedItem of nestedItem.items) {
							if (doubleNestedItem.href) {
								allItems.push(doubleNestedItem);
							}
						}
					}
				}
			}
		}
	}
	
	return allItems;
}

export function getNextNavItem(currentPath: string): NavItem | null {
	const allItems = getAllNavItems();
	const currentIndex = allItems.findIndex(item => item.href === currentPath);
	if (currentIndex !== -1 && currentIndex < allItems.length - 1) {
		return allItems[currentIndex + 1];
	}
	return null;
}

export function getPreviousNavItem(currentPath: string): NavItem | null {
	const allItems = getAllNavItems();
	const currentIndex = allItems.findIndex(item => item.href === currentPath);
	if (currentIndex > 0) {
		return allItems[currentIndex - 1];
	}
	return null;
}