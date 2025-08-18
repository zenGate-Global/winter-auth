import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		// Simple health check for development
		const provider = process.env.WAUTH_PROVIDER || 'aws';
		const accessKey = process.env.WAUTH_ACCESS_KEY;
		const secretKey = process.env.WAUTH_SECRET_KEY;
		
		const hasAccessKey = !!accessKey && !accessKey.includes('your_aws_access_key_here');
		const hasSecretKey = !!secretKey && !secretKey.includes('your_aws_secret_key_here');
		
		const isConfigured = hasAccessKey && hasSecretKey;
		
		return json({
			status: isConfigured ? 'healthy' : 'warning',
			provider,
			configured: isConfigured,
			message: isConfigured 
				? 'Winter Auth API is ready' 
				: 'Environment variables contain placeholder values. Please update .env with real AWS credentials.',
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		return json({
			status: 'error',
			message: 'Health check failed',
			error: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 });
	}
};
