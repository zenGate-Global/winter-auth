import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createWinterAuth, validateProviderConfiguration, SecurityStrength } from '@zengate/winter-auth';
import { 
	WAUTH_PROVIDER, 
	WAUTH_ACCESS_KEY, 
	WAUTH_SECRET_KEY, 
	WAUTH_AWS_REGION 
} from '$env/static/private';

// Server-side WinterAuth instance with protected API keys
let serverWinterAuth: ReturnType<typeof createWinterAuth> | null = null;

async function getServerWinterAuth() {
	if (!serverWinterAuth) {
		try {
			// Set environment variables for the Winter Auth library
			process.env.WAUTH_PROVIDER = WAUTH_PROVIDER;
			process.env.WAUTH_ACCESS_KEY = WAUTH_ACCESS_KEY;
			process.env.WAUTH_SECRET_KEY = WAUTH_SECRET_KEY;
			process.env.WAUTH_AWS_REGION = WAUTH_AWS_REGION;

			// Debug environment variables
			console.log('Environment check:', {
				WAUTH_PROVIDER: process.env.WAUTH_PROVIDER,
				WAUTH_ACCESS_KEY: process.env.WAUTH_ACCESS_KEY ? '***exists***' : 'missing',
				WAUTH_SECRET_KEY: process.env.WAUTH_SECRET_KEY ? '***exists***' : 'missing',
				WAUTH_AWS_REGION: process.env.WAUTH_AWS_REGION
			});

			serverWinterAuth = createWinterAuth({
				mode: 'direct', // Uses environment variables with protected API keys
				enableConsoleLogging: true, // Enable for debugging
				securityLevel: SecurityStrength.MEDIUM
			});
			await serverWinterAuth.initialize();
		} catch (error) {
			console.error('Failed to initialize WinterAuth:', error);
			// Re-throw with more helpful message for missing environment variables
			if (error instanceof Error && error.message.includes('environment')) {
				throw new Error('Environment variables not configured. Please set WAUTH_ACCESS_KEY and WAUTH_SECRET_KEY.');
			}
			throw error;
		}
	}
	return serverWinterAuth;
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const { method, params } = body;

		if (!method) {
			return json({
				error: 'Method is required',
				code: 'MISSING_METHOD'
			}, { status: 400 });
		}

		// Get server-side WinterAuth instance with protected keys
		const winterAuth = await getServerWinterAuth();

		// Execute the requested method with parameters
		let result;
		switch (method) {
			case 'checkImageQuality':
				if (!params?.image) {
					return json({
						error: 'Image parameter is required for checkImageQuality',
						code: 'MISSING_IMAGE'
					}, { status: 400 });
				}
				result = await winterAuth.checkImageQuality(params.image);
				break;

			case 'compareByImage':
				if (!params?.referenceImage || !params?.targetImage) {
					return json({
						error: 'Both referenceImage and targetImage are required for compareByImage',
						code: 'MISSING_IMAGES'
					}, { status: 400 });
				}
				result = await winterAuth.compareByImage(
					params.referenceImage,
					params.targetImage,
					{ securityLevel: params.securityLevel }
				);
				break;

			case 'compareByLiveVideo':
				if (!params?.referenceImage || !params?.videoFrame) {
					return json({
						error: 'Both referenceImage and videoFrame are required for compareByLiveVideo',
						code: 'MISSING_VIDEO_DATA'
					}, { status: 400 });
				}
				// Note: For live video, we'd need to handle video frames differently
				// This is a simplified implementation
				result = await winterAuth.compareByImage(
					params.referenceImage,
					params.videoFrame,
					{ securityLevel: params.securityLevel }
				);
				break;

			case 'getProviderInfo':
				result = winterAuth.getProviderInfo();
				break;

			case 'getStats':
				result = winterAuth.getStats();
				break;

			default:
				return json({
					error: `Unknown method: ${method}`,
					code: 'UNKNOWN_METHOD'
				}, { status: 400 });
		}

		return json({
			success: true,
			result,
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		console.error('Winter Auth API error:', error);
		
		// Check if this is an environment configuration error
		if (error instanceof Error && 
		    (error.message.includes('Environment variables not configured') ||
		     error.message.includes('WAUTH_ACCESS_KEY') ||
		     error.message.includes('WAUTH_SECRET_KEY') ||
		     error.message.includes('your_aws_access_key_here'))) {
			return json({
				error: 'Winter Auth not configured',
				message: 'Please update your .env file with real AWS credentials. The current values are just placeholders.',
				code: 'MISSING_CONFIGURATION',
				helpUrl: 'https://github.com/zengate/winter-authenticator/blob/main/src/modules/authorization/providers/README.md'
			}, { status: 503 }); // Service Unavailable
		}
		
		return json({
			error: 'Winter Auth operation failed',
			message: error instanceof Error ? error.message : 'Unknown error occurred',
			code: 'OPERATION_FAILED'
		}, { status: 500 });
	}
};