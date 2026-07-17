export const forceDownload = (secureUrl: string, filename: string) => {
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
  const fullUrl = secureUrl.startsWith('http') ? secureUrl : `${baseUrl}${secureUrl}`;
  const separator = fullUrl.includes('?') ? '&' : '?';
  const url = `${fullUrl}${separator}download=1`;
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
