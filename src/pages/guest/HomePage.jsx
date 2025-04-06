import React, { useState } from 'react';

const HomePage = () => {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    category: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching with:', searchParams);
    // In a real application, this would navigate to search results
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Step into the Fashion World<br />
              Join Our Creative Team
            </h1>
            <p className="hero-subtitle">
              Find your dream job in the fashion industry. We offer a diverse range of opportunities
              that fit your skills and passion.
            </p>

            <form onSubmit={handleSearch} className="search-form">
              <div className="search-inputs">
                <div className="search-input-group">
                  <input
                    type="text"
                    name="keyword"
                    placeholder="Job title, Keywords..."
                    value={searchParams.keyword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="search-input-group">
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={searchParams.location}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="search-input-group">
                  <select
                    name="category"
                    value={searchParams.category}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Category</option>
                    <option value="design">Fashion Design</option>
                    <option value="marketing">Marketing</option>
                    <option value="sales">Sales</option>
                    <option value="production">Production</option>
                    <option value="management">Management</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="search-button">
                Search Jobs
              </button>
            </form>
          </div>
          <div className="hero-image">
            <img 
              src="/api/placeholder/500/400" 
              alt="Fashion professional" 
            />
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="latest-jobs-section">
        <div className="container">
          <div className="section-header">
            <h2>Latest Job Openings</h2>
            <a href="/jobs" className="view-all-link">View all openings</a>
          </div>
          
          <div className="job-cards">
            {/* Job Card 1 */}
            <div className="job-card">
              <div className="job-card-content">
                <h3 className="job-title">
                  <a href="/jobs/1">Fashion Designer</a>
                </h3>
                
                <div className="job-info">
                  <div className="job-meta">
                    <span className="company">MyaCorp</span>
                    <span className="location">
                      <i className="location-icon"></i>
                      HCM, Vietnam
                    </span>
                    <span className="job-type">Full Time</span>
                  </div>
                  
                  <div className="job-salary">
                    <i className="salary-icon"></i>
                    <span>$2500 - $3500</span>
                  </div>
                </div>
                
                <div className="job-deadline">
                  <span className="deadline-label">12 days remaining</span>
                </div>
              </div>
              
              <div className="job-card-actions">
                <button className="save-job-btn">
                  <i className="bookmark-icon"></i>
                </button>
                
                <a href="/jobs/1/apply" className="apply-now-btn">
                  Apply Now
                </a>
              </div>
            </div>

            {/* Job Card 2 */}
            <div className="job-card">
              <div className="job-card-content">
                <h3 className="job-title">
                  <a href="/jobs/2">Store Manager</a>
                </h3>
                
                <div className="job-info">
                  <div className="job-meta">
                    <span className="company">MyaCorp</span>
                    <span className="location">
                      <i className="location-icon"></i>
                      Hanoi, Vietnam
                    </span>
                    <span className="job-type">Full Time</span>
                  </div>
                  
                  <div className="job-salary">
                    <i className="salary-icon"></i>
                    <span>$2800 - $3500</span>
                  </div>
                </div>
                
                <div className="job-deadline">
                  <span className="deadline-label">8 days remaining</span>
                </div>
              </div>
              
              <div className="job-card-actions">
                <button className="save-job-btn">
                  <i className="bookmark-icon"></i>
                </button>
                
                <a href="/jobs/2/apply" className="apply-now-btn">
                  Apply Now
                </a>
              </div>
            </div>

            {/* Job Card 3 */}
            <div className="job-card">
              <div className="job-card-content">
                <h3 className="job-title">
                  <a href="/jobs/3">Marketing Specialist</a>
                </h3>
                
                <div className="job-info">
                  <div className="job-meta">
                    <span className="company">MyaCorp</span>
                    <span className="location">
                      <i className="location-icon"></i>
                      HCM, Vietnam
                    </span>
                    <span className="job-type">Remote</span>
                  </div>
                  
                  <div className="job-salary">
                    <i className="salary-icon"></i>
                    <span>$2200 - $2800</span>
                  </div>
                </div>
                
                <div className="job-deadline">
                  <span className="deadline-label">14 days remaining</span>
                </div>
              </div>
              
              <div className="job-card-actions">
                <button className="save-job-btn">
                  <i className="bookmark-icon"></i>
                </button>
                
                <a href="/jobs/3/apply" className="apply-now-btn">
                  Apply Now
                </a>
              </div>
            </div>

            {/* Job Card 4 */}
            <div className="job-card">
              <div className="job-card-content">
                <h3 className="job-title">
                  <a href="/jobs/4">Sales Associate</a>
                </h3>
                
                <div className="job-info">
                  <div className="job-meta">
                    <span className="company">MyaCorp</span>
                    <span className="location">
                      <i className="location-icon"></i>
                      HCM, Vietnam
                    </span>
                    <span className="job-type">Full Time</span>
                  </div>
                  
                  <div className="job-salary">
                    <i className="salary-icon"></i>
                    <span>$1800 - $2200</span>
                  </div>
                </div>
                
                <div className="job-deadline">
                  <span className="deadline-label">10 days remaining</span>
                </div>
              </div>
              
              <div className="job-card-actions">
                <button className="save-job-btn">
                  <i className="bookmark-icon"></i>
                </button>
                
                <a href="/jobs/4/apply" className="apply-now-btn">
                  Apply Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us Section */}
      <section className="why-join-section">
        <div className="container">
          <h2>Why Join MyaCorp?</h2>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon collaborative-icon"></div>
              <h3>Collaborative Culture</h3>
              <p>Work with a diverse team in an environment that values creativity and teamwork.</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon growth-icon"></div>
              <h3>Professional Growth</h3>
              <p>Develop your skills through ongoing training and advancement opportunities.</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon innovation-icon"></div>
              <h3>Innovation at Scale</h3>
              <p>Be part of a forward-thinking company that embraces new technologies and ideas.</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon benefits-icon"></div>
              <h3>Competitive Benefits</h3>
              <p>Enjoy comprehensive health insurance, retirement plans, and generous vacation time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="steps-section">
        <div className="container">
          <h2>Only 3 Steps to Get Your Dream Job!</h2>
          
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon search-icon"></div>
              <h3>Search for Job</h3>
              <p>Browse our extensive catalog of fashion industry positions to find your perfect match.</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon apply-icon"></div>
              <h3>Submit Your CV</h3>
              <p>Complete our simple application process and upload your resume in just a few clicks.</p>
            </div>
            
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon hired-icon"></div>
              <h3>Get Hired</h3>
              <p>Interview with our team and start your journey with a global fashion leader.</p>
            </div>
          </div>
          
          <div className="steps-cta">
            <a href="/jobs" className="browse-jobs-btn">
              Browse Open Positions
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2>What Our Employees Say</h2>
          
          <div className="testimonials-slider">
            <div className="testimonial-card">
              <div className="testimonial-rating">
                ★★★★★
              </div>
              <p className="testimonial-text">
                "Working at MyaCorp has been an amazing journey. The company values innovation and provides a supportive environment for creative minds to flourish."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <img src="/api/placeholder/60/60" alt="Employee" />
                </div>
                <div className="author-info">
                  <h4>Sarah T.</h4>
                  <p>Senior Fashion Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Add CSS styles
const styles = {
  // Global styles
  ':root': {
    '--primary-color': '#0056b3',
    '--primary-dark': '#003b7a',
    '--secondary-color': '#6c757d',
    '--success-color': '#28a745',
    '--white': '#ffffff',
    '--light-gray': '#f8f9fa',
    '--medium-gray': '#e9ecef',
    '--dark-gray': '#343a40',
    '--border-radius': '5px',
    '--box-shadow': '0 4px 6px rgba(0, 0, 0, 0.1)',
    '--transition': 'all 0.3s ease',
    '--font-family': "'Inter', -apple-system, system-ui, sans-serif"
  },
  
  // Basic resets
  '*': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0
  },
  
  'body': {
    fontFamily: 'var(--font-family)',
    color: 'var(--dark-gray)',
    backgroundColor: 'var(--light-gray)',
    lineHeight: 1.6
  },
  
  // Container
  '.container': {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px'
  },
  
  // Hero section
  '.hero-section': {
    padding: '80px 0',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--white)',
    position: 'relative',
    overflow: 'hidden'
  },
  
  '.hero-section .container': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '40px'
  },
  
  '.hero-content': {
    flex: '1'
  },
  
  '.hero-title': {
    fontSize: '3rem',
    fontWeight: '700',
    marginBottom: '20px',
    lineHeight: 1.2
  },
  
  '.hero-subtitle': {
    fontSize: '1.2rem',
    marginBottom: '30px',
    maxWidth: '600px'
  },
  
  '.hero-image': {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  
  '.hero-image img': {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '10px',
    boxShadow: 'var(--box-shadow)'
  },
  
  // Search form
  '.search-form': {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: 'var(--box-shadow)'
  },
  
  '.search-inputs': {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
    marginBottom: '20px'
  },
  
  '.search-input-group input, .search-input-group select': {
    width: '100%',
    padding: '12px 15px',
    borderRadius: '5px',
    border: '1px solid var(--medium-gray)',
    fontSize: '1rem'
  },
  
  '.search-button': {
    width: '100%',
    padding: '12px',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'var(--transition)'
  },
  
  '.search-button:hover': {
    backgroundColor: 'var(--primary-dark)'
  },
  
  // Sections general
  '.latest-jobs-section, .why-join-section, .steps-section, .testimonials-section': {
    padding: '80px 0',
    backgroundColor: 'white'
  },
  
  '.why-join-section, .testimonials-section': {
    backgroundColor: 'var(--light-gray)'
  },
  
  '.section-header': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px'
  },
  
  '.section-header h2': {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: 'var(--dark-gray)'
  },
  
  '.view-all-link': {
    color: 'var(--primary-color)',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'var(--transition)'
  },
  
  '.view-all-link:hover': {
    textDecoration: 'underline'
  },
  
  // Job cards
  '.job-cards': {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px'
  },
  
  '.job-card': {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: 'var(--box-shadow)',
    padding: '25px',
    display: 'flex',
    flexDirection: 'column',
    transition: 'var(--transition)'
  },
  
  '.job-card:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
  },
  
  '.job-card-content': {
    flex: '1'
  },
  
  '.job-title': {
    fontSize: '1.3rem',
    fontWeight: '600',
    marginBottom: '15px'
  },
  
  '.job-title a': {
    color: 'var(--dark-gray)',
    textDecoration: 'none',
    transition: 'var(--transition)'
  },
  
  '.job-title a:hover': {
    color: 'var(--primary-color)'
  },
  
  '.job-info': {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '15px'
  },
  
  '.job-meta': {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  
  '.company': {
    fontWeight: '500'
  },
  
  '.location, .job-type, .job-salary': {
    fontSize: '0.9rem',
    color: 'var(--secondary-color)'
  },
  
  '.job-deadline': {
    fontSize: '0.9rem',
    color: 'var(--secondary-color)'
  },
  
  '.job-card-actions': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    paddingTop: '15px',
    borderTop: '1px solid var(--medium-gray)'
  },
  
  '.save-job-btn': {
    background: 'none',
    border: 'none',
    color: 'var(--secondary-color)',
    cursor: 'pointer',
    fontSize: '1.2rem',
    transition: 'var(--transition)'
  },
  
  '.save-job-btn:hover': {
    color: 'var(--primary-color)'
  },
  
  '.apply-now-btn': {
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    padding: '8px 16px',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'var(--transition)'
  },
  
  '.apply-now-btn:hover': {
    backgroundColor: 'var(--primary-dark)'
  },
  
  // Benefits section
  '.benefits-grid': {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '30px'
  },
  
  '.benefit-card': {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: 'var(--box-shadow)',
    padding: '30px',
    textAlign: 'center',
    transition: 'var(--transition)'
  },
  
  '.benefit-card:hover': {
    transform: 'translateY(-5px)'
  },
  
  '.benefit-icon': {
    width: '70px',
    height: '70px',
    margin: '0 auto 20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
    color: 'white',
    backgroundColor: 'var(--primary-color)'
  },
  
  '.collaborative-icon::before': {
    content: '"👥"'
  },
  
  '.growth-icon::before': {
    content: '"📈"'
  },
  
  '.innovation-icon::before': {
    content: '"💡"'
  },
  
  '.benefits-icon::before': {
    content: '"🎁"'
  },
  
  '.benefit-card h3': {
    fontSize: '1.2rem',
    marginBottom: '15px',
    fontWeight: '600'
  },
  
  '.benefit-card p': {
    color: 'var(--secondary-color)',
    fontSize: '0.95rem'
  },
  
  // Steps section
  '.steps-grid': {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '30px',
    marginBottom: '40px'
  },
  
  '.step-card': {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: 'var(--box-shadow)',
    padding: '40px 30px',
    textAlign: 'center',
    position: 'relative',
    transition: 'var(--transition)'
  },
  
  '.step-card:hover': {
    transform: 'translateY(-5px)'
  },
  
  '.step-number': {
    position: 'absolute',
    top: '-20px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem'
  },
  
  '.step-icon': {
    width: '80px',
    height: '80px',
    margin: '0 auto 20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.5rem',
    backgroundColor: 'rgba(0, 86, 179, 0.1)',
    color: 'var(--primary-color)'
  },
  
  '.search-icon::before': {
    content: '"🔍"'
  },
  
  '.apply-icon::before': {
    content: '"📝"'
  },
  
  '.hired-icon::before': {
    content: '"🎯"'
  },
  
  '.step-card h3': {
    fontSize: '1.3rem',
    marginBottom: '15px',
    fontWeight: '600'
  },
  
  '.step-card p': {
    color: 'var(--secondary-color)'
  },
  
  '.steps-cta': {
    textAlign: 'center'
  },
  
  '.browse-jobs-btn': {
    display: 'inline-block',
    backgroundColor: 'var(--primary-color)',
    color: 'white',
    padding: '12px 30px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'var(--transition)'
  },
  
  '.browse-jobs-btn:hover': {
    backgroundColor: 'var(--primary-dark)'
  },
  
  // Testimonials
  '.testimonial-card': {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: 'var(--box-shadow)',
    padding: '30px',
    maxWidth: '800px',
    margin: '0 auto'
  },
  
  '.testimonial-rating': {
    color: 'gold',
    fontSize: '1.2rem',
    marginBottom: '20px'
  },
  
  '.testimonial-text': {
    fontSize: '1.1rem',
    fontStyle: 'italic',
    marginBottom: '25px',
    lineHeight: 1.7
  },
  
  '.testimonial-author': {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  
  '.author-avatar': {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    overflow: 'hidden'
  },
  
  '.author-avatar img': {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  
  '.author-info h4': {
    fontSize: '1.1rem',
    fontWeight: '600',
    marginBottom: '5px'
  },
  
  '.author-info p': {
    color: 'var(--secondary-color)',
    fontSize: '0.9rem'
  },
  
  // Responsive styles
  '@media (max-width: 992px)': {
    '.hero-section .container': {
      flexDirection: 'column'
    },
    
    '.hero-title': {
      fontSize: '2.5rem'
    },
    
    '.search-inputs': {
      gridTemplateColumns: '1fr'
    },
    
    '.steps-grid': {
      gridTemplateColumns: '1fr'
    }
  },
  
  '@media (max-width: 768px)': {
    '.benefits-grid': {
      gridTemplateColumns: '1fr'
    },
    
    '.job-cards': {
      gridTemplateColumns: '1fr'
    }
  }
};

export default HomePage;