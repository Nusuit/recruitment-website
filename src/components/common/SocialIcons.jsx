// src/components/common/SocialIcons.jsx
import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// Ensure brand icons are registered in fontawesome.js:
// import { faFacebookF, faTwitter, faLinkedinIn, faInstagram, faYoutube } from '@fortawesome/free-brands-svg-icons';
// library.add(faFacebookF, faTwitter, faLinkedinIn, faInstagram, faYoutube);

const SocialIcons = ({
  className = "",
  iconSize = "lg", // FontAwesome size prop: xs, sm, lg, 2x, etc. or number
  iconColor = "text-gray-600", // Default Tailwind text color
  hoverColor = "hover:text-blue-500", // Default Tailwind hover color
  showLabels = false,
  links, // Optional: pass custom links, otherwise use defaults
  itemClassName = "", // Class for each <a> tag
}) => {
  const defaultSocialLinks = [
    {
      id: "facebook",
      icon: ["fab", "facebook-f"],
      label: "Facebook",
      url: "https://facebook.com/myacorp",
    },
    {
      id: "twitter",
      icon: ["fab", "twitter"],
      label: "Twitter",
      url: "https://twitter.com/myacorp",
    },
    {
      id: "linkedin",
      icon: ["fab", "linkedin-in"],
      label: "LinkedIn",
      url: "https://linkedin.com/company/myacorp",
    },
    {
      id: "instagram",
      icon: ["fab", "instagram"],
      label: "Instagram",
      url: "https://instagram.com/myacorp",
    },
    // { id: 'youtube', icon: ['fab', 'youtube'], label: 'YouTube', url: 'https://youtube.com/myacorp' }
  ];

  const socialLinksToRender = links || defaultSocialLinks;

  return (
    <div className={`social-icons flex items-center space-x-4 ${className}`}>
      {socialLinksToRender.map((social) => (
        <a
          key={social.id}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`social-icon-link transition-colors duration-200 ${iconColor} ${hoverColor} ${itemClassName}`}
          aria-label={social.label}
          title={social.label}
        >
          <FontAwesomeIcon icon={social.icon} size={iconSize} />
          {showLabels && (
            <span className="ml-2 text-sm sr-only md:not-sr-only">
              {social.label}
            </span>
          )}
        </a>
      ))}
    </div>
  );
};

SocialIcons.propTypes = {
  className: PropTypes.string,
  iconSize: PropTypes.string, // FontAwesome size prop
  iconColor: PropTypes.string, // Tailwind text color class
  hoverColor: PropTypes.string, // Tailwind hover text color class
  showLabels: PropTypes.bool,
  links: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]).isRequired, // For FontAwesome
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ),
  itemClassName: PropTypes.string,
};

export default SocialIcons;
