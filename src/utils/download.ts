export const forceDownload = async (secureUrl: string, filename: string) => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    const url = `${baseUrl}${secureUrl}`;
    const response = await fetch(url);
    
    if (!response.ok) throw new Error('Network response was not ok');
    
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.error('Download failed:', error);
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
    window.open(`${baseUrl}${secureUrl}`, '_blank');
  }
};
