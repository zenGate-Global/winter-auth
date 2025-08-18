import { getContext, setContext } from 'svelte';

export interface MetadataState {
	title: string;
	description?: string;
	keywords?: string[];
	canonical?: string;
	noindex?: boolean;
}

const METADATA_CONTEXT_KEY = Symbol('metadata');

export function createMetadataContext() {
	let metadata = $state<MetadataState>({
		title: 'Winter Auth Documentation',
		description: 'Comprehensive documentation for Winter Auth - Biometric authentication and identity verification for supply chain applications.',
		keywords: ['winter-auth', 'biometric', 'authentication', 'documentation', 'identity', 'verification']
	});

	function setTitle(title: string) {
		metadata.title = title;
	}

	function setDescription(description: string) {
		metadata.description = description;
	}

	function setKeywords(keywords: string[]) {
		metadata.keywords = keywords;
	}

	function setCanonical(canonical: string) {
		metadata.canonical = canonical;
	}

	function setNoindex(noindex: boolean) {
		metadata.noindex = noindex;
	}

	function setMetadata(newMetadata: Partial<MetadataState>) {
		metadata = { ...metadata, ...newMetadata };
	}

	function resetMetadata() {
		metadata = {
			title: 'Winter Auth Documentation',
			description: 'Comprehensive documentation for Winter Auth - Biometric authentication and identity verification for supply chain applications.',
			keywords: ['winter-auth', 'biometric', 'authentication', 'documentation', 'identity', 'verification']
		};
	}

	const context = {
		get metadata() {
			return metadata;
		},
		setTitle,
		setDescription,
		setKeywords,
		setCanonical,
		setNoindex,
		setMetadata,
		resetMetadata
	};

	setContext(METADATA_CONTEXT_KEY, context);
	return context;
}

export function useMetadata() {
	const context = getContext<ReturnType<typeof createMetadataContext>>(METADATA_CONTEXT_KEY);
	if (!context) {
		throw new Error('useMetadata must be used within a metadata context provider');
	}
	return context;
}