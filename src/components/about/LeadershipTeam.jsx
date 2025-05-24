// src/components/about/LeadershipTeam.jsx
import React, { useState } from "react";
import Modal from "../common/Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LeadershipTeam = () => {
  const [selectedLeader, setSelectedLeader] = useState(null);

  // Dữ liệu mẫu, bạn cần thay thế bằng dữ liệu thật hoặc fetch từ API
  const leaders = [
    {
      id: 1,
      name: "Alex Johnson", // Thay tên theo design nếu có
      role: "Chief Executive Officer",
      image: "/assets/images/team/leader-1.jpg", // Thay bằng ảnh thật
      bio: "Alex has over 20 years of experience in the fashion retail sector, with a strong focus on sustainable growth and brand development. He is passionate about fostering innovation and leading MyaCorp to new heights.",
      linkedin: "alexjohnson-myacorp", // Giả sử link LinkedIn
    },
    {
      id: 2,
      name: "Maria Garcia",
      role: "Head of Design",
      image: "/assets/images/team/leader-2.jpg", // Thay bằng ảnh thật
      bio: "Maria is an award-winning designer known for her unique aesthetic and commitment to ethical fashion. She leads MyaCorp's creative vision, blending timeless style with contemporary trends.",
      linkedin: "mariagarcia-myacorp",
    },
    {
      id: 3,
      name: "Samuel Lee",
      role: "Chief Operations Officer",
      image: "/assets/images/team/leader-3.jpg", // Thay bằng ảnh thật
      bio: "With a background in global supply chain management, Samuel ensures MyaCorp's operations are efficient, sustainable, and capable of delivering quality products worldwide.",
      linkedin: "samuellee-myacorp",
    },
    {
      id: 4,
      name: "Priya Sharma",
      role: "Marketing Director",
      image: "/assets/images/team/leader-4.jpg", // Thay bằng ảnh thật
      bio: "Priya is a dynamic marketing leader who excels at building brand narratives and connecting with customers through innovative digital strategies and campaigns.",
      linkedin: "priyasharma-myacorp",
    },
    // Bạn có thể thêm hoặc bớt thành viên cho phù hợp
  ];

  const openLeaderBioModal = (leader) => setSelectedLeader(leader);
  const closeLeaderBioModal = () => setSelectedLeader(null);

  return (
    <section className="leadership-team-section py-16 md:py-24 bg-white">
      {" "}
      {/* Nền trắng */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Phần hình ảnh bên trái (ảnh lớn của team) */}
          <div className="flex justify-center md:justify-start">
            <div className="relative w-full max-w-lg rounded-lg shadow-xl overflow-hidden group">
              <img
                src="/assets/images/company/leadership-team-group.jpg" // Đảm bảo bạn có ảnh này
                alt="MyaCorp Leadership Team Group" // Cập nhật alt text nếu cần
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
              />
              {/* Lớp phủ gradient có thể bỏ nếu design mới không có */}
              {/* <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div> */}
            </div>
          </div>

          {/* Phần text bên phải */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Leadership Team
            </h2>
            <p className="text-gray-600 text-md md:text-lg leading-relaxed">
              Our leadership team consists of seasoned professionals with years
              of experience in the fashion industry. Together, they are guiding
              our company toward success with innovative ideas and strategic
              vision.
            </p>
            {/* Không có nút "Meet the Team" trong design mới này */}
          </div>
        </div>
        {/* Không còn phần hiển thị card cá nhân của leader */}
      </div>
      {/* Không còn Modal */}
    </section>
  );
};

export default LeadershipTeam;
