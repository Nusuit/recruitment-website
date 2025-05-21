import React, { Component } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { withRouter } from "react-router-dom"; // Import withRouter if needed for Header/Footer

class GuestLayout extends Component {
  render() {
    return (
      <div className="flex flex-col min-h-screen">
        <Header userType="guest" />
        <main className="flex-1 w-full">
          {this.props.children} {/* Render children directly */}
        </main>
        <Footer />
      </div>
    );
  }
}

GuestLayout.propTypes = {
  children: PropTypes.node, // PropType for children
};

export default GuestLayout;
