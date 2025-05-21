import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom"; // Import withRouter
import Header from "../common/Header";
import Footer from "../common/Footer";
import AuthContext from "../../contexts/AuthContext";
import PropTypes from "prop-types";

class ApplicantLayout extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
    this.menuItems = [
      {
        label: "Tổng quan",
        path: "/applicant/dashboard",
        icon: "fa-solid fa-gauge-high",
      },
      {
        label: "Tìm việc",
        path: "/applicant/jobs",
        icon: "fa-solid fa-briefcase",
      },
      {
        label: "Việc làm đã lưu",
        path: "/applicant/saved-jobs",
        icon: "fa-solid fa-bookmark",
      },
      {
        label: "Đơn ứng tuyển của tôi",
        path: "/applicant/applications",
        icon: "fa-solid fa-file-alt",
      },
      { label: "Hồ sơ", path: "/applicant/profile", icon: "fa-solid fa-user" },
    ];
  }

  handleLogout() {
    this.context.logout(); // Call logout from context
    this.props.history.push("/"); // Use history for navigation
  }

  render() {
    const { user } = this.context; // Get user from context
    const { location } = this.props; // Get location from props (via withRouter)

    return (
      <div className="flex flex-col min-h-screen">
        <Header userType="applicant" />

        <div className="flex flex-1">
          <aside className="w-72 bg-white border-r border-gray-200 p-4 fixed top-16 left-0 bottom-0 z-10 overflow-y-auto">
            <div className="flex items-center gap-3 p-4 mb-4 border-b border-gray-200">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {/* Default avatar or user's profile picture */}
                <img
                  src="/assets/images/default-avatar.png"
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-0.5">
                  {user?.name || "Người dùng"}
                </h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>

            <nav className="mb-6">
              <ul className="list-none p-0 m-0">
                {this.menuItems.map((item, index) => (
                  <li key={index} className="mb-0.5">
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 py-3 px-4 text-gray-800 font-medium rounded transition-all duration-200
                      ${
                        location.pathname === item.path
                          ? "bg-blue-100 text-blue-600"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <i
                        className={`${item.icon} w-5 h-5 flex items-center justify-center`}
                      ></i>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-gray-200">
              <button
                className="flex items-center gap-3 w-full py-3 px-4 bg-transparent border-none text-gray-800 font-medium cursor-pointer transition-all duration-200 rounded hover:bg-red-100 hover:text-red-600"
                onClick={this.handleLogout}
              >
                <i className="fa-solid fa-sign-out-alt w-5 h-5 flex items-center justify-center"></i>
                <span>Đăng xuất</span>
              </button>
            </div>
          </aside>

          <main className="flex-1 ml-72 p-6 bg-gray-50">
            {this.props.children} {/* Render children passed from Route */}
          </main>
        </div>

        <Footer />
      </div>
    );
  }
}

ApplicantLayout.propTypes = {
  history: PropTypes.object.isRequired, // Injected by withRouter
  location: PropTypes.object.isRequired, // Injected by withRouter
  match: PropTypes.object.isRequired, // Injected by withRouter
};

export default withRouter(ApplicantLayout);
