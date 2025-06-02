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
  // THÊM ICON NÀY VÀO:
  faEnvelopeOpenText, 
} from '@fortawesome/free-solid-svg-icons';

import {
  faHeart as farHeart, // Regular heart (cho trạng thái chưa save)
  faBookmark as farBookmark, // Regular bookmark (cho trạng thái chưa save)
  faComment,
  faComments,
  faStar, // For reviews/ratings
} from '@fortawesome/free-regular-svg-icons';

import {
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faGoogle, // Google icon for login/signup
  faInstagram,
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
  // THÊM ICON NÀY VÀO LIBRARY:
  faEnvelopeOpenText, 
  // Regular icons
  faComment,
  faComments,
  faStar,
  // Brand icons
  faFacebookF,
  faTwitter,
  faLinkedinIn,
  faGoogle,
  faInstagram
);
