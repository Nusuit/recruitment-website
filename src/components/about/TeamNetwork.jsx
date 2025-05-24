// src/components/about/TeamNetwork.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TeamNetwork = () => {
  // Dữ liệu mẫu cho các thành viên trong mạng lưới
  // Bạn cần thay thế bằng ảnh thật và có thể điều chỉnh vị trí/kích thước
  const teamMembers = [
    {
      id: "center",
      name: "Core Team",
      image: "/assets/images/team/team-center.png", // Ảnh trung tâm (ví dụ: logo hoặc ảnh nhóm)
      size: "w-24 h-24 md:w-32 md:h-32",
      position: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      isCenter: true,
    },
    {
      id: 1,
      name: "Designer 1",
      image: "/assets/images/avatars/avatar-1.png", // Thay bằng ảnh thật
      size: "w-16 h-16 md:w-20 md:h-20",
      // Vị trí tương đối, bạn cần tinh chỉnh các giá trị này
      position:
        "absolute top-[15%] left-[25%] -translate-x-1/2 -translate-y-1/2",
    },
    {
      id: 2,
      name: "Marketer",
      image: "/assets/images/avatars/avatar-2.png",
      size: "w-14 h-14 md:w-18 md:h-18",
      position:
        "absolute top-[30%] right-[10%] -translate-x-1/2 -translate-y-1/2",
    },
    {
      id: 3,
      name: "Developer",
      image: "/assets/images/avatars/avatar-3.png",
      size: "w-16 h-16 md:w-20 md:h-20",
      position:
        "absolute bottom-[15%] left-[30%] -translate-x-1/2 -translate-y-1/2",
    },
    {
      id: 4,
      name: "Sales Lead",
      image: "/assets/images/avatars/avatar-4.png",
      size: "w-12 h-12 md:w-16 md:h-16",
      position:
        "absolute bottom-[25%] right-[20%] -translate-x-1/2 -translate-y-1/2",
    },
    {
      id: 5,
      name: "Support",
      image: "/assets/images/avatars/avatar-5.png",
      size: "w-14 h-14 md:w-18 md:h-18",
      position:
        "absolute top-[55%] left-[10%] -translate-x-1/2 -translate-y-1/2",
    },
    {
      id: 6,
      name: "Operations",
      image: "/assets/images/avatars/avatar-6.png",
      size: "w-12 h-12 md:w-16 md:h-16",
      position:
        "absolute top-[70%] right-[40%] -translate-x-1/2 -translate-y-1/2",
    },
    // Thêm các thành viên khác nếu cần
  ];

  // Tạo các đường nối đơn giản từ các thành viên đến trung tâm
  // Đây là cách làm tĩnh, một đồ thị động sẽ phức tạp hơn nhiều
  const lines = teamMembers
    .filter((member) => !member.isCenter)
    .map((member) => {
      // Lấy % từ class, ví dụ: "left-[25%]" -> 25
      const targetLeftMatch = member.position.match(/left-\[(\d+)%\]/);
      const targetRightMatch = member.position.match(/right-\[(\d+)%\]/);
      const targetTopMatch = member.position.match(/top-\[(\d+)%\]/);
      const targetBottomMatch = member.position.match(/bottom-\[(\d+)%\]/);

      let x2Percent = 50; // Mặc định là trung tâm
      let y2Percent = 50;

      if (targetLeftMatch) x2Percent = parseFloat(targetLeftMatch[1]);
      else if (targetRightMatch)
        x2Percent = 100 - parseFloat(targetRightMatch[1]);

      if (targetTopMatch) y2Percent = parseFloat(targetTopMatch[1]);
      else if (targetBottomMatch)
        y2Percent = 100 - parseFloat(targetBottomMatch[1]);

      // Điều chỉnh một chút để đường line hướng vào gần tâm của avatar thay vì góc
      // Giả sử avatar có kích thước trung bình khoảng 8% chiều rộng/cao của container
      const avatarOffset = 4;
      if (x2Percent < 50) x2Percent += avatarOffset;
      else if (x2Percent > 50) x2Percent -= avatarOffset;
      if (y2Percent < 50) y2Percent += avatarOffset;
      else if (y2Percent > 50) y2Percent -= avatarOffset;

      return {
        id: `line-to-${member.id}`,
        x1: "50%",
        y1: "50%",
        x2: `${x2Percent}%`,
        y2: `${y2Percent}%`,
      };
    });

  return (
    <div className="team-network-visualization relative w-full max-w-lg mx-auto aspect-square">
      {/* Các đường nối */}
      <svg className="absolute inset-0 w-full h-full" aria-hidden="true">
        {lines.map((line) => (
          <line
            key={line.id}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="#cbd5e1" // Màu xám nhạt cho đường nối
            strokeWidth="1.5"
            strokeDasharray="4 2" // Đường đứt nét
          />
        ))}
      </svg>

      {/* Các thành viên */}
      {teamMembers.map((member) => (
        <div
          key={member.id}
          className={`member-node ${member.size} ${member.position} rounded-full bg-gray-200 shadow-lg border-2 border-white flex items-center justify-center group cursor-pointer transition-transform hover:scale-110`}
          title={member.name} // Hiển thị tên khi hover
        >
          <img
            src={member.image || "/assets/images/default-avatar.png"}
            alt={member.name}
            className="w-full h-full object-cover rounded-full"
          />
          {/* Tên có thể ẩn/hiện khi hover nếu muốn */}
          <span className="absolute -bottom-5 text-xs text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap bg-white px-1 rounded">
            {member.name}
          </span>
        </div>
      ))}
      {/* Icon trung tâm nếu không có ảnh cho center node */}
      {teamMembers.find((m) => m.isCenter && !m.image) && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <FontAwesomeIcon
            icon="users" // Hoặc icon khác
            className="text-5xl md:text-6xl text-orange-300 opacity-70"
          />
        </div>
      )}
    </div>
  );
};

export default TeamNetwork;
