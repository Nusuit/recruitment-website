import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom"; // Import withRouter
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import PropTypes from "prop-types";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileMenuOpen: false,
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
    this.handleMobileLinkClick = this.handleMobileLinkClick.bind(this);
    this.isNavLinkActive = this.isNavLinkActive.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.mobileMenuOpen !== prevState.mobileMenuOpen) {
      document.body.style.overflow = this.state.mobileMenuOpen ? "hidden" : "";
    }
    // Close mobile menu when route changes
    if (
      this.props.location.pathname !== prevProps.location.pathname &&
      this.state.mobileMenuOpen
    ) {
      this.setState({ mobileMenuOpen: false });
    }
  }

  componentWillUnmount() {
    document.body.style.overflow = ""; // Reset overflow on unmount
  }

  toggleMobileMenu() {
    this.setState((prevState) => ({
      mobileMenuOpen: !prevState.mobileMenuOpen,
    }));
  }

  handleMobileLinkClick() {
    this.setState({ mobileMenuOpen: false });
  }

  handleLogout() {
    console.log("Logging out...");
    // Replace with actual logout logic (e.g., calling AuthContext.logout)
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.props.history.push("/login");
    this.setState({ mobileMenuOpen: false });
  }

  isNavLinkActive(path) {
    const { location } = this.props;
    if (path === "/jobs") {
      return (
        location.pathname === path || location.pathname.startsWith(path + "/")
      );
    }
    return location.pathname === path;
  }

  render() {
    const { userType } = this.props;
    const { mobileMenuOpen } = this.state;
    const user = JSON.parse(localStorage.getItem("user") || '{"name": "User"}'); // Placeholder user

    return (
      <header className="bg-white shadow-md sticky top-0 z-50 h-16">
        <div className="container mx-auto px-4 flex justify-between items-center h-full">
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src="/assets/images/logo.png"
                alt="Your Logo"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center ml-auto mr-6">
            <ul className="flex space-x-6 list-none m-0 p-0">
              <li>
                <Link
                  to="/"
                  className={`relative py-2 text-gray-800 font-medium no-underline transition-colors duration-200 ${
                    this.isNavLinkActive("/")
                      ? "text-blue-600 after:absolute after:bottom-0 after:left-1/2 after:w-4/5 after:h-0.5 after:bg-blue-600 after:-translate-x-1/2"
                      : "hover:text-blue-600 hover:after:w-4/5 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 after:-translate-x-1/2"
                  }`}
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className={`relative py-2 text-gray-800 font-medium no-underline transition-colors duration-200 ${
                    this.isNavLinkActive("/jobs")
                      ? "text-blue-600 after:absolute after:bottom-0 after:left-1/2 after:w-4/5 after:h-0.5 after:bg-blue-600 after:-translate-x-1/2"
                      : "hover:text-blue-600 hover:after:w-4/5 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 after:-translate-x-1/2"
                  }`}
                >
                  Cơ hội việc làm
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`relative py-2 text-gray-800 font-medium no-underline transition-colors duration-200 ${
                    this.isNavLinkActive("/about")
                      ? "text-blue-600 after:absolute after:bottom-0 after:left-1/2 after:w-4/5 after:h-0.5 after:bg-blue-600 after:-translate-x-1/2"
                      : "hover:text-blue-600 hover:after:w-4/5 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 after:-translate-x-1/2"
                  }`}
                >
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`relative py-2 text-gray-800 font-medium no-underline transition-colors duration-200 ${
                    this.isNavLinkActive("/contact")
                      ? "text-blue-600 after:absolute after:bottom-0 after:left-1/2 after:w-4/5 after:h-0.5 after:bg-blue-600 after:-translate-x-1/2"
                      : "hover:text-blue-600 hover:after:w-4/5 after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 after:-translate-x-1/2"
                  }`}
                >
                  Liên hệ
                </Link>
              </li>
            </ul>
          </nav>

          {/* Desktop Auth Buttons / User Menu */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {userType === "guest" ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded font-medium transition-colors duration-200 hover:bg-blue-50"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 bg-blue-600 text-white border border-blue-600 rounded font-medium transition-colors duration-200 hover:bg-blue-700 hover:border-blue-700"
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-800">{user.name}</span>
                <button
                  onClick={this.handleLogout}
                  className="px-3 py-1 text-gray-600 bg-gray-100 rounded font-medium transition-colors duration-200 hover:bg-gray-200"
                >
                  <FontAwesomeIcon
                    icon="sign-out-alt"
                    className="inline-block mr-1"
                  />{" "}
                  Đăng xuất
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 p-0 relative z-50 bg-none border-none cursor-pointer"
            onClick={this.toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <span
              className={`block w-6 h-0.5 bg-gray-800 absolute transition-all duration-300 ${
                mobileMenuOpen ? "bg-transparent" : ""
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-800 absolute transition-all duration-300 ${
                mobileMenuOpen ? "rotate-45 top-1/2 -translate-y-1/2" : "-top-2"
              }`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-gray-800 absolute transition-all duration-300 ${
                mobileMenuOpen
                  ? "-rotate-45 top-1/2 -translate-y-1/2"
                  : "-bottom-2"
              }`}
            ></span>
          </button>
        </div>

        {/* Mobile Menu Panel */}
        <div
          className={`fixed top-16 left-0 right-0 bottom-0 bg-white p-6 shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden overflow-y-auto`}
        >
          <ul className="list-none m-0 p-0 mb-6">
            <li>
              <Link
                to="/"
                onClick={this.handleMobileLinkClick}
                className="block py-3 text-gray-800 font-medium text-lg no-underline border-b border-gray-200"
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                to="/jobs"
                onClick={this.handleMobileLinkClick}
                className="block py-3 text-gray-800 font-medium text-lg no-underline border-b border-gray-200"
              >
                Cơ hội việc làm
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                onClick={this.handleMobileLinkClick}
                className="block py-3 text-gray-800 font-medium text-lg no-underline border-b border-gray-200"
              >
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                onClick={this.handleMobileLinkClick}
                className="block py-3 text-gray-800 font-medium text-lg no-underline border-b border-gray-200"
              >
                Liên hệ
              </Link>
            </li>
          </ul>

          <div className="flex flex-col space-y-4 mt-6">
            {userType === "guest" ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-3 text-blue-600 border border-blue-600 rounded font-medium text-center no-underline transition-colors duration-200 hover:bg-blue-50"
                  onClick={this.handleMobileLinkClick}
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-3 bg-blue-600 text-white border border-blue-600 rounded font-medium text-center no-underline transition-colors duration-200 hover:bg-blue-700 hover:border-blue-700"
                  onClick={this.handleMobileLinkClick}
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <button
                onClick={this.handleLogout}
                className="px-4 py-3 bg-gray-100 text-gray-600 rounded font-medium text-center transition-colors duration-200 hover:bg-gray-200"
              >
                <FontAwesomeIcon
                  icon="sign-out-alt"
                  className="inline-block mr-2"
                />{" "}
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  userType: PropTypes.string,
  location: PropTypes.object.isRequired, // Injected by withRouter
  history: PropTypes.object.isRequired, // Injected by withRouter
};

Header.defaultProps = {
  userType: "guest",
};

export default withRouter(Header);
