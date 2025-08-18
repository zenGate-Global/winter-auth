<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Upload, X } from '@lucide/svelte';

	interface Props {
		onFileSelect: (file: File) => void;
		accept?: string;
		maxSize?: number; // in MB
		disabled?: boolean;
		placeholder?: string;
		showPreview?: boolean;
	}

	let {
		onFileSelect,
		accept = 'image/*',
		maxSize = 10,
		disabled = false,
		placeholder = 'Choose an image file',
		showPreview = true
	}: Props = $props();

	let fileInput: HTMLInputElement;
	let selectedFile = $state<File | null>(null);
	let previewUrl = $state<string | null>(null);
	let error = $state<string | null>(null);

	function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		
		if (!file) return;
		
		error = null;
		
		// Validate file type
		if (accept === 'image/*' && !file.type.startsWith('image/')) {
			error = 'Please select a valid image file';
			return;
		}
		
		// Validate file size
		if (file.size > maxSize * 1024 * 1024) {
			error = `File size must be less than ${maxSize}MB`;
			return;
		}
		
		selectedFile = file;
		
		// Create preview URL if enabled
		if (showPreview && file.type.startsWith('image/')) {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
			previewUrl = URL.createObjectURL(file);
		}
		
		// Call the callback
		onFileSelect(file);
	}

	function clearFile() {
		if (fileInput) {
			fileInput.value = '';
		}
		selectedFile = null;
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			previewUrl = null;
		}
		error = null;
	}

	function openFileDialog() {
		fileInput?.click();
	}
</script>

<div class="space-y-4">
	<!-- Hidden file input -->
	<input
		bind:this={fileInput}
		type="file"
		{accept}
		onchange={handleFileSelect}
		class="hidden"
		{disabled}
	/>
	
	<!-- Upload area -->
	<div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
		{#if selectedFile && previewUrl}
			<!-- Preview -->
			<div class="space-y-4">
				<div class="relative inline-block">
					<img 
						src={previewUrl} 
						alt="Preview" 
						class="max-w-full max-h-48 rounded-lg shadow-md"
					/>
					<button
						onclick={clearFile}
						class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
						type="button"
					>
						<X class="h-4 w-4" />
					</button>
				</div>
				<div class="space-y-2">
					<p class="text-sm font-medium">{selectedFile.name}</p>
					<p class="text-xs text-gray-500">
						{(selectedFile.size / 1024 / 1024).toFixed(2)} MB
					</p>
				</div>
			</div>
		{:else}
			<!-- Upload prompt -->
			<Upload class="mx-auto h-12 w-12 text-gray-400 mb-4" />
			<p class="text-sm text-gray-600 mb-4">{placeholder}</p>
			<Button onclick={openFileDialog} {disabled} class="min-w-32">
				Select File
			</Button>
		{/if}
	</div>
	
	<!-- Error message -->
	{#if error}
		<div class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
			{error}
		</div>
	{/if}
	
	<!-- File info -->
	{#if selectedFile && !previewUrl}
		<div class="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-3 flex items-center justify-between">
			<div>
				<p class="font-medium">{selectedFile.name}</p>
				<p class="text-xs">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
			</div>
			<button
				onclick={clearFile}
				class="text-red-500 hover:text-red-700 transition-colors"
				type="button"
			>
				<X class="h-4 w-4" />
			</button>
		</div>
	{/if}
</div>
