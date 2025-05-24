// src/components/home/EmployeeReviews.jsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faChevronLeft, faChevronRight, faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
// import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'; // For empty stars if needed

const EmployeeReviews = () => {
  const reviewsData = [
    {
      id: 1,
      quote:
        "Working at MyaCorp has been an incredible journey. The company truly values innovation and provides a supportive environment for creative minds to flourish. I feel empowered every day.",
      author: "Sarah Thompson",
      position: "Senior Fashion Designer",
      avatar: "/assets/images/team/employee-1.jpg", // Replace with actual or placeholder path
      rating: 5,
    },
    {
      id: 2,
      quote:
        "I've grown so much professionally since joining the team. The mentorship opportunities and collaborative culture make MyaCorp a truly special place to work. Highly recommended!",
      author: "David Lee",
      position: "Marketing Manager",
      avatar: "/assets/images/team/employee-2.jpg",
      rating: 5,
    },
    {
      id: 3,
      quote:
        "The work-life balance here is exceptional. Management understands that happy employees are productive employees, and it genuinely shows in the quality of our work and team morale.",
      author: "Emma Rodriguez",
      position: "Product Developer",
      avatar: "/assets/images/team/employee-3.jpg",
      rating: 4,
    },
    {
      id: 4,
      quote:
        "Being part of a company that's so committed to sustainability and ethical practices is inspiring. MyaCorp walks the talk, and I'm proud to contribute to that mission.",
      author: "Michael Chen",
      position: "Supply Chain Analyst",
      avatar: "/assets/images/team/employee-4.jpg", // Add more diverse avatars
      rating: 5,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? reviewsData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === reviewsData.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Auto-slide functionality (optional)
  useEffect(() => {
    const timer = setTimeout(() => {
      handleNext();
    }, 7000); // Change slide every 7 seconds
    return () => clearTimeout(timer);
  }, [activeIndex]);

  const currentReview = reviewsData[activeIndex];

  return (
    <section className="employee-reviews-section py-16 md:py-24 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Voices from Our Team
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hear what our talented employees have to say about their experience
            at MyaCorp.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/70 hover:bg-white rounded-full shadow-lg transition-all text-gray-600 hover:text-blue-600"
            aria-label="Previous review"
          >
            <FontAwesomeIcon icon="chevron-left" />
          </button>

          {/* Review Content - with transition */}
          <div
            className="review-content-slider"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {reviewsData.map((review) => (
              <div
                key={review.id}
                className="review-slide w-full flex-shrink-0 text-center"
              >
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full mx-auto mb-6 border-4 border-blue-200 shadow-md object-cover"
                />
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={
                        i < review.rating ? ["fas", "star"] : ["far", "star"]
                      } // Assuming fas for solid, far for regular
                      className="text-yellow-400 text-xl"
                    />
                  ))}
                </div>
                <blockquote className="text-lg md:text-xl italic text-gray-700 mb-6 leading-relaxed">
                  "{review.quote}"
                </blockquote>
                <h4 className="font-semibold text-gray-800 text-lg">
                  {review.author}
                </h4>
                <p className="text-sm text-gray-500">{review.position}</p>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/70 hover:bg-white rounded-full shadow-lg transition-all text-gray-600 hover:text-blue-600"
            aria-label="Next review"
          >
            <FontAwesomeIcon icon="chevron-right" />
          </button>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-8 space-x-2">
            {reviewsData.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                                    ${
                                      activeIndex === index
                                        ? "bg-blue-600 scale-125"
                                        : "bg-gray-300 hover:bg-gray-400"
                                    }
                                `}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Basic styling for slider effect (can be moved to SCSS) */}
      <style jsx>{`
        .review-content-slider {
          display: flex;
          transition: transform 0.5s ease-in-out;
        }
        .review-slide {
          min-width: 100%;
          box-sizing: border-box;
        }
      `}</style>
    </section>
  );
};

export default EmployeeReviews;
