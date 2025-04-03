import React, { useState } from 'react';

const EmployeeReviews = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const reviews = [
    {
      id: 1,
      content: "Working at MyaCorp has been an amazing journey. The company values innovation and provides a supportive environment for creative minds to flourish.",
      author: "Sarah T.",
      position: "Senior Fashion Designer",
      avatar: "/assets/images/team/employee-1.jpg",
      rating: 5
    },
    {
      id: 2,
      content: "I've grown so much professionally since joining the team. The mentorship opportunities and collaborative culture make this a truly special place to work.",
      author: "David L.",
      position: "Marketing Manager",
      avatar: "/assets/images/team/employee-2.jpg",
      rating: 5
    },
    {
      id: 3,
      content: "The work-life balance at MyaCorp is exceptional. Management understands that happy employees are productive employees, and it shows in the quality of our work.",
      author: "Emma H.",
      position: "Product Developer",
      avatar: "/assets/images/team/employee-3.jpg",
      rating: 4
    }
  ];
  
  const handlePrevClick = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? reviews.length - 1 : prevIndex - 1
    );
  };
  
  const handleNextClick = () => {
    setActiveIndex((prevIndex) => 
      prevIndex === reviews.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handleDotClick = (index) => {
    setActiveIndex(index);
  };
  
  return (
    <div className="reviews-container">
      <div className="reviews-slider">
        {reviews.map((review, index) => (
          <div 
            key={review.id} 
            className={`review-card ${index === activeIndex ? 'active' : ''}`}
            style={{ display: index === activeIndex ? 'block' : 'none' }}
          >
            <div className="review-stars">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`star-icon ${i < review.rating ? 'filled' : ''}`}
                >
                  ★
                </span>
              ))}
            </div>
            
            <p className="review-content">{review.content}</p>
            
            <div className="reviewer">
              <div className="reviewer-avatar">
                <img src={review.avatar} alt={review.author} />
              </div>
              <div className="reviewer-info">
                <h4>{review.author}</h4>
                <p className="reviewer-position">{review.position}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="slider-controls">
        <button className="slider-btn prev" onClick={handlePrevClick}>
          ‹
        </button>
        
        <div className="slider-dots">
          {reviews.map((_, index) => (
            <button 
              key={index} 
              className={`slider-dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
        
        <button className="slider-btn next" onClick={handleNextClick}>
          ›
        </button>
      </div>
    </div>
  );
};

export default EmployeeReviews;