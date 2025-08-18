import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	optimizeDeps: {
		include: ['shiki']
	},
	ssr: {
		noExternal: ['shiki', 'bits-ui']
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					shiki: ['shiki']
				}
			}
		}
	}
});
