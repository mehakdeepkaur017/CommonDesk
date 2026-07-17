import React from 'react';
import { resolveImageUrl } from '../../utils/resolveImageUrl';

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  size?: string; // tailwind size classes like "w-6 h-6"
  className?: string;
}

/**
 * A universal user avatar component that correctly resolves avatar URLs
 * whether they are absolute (http://...) or relative (/uploads/...).
 * Falls back to showing the user's initials.
 */
export const UserAvatar: React.FC<UserAvatarProps> = ({ 
  src, 
  name = '?', 
  size = 'w-8 h-8',
  className = '' 
}) => {
  const resolved = resolveImageUrl(src);
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  if (resolved) {
    return (
      <img 
        src={resolved} 
        alt={name} 
        className={`${size} rounded-full object-cover ${className}`}
        onError={(e) => {
          // On error, hide the image and show initials fallback
          (e.target as HTMLImageElement).style.display = 'none';
          const parent = (e.target as HTMLImageElement).parentElement;
          if (parent) {
            const fallback = document.createElement('div');
            fallback.className = `${size} rounded-full bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center text-white text-xs font-bold ${className}`;
            fallback.textContent = initials;
            parent.replaceChild(fallback, e.target as HTMLImageElement);
          }
        }}
      />
    );
  }

  return (
    <div className={`${size} rounded-full bg-gradient-to-br from-brand-indigo to-brand-violet flex items-center justify-center text-white text-xs font-bold ${className}`}>
      {initials}
    </div>
  );
};
