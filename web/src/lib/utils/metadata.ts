/**
 * Utility functions for managing page metadata in Winter Auth documentation
 */

export interface PageMetadata {
	title: string;
	description?: string;
	keywords?: string[];
	canonical?: string;
	noindex?: boolean;
}

/**
 * Generate SEO-friendly keywords based on page content
 */
export function generateKeywords(
	baseKeywords: string[] = ['winter-auth', 'documentation'],
	...additionalKeywords: string[]
): string[] {
	const allKeywords = [
		...baseKeywords,
		...additionalKeywords.map(k => k.toLowerCase().replace(/\s+/g, '-'))
	];
	
	// Remove duplicates and empty strings
	return [...new Set(allKeywords.filter(Boolean))];
}

/**
 * Generate a consistent page title format
 */
export function generatePageTitle(pageTitle: string, sectionTitle?: string): string {
	if (sectionTitle) {
		return `${pageTitle} - ${sectionTitle}`;
	}
	return pageTitle;
}

/**
 * Generate a description fallback if none provided
 */
export function generateDescription(title: string, section?: string): string {
	const sectionText = section ? ` in ${section}` : '';
	return `Documentation for ${title}${sectionText} - Winter Auth biometric authentication and identity verification system.`;
}

/**
 * Common metadata presets for different types of documentation pages
 */
export const metadataPresets = {
	api: {
		keywords: ['api', 'reference', 'functions', 'methods'],
		description: 'API reference documentation'
	},
	
	guide: {
		keywords: ['guide', 'tutorial', 'how-to', 'examples'],
		description: 'Step-by-step guide'
	},
	
	concept: {
		keywords: ['concepts', 'overview', 'explanation', 'theory'],
		description: 'Conceptual documentation'
	},
	
	integration: {
		keywords: ['integration', 'setup', 'configuration', 'implementation'],
		description: 'Integration and setup guide'
	}
} as const;

/**
 * Apply a metadata preset with custom overrides
 */
export function applyMetadataPreset(
	preset: keyof typeof metadataPresets,
	customMetadata: Partial<PageMetadata>
): Partial<PageMetadata> {
	const presetData = metadataPresets[preset];
	
	return {
		keywords: generateKeywords(
			['winter-auth', 'documentation'],
			...(presetData.keywords || []),
			...(customMetadata.keywords || [])
		),
		description: customMetadata.description || presetData.description,
		...customMetadata
	};
}