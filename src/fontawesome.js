import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faMagnifyingGlass,
  faLocationDot,
  faBriefcase,
  faEye,
  faHandshake,
  faChartLine,
  faLightbulb,
  faGift,
  faFileAlt,
  faCheckCircle,
  faSackDollar,
  faSignOutAlt,
  faIndustry,
  faGraduationCap,
  faDollarSign,
  faCalendarTimes,
  faGaugeHigh,
  faUser,
  faFileAlt as faSolidFileAlt,
  faBookmark as faSolidBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

// Thêm các icon bạn muốn sử dụng vào thư viện
library.add(
  faMagnifyingGlass,
  faLocationDot,
  faBriefcase,
  faEye,
  faHandshake,
  faChartLine,
  faLightbulb,
  faGift,
  faFileAlt, // Changed from faFileArrowUp to faFileAlt for solid icon
  faCheckCircle,
  faSackDollar,
  faSignOutAlt,
  faIndustry,
  faGraduationCap,
  faDollarSign,
  faCalendarTimes,
  faGaugeHigh,
  faUser,
  faSolidFileAlt, // Alias if you need faFileAlt from solid explicitly
  faSolidBookmark, // Alias if you need faBookmark from solid explicitly
  farBookmark, // Icon bookmark regular
  faGoogle,
  faFacebook
);
