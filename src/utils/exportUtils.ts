export const exportToCSV = (filename: string, data: any[]) => {
  if (!data || !data.length) return;
  
  // Extract headers
  const headers = Object.keys(data[0]);
  
  // Convert rows
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        let val = row[header];
        if (val === null || val === undefined) val = '';
        if (typeof val === 'object') val = JSON.stringify(val);
        // Escape quotes and wrap in quotes
        const stringVal = String(val).replace(/"/g, '""');
        return `"${stringVal}"`;
      }).join(',')
    )
  ].join('\n');
  
  // Trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
