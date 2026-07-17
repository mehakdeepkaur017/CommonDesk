/**
 * Resolves any image URL (avatar, logo, etc.) to a full absolute URL.
 * Handles:
 *  - null/undefined → returns undefined
 *  - Already absolute URLs (http/https) → returned as-is
 *  - Relative paths (/uploads/...) → prefixed with the API base URL
 */
export const resolveImageUrl = (url: string | null | undefined): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};
