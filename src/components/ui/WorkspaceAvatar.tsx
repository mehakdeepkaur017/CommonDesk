import React from 'react';

interface WorkspaceAvatarProps {
  name: string;
  logoUrl?: string;
  brandColor?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-16 h-16 text-xl',
  xl: 'w-24 h-24 text-3xl'
};

export const WorkspaceAvatar: React.FC<WorkspaceAvatarProps> = ({ 
  name, 
  logoUrl, 
  brandColor, 
  size = 'md',
  className = ''
}) => {
  const initials = name ? name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'W';
  
  if (logoUrl) {
    const fullLogoUrl = logoUrl.startsWith('http') 
      ? logoUrl 
      : `${import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'}${logoUrl}`;

    return (
      <div className={`rounded-xl overflow-hidden shrink-0 shadow-lg ${sizeClasses[size]} ${className}`}>
        <img src={fullLogoUrl} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  // Fallback to initials with brand color or default gradient
  const backgroundStyle = brandColor ? { backgroundColor: brandColor } : {};
  const defaultBgClass = !brandColor ? 'bg-gradient-to-br from-brand-indigo to-brand-violet' : '';

  return (
    <div 
      className={`rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-lg ${defaultBgClass} ${sizeClasses[size]} ${className}`}
      style={backgroundStyle}
    >
      {initials}
    </div>
  );
};
