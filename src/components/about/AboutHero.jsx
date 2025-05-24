// src/components/about/AboutHero.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AboutHero = () => {
  return (
    <section className="about-hero-section py-20 md:py-28 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 text-white relative overflow-hidden">
      {/* Optional: Decorative background elements */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-white/10 rounded-full opacity-50 animate-pulse"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-white/10 rounded-full opacity-50 animate-pulse delay-500"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        {/* Icon có thể thay đổi cho phù hợp hơn, ví dụ 'info-circle' hoặc 'building' */}
        <FontAwesomeIcon
          icon="users" // Hoặc một icon khác phù hợp với "About Us"
          className="text-5xl md:text-6xl text-yellow-300 mb-6"
        />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 leading-tight tracking-tight">
          About SIUUUcorp
        </h1>
        <p className="text-lg md:text-xl text-orange-100 max-w-3xl mx-auto">
          We're not just a company; we're a collective of passionate innovators,
          skilled professionals, and creative minds dedicated to redefining the
          fashion landscape.
        </p>
      </div>
    </section>
  );
};

export default AboutHero;
