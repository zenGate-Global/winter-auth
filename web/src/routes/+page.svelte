<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		// Redirect to documentation
		goto('/docs/get-started/introduction');
	});
</script>

<div class="flex items-center justify-center min-h-screen">
	<div class="text-center">
		<h1 class="text-2xl font-bold mb-4">Winter Authenticator</h1>
		<p class="text-muted-foreground">Redirecting to documentation...</p>
	</div>
</div>
