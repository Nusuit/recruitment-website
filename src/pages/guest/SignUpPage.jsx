// src/pages/guest/SignUpPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import SignUpForm from "../../components/auth/SignUpForm";
import AuthImageSection from "../../components/auth/AuthImageSection";

const SignUpPage = () => {
  const signUpImage = "/assets/images/register.png";
  const signUpQuote =
    "Fashion is the armor to survive the reality of everyday life.";
  const signUpAuthor = "Bill Cunningham";

  return (
    // Giảm padding tổng thể của trang một chút
    <div className="signup-page-wrapper bg-white min-h-screen w-full flex flex-col items-center p-4 sm:p-5 lg:p-6">
      {/* Giảm max-w của container chính */}
      <div className="w-full max-w-5xl flex flex-col flex-grow justify-center">
        <header className="absolute top-0 left-0 w-full py-4 px-4 sm:px-6 lg:px-8">
          {" "}
          {/* Giảm padding header */}
          {/* Giảm max-w của container header cho nhất quán */}
          <div className="container mx-auto max-w-5xl">
            <Link to="/" className="flex items-center">
              <img
                src="/assets/images/logo.png"
                alt="MyaCorp Logo"
                className="h-8 w-auto mr-2" // Giảm nhẹ kích thước logo
              />
              <span className="text-xl font-bold text-gray-800">MyaCorp</span>{" "}
              {/* Giảm nhẹ kích thước chữ */}
            </Link>
          </div>
        </header>
        {/* Giảm margin top và max-w của khối nội dung chính */}
        <div className="flex flex-col md:flex-row items-center w-full flex-grow justify-center mt-12 md:mt-10">
          <main className="flex flex-col md:flex-row bg-white rounded-xl md:shadow-xl overflow-hidden w-full max-w-4xl min-h-[550px] md:min-h-[auto]">
            {" "}
            {/* Giảm max-w và min-h */}
            {/* Left Column: SignUp Form - Thay đổi md:w-2/5 thành md:w-1/2 */}
            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 flex flex-col">
              <SignUpForm />
            </div>
            {/* Right Column: Image and Quote - Thay đổi md:w-3/5 thành md:w-1/2 */}
            <div className="w-full md:w-1/2 hidden md:flex flex-col justify-center items-center p-8 lg:p-10 bg-white">
              <AuthImageSection
                imageSrc={signUpImage}
                imageAlt="Sign Up Fashion Illustration"
                quoteText={signUpQuote}
                quoteAuthor={signUpAuthor}
              />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
