import { createHighlighter, type Highlighter } from 'shiki';

class HighlighterService {
	private static instance: HighlighterService;
	private highlighter: Highlighter | null = null;
	private initPromise: Promise<Highlighter> | null = null;

	private constructor() {}

	static getInstance(): HighlighterService {
		if (!HighlighterService.instance) {
			HighlighterService.instance = new HighlighterService();
		}
		return HighlighterService.instance;
	}

	async getHighlighter(): Promise<Highlighter> {
		// If already initialized, return the existing highlighter
		if (this.highlighter) {
			return this.highlighter;
		}

		// If initialization is in progress, wait for it
		if (this.initPromise) {
			return this.initPromise;
		}

		// Start initialization
		this.initPromise = this.initialize();
		this.highlighter = await this.initPromise;
		this.initPromise = null;

		return this.highlighter;
	}

	private async initialize(): Promise<Highlighter> {
		try {
			const highlighter = await createHighlighter({
				themes: ['github-light', 'github-dark'],
				langs: ['typescript', 'javascript', 'json', 'bash', 'html', 'css', 'svelte', 'jsx', 'tsx']
			});
			return highlighter;
		} catch (error) {
			console.error('Failed to initialize Shiki highlighter:', error);
			throw error;
		}
	}

	highlightCode(code: string, language: string, theme: string): string {
		if (!this.highlighter) {
			throw new Error('Highlighter not initialized');
		}

		return this.highlighter.codeToHtml(code, {
			lang: language,
			theme: theme as any
		});
	}

	dispose(): void {
		if (this.highlighter) {
			this.highlighter.dispose();
			this.highlighter = null;
		}
	}
}

export const highlighterService = HighlighterService.getInstance();