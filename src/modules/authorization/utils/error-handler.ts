import type { WinterAuthError } from '../types';

/**
 * Creates a standardized error object for the Winter Authenticator module.
 * @param code - A unique error code from the predefined constants.
 * @param message - A human-readable error message.
 * @param originalError - The original error object, if any.
 * @returns A WinterAuthError object.
 */
export function createError(code: string, message: string, originalError?: unknown): WinterAuthError {
  const error: WinterAuthError = {
    code,
    message,
    timestamp: Date.now(),
  };

  if (originalError) {
    error.details = originalError instanceof Error ? originalError.toString() : JSON.stringify(originalError);
  }

  // To be controlled by the main class config
  // console.error(`[WinterAuthError] ${code}: ${message}`, originalError);

  return error;
}
