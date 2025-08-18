<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/docs/get-started/introduction');
	});
</script>

<div class="flex items-center justify-center min-h-screen">
	<p class="text-muted-foreground">Redirecting to documentation...</p>
</div>