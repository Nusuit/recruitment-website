// src/components/home/EmployeeReviews.jsx
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EmployeeReviews = () => {
  const reviewsData = [
    {
      id: 1,
      quote:
        "I love the freedom to design with creativity and focus on user experience. It's where design and innovation thrive.",
      author: "Robert Fox",
      position: "Designer",
      avatar: "/assets/images/avatars/robert-fox.png",
      rating: 5,
    },
    {
      id: 2,
      quote:
        "Being part of this team is an exciting journey of creativity and innovation. It's a great place for anyone passionate about fashion!",
      author: "Bessie Cooper",
      position: "Creative Director",
      avatar: "/assets/images/avatars/bessie-cooper.png",
      rating: 5,
    },
    {
      id: 3,
      quote:
        "Capturing fashion through my lens here has been a dream come true. The team is supportive and passionate!",
      author: "Jane Cooper",
      position: "Photographer",
      avatar: "/assets/images/avatars/jane-cooper.png",
      rating: 5,
    },
    {
      id: 4,
      quote:
        "The collaborative environment at MyaCorp is fantastic. We are constantly pushing boundaries and supporting each other's growth.",
      author: "Alex Green",
      position: "UX Researcher",
      avatar: "/assets/images/avatars/alex-green.png",
      rating: 4,
    },
    {
      id: 5,
      quote:
        "MyaCorp's commitment to sustainability is what drew me in, and the innovative projects keep me excited every day.",
      author: "Maria Rodriguez",
      position: "Sustainability Lead",
      avatar: "/assets/images/avatars/maria-rodriguez.png",
      rating: 5,
    },
  ];

  const itemsPerPage = 3; // Number of reviews displayed per page on desktop
  const totalPages = Math.ceil(reviewsData.length / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(0); // Current page index

  const handlePrev = () => {
    setCurrentPage((prevPage) =>
      prevPage === 0 ? totalPages - 1 : prevPage - 1
    );
  };

  const handleNext = () => {
    setCurrentPage((prevPage) =>
      prevPage === totalPages - 1 ? 0 : prevPage + 1
    );
  };

  // Auto-slide functionality
  useEffect(() => {
    if (reviewsData.length <= itemsPerPage) return; // Skip auto-slide if not enough items
    const timer = setTimeout(() => {
      handleNext();
    }, 7000); // Change slide every 7 seconds
    return () => clearTimeout(timer);
  }, [currentPage, reviewsData.length]);

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon
          key={i}
          icon={i <= rating ? ["fas", "star"] : ["far", "star"]}
          className="text-yellow-400"
        />
      );
    }
    return stars;
  };

  // Chunk reviewsData into pages of 3 (or less for the last page)
  const paginatedReviews = [];
  for (let i = 0; i < reviewsData.length; i += itemsPerPage) {
    paginatedReviews.push(reviewsData.slice(i, i + itemsPerPage));
  }

  return (
    <section className="employee-reviews-section py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Employee Reviews
          </h2>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="overflow-hidden relative">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {paginatedReviews.map((pageItems, pageIndex) => (
                <div
                  key={pageIndex}
                  className="page-slide w-full flex-shrink-0"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-2">
                    {pageItems.map((review) => (
                      <div
                        key={review.id}
                        className="review-card bg-gray-50 p-6 md:p-8 rounded-xl shadow-lg border border-gray-100 min-h-[280px] flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-center mb-4 text-lg">
                            {renderStars(review.rating)}
                          </div>
                          <blockquote className="text-sm md:text-md italic text-gray-700 mb-6 leading-relaxed text-center">
                            "{review.quote}"
                          </blockquote>
                        </div>
                        <div className="text-center mt-auto">
                          <img
                            src={
                              review.avatar ||
                              "/assets/images/default-avatar.png"
                            }
                            alt={review.author}
                            className="w-14 h-14 rounded-full mx-auto mb-3 border-2 border-teal-300 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/56x56/cccccc/333333?text=Avatar";
                            }}
                          />
                          <h4 className="font-semibold text-gray-800 text-sm md:text-base">
                            {review.author}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {review.position}
                          </p>
                        </div>
                      </div>
                    ))}
                    {/* Fill empty spots if last page has less than 3 items for consistent height */}
                    {pageItems.length < itemsPerPage &&
                      Array(itemsPerPage - pageItems.length)
                        .fill(null)
                        .map((_, i) => (
                          <div
                            key={`empty-${i}`}
                            className="hidden md:block"
                          ></div>
                        ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {reviewsData.length > itemsPerPage && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/80 hover:bg-white rounded-full shadow-md transition-all text-gray-600 hover:text-teal-600 -ml-4 md:-ml-8"
                aria-label="Previous review page"
              >
                <FontAwesomeIcon icon="angle-left" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-3 bg-white/80 hover:bg-white rounded-full shadow-md transition-all text-gray-600 hover:text-teal-600 -mr-4 md:-mr-8"
                aria-label="Next review page"
              >
                <FontAwesomeIcon icon="angle-right" />
              </button>
            </>
          )}
          {reviewsData.length > itemsPerPage && (
            <div className="flex justify-center mt-8 space-x-2">
              {paginatedReviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 focus:outline-none
                                    ${
                                      currentPage === index
                                        ? "bg-teal-500 scale-125"
                                        : "bg-gray-300 hover:bg-gray-400"
                                    }
                                `}
                  aria-label={`Go to review page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EmployeeReviews;
