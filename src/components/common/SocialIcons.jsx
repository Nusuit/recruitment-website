import React from 'react';

const SocialIcons = ({ className = '', size = 'medium', color = 'default', showLabels = false }) => {
  // Social media links
  const socialLinks = [
    {
      id: 'facebook',
      icon: 'facebook-icon',
      label: 'Facebook',
      url: 'https://facebook.com'
    },
    {
      id: 'twitter',
      icon: 'twitter-icon',
      label: 'Twitter',
      url: 'https://twitter.com'
    },
    {
      id: 'instagram',
      icon: 'instagram-icon',
      label: 'Instagram',
      url: 'https://instagram.com'
    },
    {
      id: 'linkedin',
      icon: 'linkedin-icon',
      label: 'LinkedIn',
      url: 'https://linkedin.com'
    },
    {
      id: 'youtube',
      icon: 'youtube-icon',
      label: 'YouTube',
      url: 'https://youtube.com'
    }
  ];

  // Size classes
  const sizeClasses = {
    small: 'social-icons-sm',
    medium: '',
    large: 'social-icons-lg'
  };

  // Color classes
  const colorClasses = {
    default: '',
    primary: 'social-icons-primary',
    light: 'social-icons-light',
    dark: 'social-icons-dark'
  };

  // Combined classes
  const combinedClassName = `social-icons ${sizeClasses[size]} ${colorClasses[color]} ${className}`;

  return (
    <div className={combinedClassName}>
      {socialLinks.map(social => (
        <a 
          key={social.id}
          href={social.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-icon-link"
          aria-label={social.label}
        >
          <span className={`social-icon ${social.icon}`}></span>
          {showLabels && <span className="social-label">{social.label}</span>}
        </a>
      ))}
    </div>
  );
};

export default SocialIcons;