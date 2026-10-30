/**
 * Sanitize user input to prevent XSS attacks.
 * Strips HTML tags and escapes dangerous characters.
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitize markdown content from AI responses.
 * Allows safe markdown but strips script tags, event handlers, etc.
 */
export function sanitizeMarkdown(md: string): string {
  return md
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '');
}

/**
 * Mask an API key for display purposes.
 * Shows first 4 and last 4 characters.
 */
export function maskApiKey(key: string): string {
  if (key.length <= 8) return '••••••••';
  return `${key.slice(0, 4)}${'•'.repeat(Math.min(key.length - 8, 20))}${key.slice(-4)}`;
}

/**
 * Validate that a string looks like a Gemini API key
 */
export function isValidApiKeyFormat(key: string): boolean {
  return key.length >= 20 && /^[A-Za-z0-9_-]+$/.test(key);
}
