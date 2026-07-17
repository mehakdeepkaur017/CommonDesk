export const forceDownload = async (secureUrl: string, filename: string) => {
  try {
    const url = `http://localhost:5000${secureUrl}`;
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
    console.error('Download failed, falling back to new tab', error);
    // Fallback to opening in a new tab if fetch fails
    window.open(`http://localhost:5000${secureUrl}`, '_blank');
  }
};
