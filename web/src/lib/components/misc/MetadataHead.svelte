<script lang="ts">
	import { useMetadata } from '$lib/context/metadata.svelte.js';
	import { page } from '$app/state';

	const metadata = useMetadata();
	
	const fullTitle = $derived(() => {
		const baseTitle = 'Winter Auth';
		const pageTitle = metadata.metadata.title;
		
		if (pageTitle === baseTitle || pageTitle === `${baseTitle} Documentation`) {
			return baseTitle;
		}
		
		return `${pageTitle} | ${baseTitle}`;
	});
	

	const canonicalUrl = $derived(() => {
		if (metadata.metadata.canonical) {
			return metadata.metadata.canonical;
		}
		
		const origin = page.url.origin;
		const pathname = page.url.pathname;
		return `${origin}${pathname}`;
	});
	

	const keywordsString = $derived(() => {
		return metadata.metadata.keywords?.join(', ') || '';
	});
</script>

<svelte:head>
	<title>{fullTitle()}</title>
	
	{#if metadata.metadata.description}
		<meta name="description" content={metadata.metadata.description} />
		<meta property="og:description" content={metadata.metadata.description} />
	{/if}
	
	{#if keywordsString()}
		<meta name="keywords" content={keywordsString()} />
	{/if}
	
	{#if metadata.metadata.noindex}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<meta name="robots" content="index, follow" />
	{/if}
	

	<meta property="og:title" content={fullTitle()} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={canonicalUrl()} />
	<meta property="og:site_name" content="Winter Auth" />
	

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={fullTitle()} />
	{#if metadata.metadata.description}
		<meta name="twitter:description" content={metadata.metadata.description} />
	{/if}
	
	
	<link rel="canonical" href={canonicalUrl()} />
	

	<meta name="author" content="zenGate Global" />
	<meta name="theme-color" content="#3b82f6" />
</svelte:head>