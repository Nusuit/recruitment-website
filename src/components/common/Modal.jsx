// src/components/common/Modal.jsx
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Modal = ({ title, children, onClose, isOpen, size = "md" }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    document.body.style.overflow = "hidden"; // Prevent background scrolling

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
      document.body.style.overflow = "auto"; // Restore scrolling
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleOverlayClick = (e) => {
    // Only close if the overlay itself is clicked, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md", // Default
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    full: "max-w-full h-full rounded-none",
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-in-out"
      onClick={handleOverlayClick} // Close on overlay click
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full ${
          sizeClasses[size] || sizeClasses.md
        } flex flex-col max-h-[90vh] transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow`}
        // onClick={(e) => e.stopPropagation()} // Prevent click inside modal from closing it, handled by overlay click
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 md:p-5 border-b border-gray-200">
          <h3 id="modal-title" className="text-xl font-semibold text-gray-800">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Close modal"
          >
            <FontAwesomeIcon icon="times" size="lg" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 md:p-5 flex-grow overflow-y-auto">{children}</div>
        {/* Optional: Modal Actions/Footer can be added here if needed by passing props */}
      </div>
      {/* Add keyframes for modalShow animation in your global CSS or Tailwind config */}
      <style jsx global>{`
        @keyframes modalShow {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-modalShow {
          animation: modalShow 0.3s forwards;
        }
      `}</style>
    </div>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  size: PropTypes.oneOf(["sm", "md", "lg", "xl", "2xl", "3xl", "full"]),
};

export default Modal;
