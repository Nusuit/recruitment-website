// src/components/about/AboutHero.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AboutHero = () => {
  return (
    <section className="about-hero-section py-20 md:py-32 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white relative overflow-hidden">
      {/* Optional: Add some subtle background patterns or shapes */}
      <div className="absolute inset-0 opacity-10">
        {/* Example: <div className="absolute top-0 left-0 w-1/3 h-full bg-white/10 transform -skew-x-12 -translate-x-1/4"></div> */}
      </div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <FontAwesomeIcon
          icon="building"
          className="text-6xl text-yellow-300 mb-6"
        />
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
          About MyaCorp
        </h1>
        <p className="text-lg md:text-xl text-purple-100 mb-4 max-w-3xl mx-auto">
          Pioneering the future of fashion with creativity, sustainability, and
          a passion for style.
        </p>
        <p className="text-md text-purple-200 max-w-2xl mx-auto leading-relaxed">
          MyaCorp is more than just a fashion brand; we are a collective of
          innovators, designers, and strategists committed to making a positive
          impact on the industry and the world. Discover our story, our values,
          and the people who make MyaCorp a unique place to work and grow.
        </p>
      </div>
    </section>
  );
};

export default AboutHero;
