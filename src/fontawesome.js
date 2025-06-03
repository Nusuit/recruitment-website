// src/fontawesome.js
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faUser,
  faLock,
  faEnvelope,
  faEye,
  faEyeSlash,
  faChevronDown,
  faArrowRight,
  faBriefcase,
  faMapMarkerAlt,
  faBuilding,
  faClock, // Thường dùng cho thời gian, ngày tháng
  faCalendarAlt, // Thường dùng cho ngày tháng
  faSearch,
  faFilter,
  faSortAmountDown,
  faSortAmountUp,
  faExternalLinkAlt,
  faHeart as fasHeart, // Solid heart
  faPaperPlane,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faSpinner,
  faPlus,
  faEdit,
  faTrashAlt,
  faSignOutAlt,
  faTachometerAlt, // Dashboard icon
  faUsers, // Users icon
  faCog, // Settings icon
  faChartBar, // Analytics icon
  faFileAlt, // Reports/Applications icon
  faBell, // Notifications
  faQuestionCircle, // Help/Support
  faThLarge, // General category/grid view
  faList, // List view
  faUpload, // File upload
  faDownload, // File download
  faAngleLeft,
  faAngleRight,
  faAngleUp,
  faInfoCircle,
  faShareAlt, // Share icon
  faBookmark as fasBookmark, // Solid bookmark
  faBuildingUser, // For Recruiter specific sections
  faUserTie, // Could be for Admin or Recruiter profile
  faUserGraduate, // For Candidate profile
  faEnvelopeOpenText, 
  faFolderOpen, // Biểu tượng folder-open
  faHome, // Biểu tượng home cho trang chủ
  faTimes, // Biểu tượng dấu X
  faBars, // Biểu tượng 3 gạch ngang (hamburger)
  faGaugeHigh, // Biểu tượng dashboard mới
  faUserShield, // Biểu tượng quản lý người dùng
  faTasks, // Biểu tượng quản lý vai trò
  faChartLine, // Biểu tượng biểu đồ đường
  faMagnifyingGlassChart, // Biểu tượng phân tích tuyển dụng
  faDollarSign, // Biểu tượng tiền tệ
  faThumbsUp, // Biểu tượng like
  faHandshake, // Biểu tượng bắt tay
  faUserMinus, // Biểu tượng người dùng bị xóa
  faTrophy, // Biểu tượng cúp
  faTachometerAltFast, // Biểu tượng tốc độ
  faBullseye, // Biểu tượng đích
  faFire, // Biểu tượng lửa
  faClipboardList, // Biểu tượng danh sách
  faCalendarCheck, // Biểu tượng lịch kiểm tra
  faCalendarDay, // Biểu tượng ngày trong lịch
  faLaptop, // Biểu tượng máy tính xách tay
  faLink, // Biểu tượng liên kết
  faMapPin, // Biểu tượng ghim bản đồ
  faStickyNote, // Biểu tượng ghi chú
  faCalendarPlus, // Biểu tượng thêm lịch
  faCommentDots, // Biểu tượng bình luận
  faFileSignature, // Biểu tượng chữ ký file
  faFilePdf, // Biểu tượng file pdf
  faFileArrowUp, // Biểu tượng tải file lên
  faFileArrowDown, // Biểu tượng tải file xuống
  faUsersSlash, // Biểu tượng người dùng bị xóa
  faPlayCircle, // Biểu tượng phát
  faPauseCircle, // Biểu tượng tạm dừng
  faPalette, // Biểu tượng bảng màu
  faPhone, // ĐÃ THÊM: Biểu tượng điện thoại
  faBalanceScale, // ĐÃ THÊM: Biểu tượng cân bằng
  faBrain, // ĐÃ THÊM: Biểu tượng não
  faUsersCog, // ĐÃ THÊM: Biểu tượng người dùng bánh răng
  faUserCircle, // ĐÃ THÊM: Biểu tượng user circle
  faSort, // ĐÃ THÊM: Biểu tượng sort
  faSortUp, // ĐÃ THÊM: Biểu tượng sort up
  faSortDown, // ĐÃ THÊM: Biểu tượng sort down
} from '@fortawesome/free-solid-svg-icons';

import {
  faHeart as farHeart, // Regular heart (cho trạng thái chưa save)
  faBookmark as farBookmark, // Regular bookmark (cho trạng thái chưa save)
  faComment,
  faComments,
  faStar, // For reviews/ratings
  faCircle // Biểu tượng hình tròn rỗng
} from '@fortawesome/free-regular-svg-icons';

import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faGoogle, // Google icon for login/signup
  faInstagram,
  faYoutube // Biểu tượng Youtube
} from '@fortawesome/free-brands-svg-icons';

library.add(
  faUser,
  faLock,
  faEnvelope,
  faEye,
  faEyeSlash,
  faChevronDown,
  faArrowRight,
  faBriefcase,
  faMapMarkerAlt,
  faBuilding,
  faClock,
  faCalendarAlt,
  faSearch,
  faFilter,
  faSortAmountDown,
  faSortAmountUp,
  faExternalLinkAlt,
  fasHeart, // Solid heart for saved state
  farHeart, // Regular heart for unsaved state
  faPaperPlane,
  faCheckCircle,
  faTimesCircle,
  faExclamationTriangle,
  faSpinner,
  faPlus,
  faEdit,
  faTrashAlt,
  faSignOutAlt,
  faTachometerAlt,
  faUsers,
  faCog,
  faChartBar,
  faFileAlt,
  faBell,
  faQuestionCircle,
  faThLarge,
  faList,
  faUpload,
  faDownload,
  faAngleLeft,
  faAngleRight,
  faAngleUp,
  faInfoCircle,
  faShareAlt,
  fasBookmark, // Solid bookmark
  farBookmark, // Regular bookmark
  faBuildingUser,
  faUserTie,
  faUserGraduate,
  faEnvelopeOpenText, 
  faFolderOpen, // Biểu tượng folder-open
  faHome, // Biểu tượng home
  faTimes, // Biểu tượng dấu X
  faBars, // Biểu tượng 3 gạch ngang (hamburger)
  faGaugeHigh, // Biểu tượng dashboard mới
  faUserShield, // Biểu tượng quản lý người dùng
  faTasks, // Biểu tượng quản lý vai trò
  faChartLine, // Biểu tượng biểu đồ đường
  faMagnifyingGlassChart, // Biểu tượng phân tích tuyển dụng
  faDollarSign, // Biểu tượng tiền tệ
  faThumbsUp, // Biểu tượng like
  faHandshake, // Biểu tượng bắt tay
  faUserMinus, // Biểu tượng người dùng bị xóa
  faTrophy, // Biểu tượng cúp
  faTachometerAltFast, // Biểu tượng tốc độ
  faBullseye, // Biểu tượng đích
  faFire, // Biểu tượng lửa
  faClipboardList, // Biểu tượng danh sách
  faCalendarCheck, // Biểu tượng lịch kiểm tra
  faCalendarDay, // Biểu tượng ngày trong lịch
  faLaptop, // Biểu tượng máy tính xách tay
  faLink, // Biểu tượng liên kết
  faMapPin, // Biểu tượng ghim bản đồ
  faStickyNote, // Biểu tượng ghi chú
  faCalendarPlus, // Biểu tượng thêm lịch
  faCommentDots, // Biểu tượng bình luận
  faFileSignature, // Biểu tượng chữ ký file
  faFilePdf, // Biểu tượng file pdf
  faFileArrowUp, // Biểu tượng tải file lên
  faFileArrowDown, // Biểu tượng tải file xuống
  faUsersSlash, // Biểu tượng người dùng bị xóa
  faPlayCircle, // Biểu tượng phát
  faPauseCircle, // Biểu tượng tạm dừng
  faPalette, // Biểu tượng bảng màu
  faPhone, // ĐÃ THÊM: Biểu tượng điện thoại
  faBalanceScale, // ĐÃ THÊM: Biểu tượng cân bằng
  faBrain, // ĐÃ THÊM: Biểu tượng não
  faUsersCog, // ĐÃ THÊM: Biểu tượng người dùng bánh răng
  faUserCircle, // ĐÃ THÊM: Biểu tượng user circle
  faSort, // ĐÃ THÊM: Biểu tượng sort
  faSortUp, // ĐÃ THÊM: Biểu tượng sort up
  faSortDown, // ĐÃ THÊM: Biểu tượng sort down
  // Regular icons
  farHeart, // Regular heart
  farBookmark, // Regular bookmark
  faComment,
  faComments,
  faStar,
  faCircle, // Biểu tượng hình tròn rỗng
  // Brand icons
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faGoogle,
  faInstagram,
  faYoutube // Biểu tượng Youtube
);
