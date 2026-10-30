import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeMarkdown, maskApiKey, isValidApiKeyFormat } from './security';

describe('Security & Sanitization Engine', () => {
  it('escapes dangerous HTML characters in raw input', () => {
    const malicious = '<script>alert("hack")</script>';
    const sanitized = sanitizeInput(malicious);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toContain('&lt;script&gt;');
  });

  it('strips harmful script tags and event handlers from markdown', () => {
    const maliciousMd = 'Hello <script>fetch("evil.com")</script> World <img src="x" onerror="alert(1)">';
    const sanitized = sanitizeMarkdown(maliciousMd);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).not.toContain('onerror=');
  });

  it('masks API keys securely showing only prefix and suffix', () => {
    const apiKey = 'AIzaSyDn983hjsd8293nd8923ksmdk';
    const masked = maskApiKey(apiKey);
    expect(masked.startsWith('AIza')).toBe(true);
    expect(masked.endsWith('mdk')).toBe(true);
    expect(masked).toContain('••••');
  });

  it('validates API key structure format accurately', () => {
    expect(isValidApiKeyFormat('AIzaSyD-1234567890abcdef_XYZ')).toBe(true);
    expect(isValidApiKeyFormat('short_key')).toBe(false);
    expect(isValidApiKeyFormat('invalid key with spaces!!')).toBe(false);
  });
});
