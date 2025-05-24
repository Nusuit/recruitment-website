// src/fontawesome.js
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faBriefcase,
  faEye,
  faHandshake,
  faChartLine,
  faLightbulb,
  faGift,
  faFileLines, // Đã thay faFileAlt
  faCheckCircle,
  faRightFromBracket, // Đã thay faSignOutAlt
  faIndustry,
  faGraduationCap,
  faUser,
  faSearch,
  faLocationDot, // Đã thay faMapMarkerAlt
  faDollarSign,
  faGaugeHigh, // Đã thay faTachometerAlt
  faBookmark as faSolidBookmark,
  faBars, // Icon cho mobile menu (hamburger)
  faTimes, // Icon cho nút đóng mobile menu (X)
  // Thêm các icon khác nếu cần cho v6
  faUsers, // Ví dụ: cho UserManagement
  faUserShield, // Ví dụ: cho RoleManagement
  faCog, // Ví dụ: cho Settings
  faBuilding, // Ví dụ: cho CompanyProfile
  faChartPie, // Ví dụ: cho Analytics
  faFileInvoice, // Ví dụ: cho Applications
  faTachometerAltFast, // Một biến thể khác cho Dashboard
  faPlus, // Cho nút "Create"
  faPen, // Cho nút "Edit"
  faTrash, // Cho nút "Delete"
  faEyeSlash, // Cho toggle password
  faEnvelope, // Cho email
  faPhone, // Cho phone
  faMapMarkedAlt, // Một biến thể khác cho location
  faCalendarAlt, // Cho date/deadline
  faChevronDown, // Cho dropdown
  faChevronLeft, // Cho sidebar collapse
  faChevronRight, // Cho sidebar expand
  faBell, // Cho notifications
  faSignOutAlt, // Giữ lại nếu vẫn dùng, hoặc thay bằng faRightFromBracket
} from "@fortawesome/free-solid-svg-icons";

import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import { faGoogle, faFacebookF } from "@fortawesome/free-brands-svg-icons"; // faFacebookF thường được dùng hơn faFacebook

library.add(
  faSearch,
  faLocationDot,
  faBriefcase,
  faEye,
  faHandshake,
  faChartLine,
  faLightbulb,
  faGift,
  faFileLines,
  faCheckCircle,
  faDollarSign,
  faRightFromBracket,
  faIndustry,
  faGraduationCap,
  faGaugeHigh,
  faUser,
  faSolidBookmark,
  farBookmark,
  faGoogle,
  faFacebookF,
  faBars,
  faTimes,
  faUsers,
  faUserShield,
  faCog,
  faBuilding,
  faChartPie,
  faFileInvoice,
  faTachometerAltFast,
  faPlus,
  faPen,
  faTrash,
  faEyeSlash,
  faEnvelope,
  faPhone,
  faMapMarkedAlt,
  faCalendarAlt,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faBell,
  faSignOutAlt // Giữ lại nếu vẫn dùng
);
