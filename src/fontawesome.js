import { library } from "@fortawesome/fontawesome-svg-core";
// Import các icon từ free-solid-svg-icons.
// Đảm bảo chỉ import các icon có sẵn trong Font Awesome 5.x.x và sử dụng tên chính xác.
import {
  faBriefcase,
  faEye,
  faHandshake,
  faChartLine,
  faLightbulb,
  faGift,
  faFileAlt,
  faCheckCircle,
  faSignOutAlt,
  faIndustry,
  faGraduationCap,
  faUser,
  faSearch, // Thay thế faMagnifyingGlass
  faMapMarkerAlt, // Thay thế faLocationDot
  faDollarSign, // Thay thế faSackDollar
  faTachometerAlt, // Thay thế faGaugeHigh
  faBookmark as faSolidBookmark, // faBookmark solid
} from "@fortawesome/free-solid-svg-icons";

// Import icon regular
import { faBookmark as farBookmark } from "@fortawesome/free-regular-svg-icons";

// Import icon brands
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

// Thêm các icon bạn muốn sử dụng vào thư viện
library.add(
  faSearch, // Sử dụng faSearch
  faMapMarkerAlt, // Sử dụng faMapMarkerAlt
  faBriefcase,
  faEye,
  faHandshake,
  faChartLine,
  faLightbulb,
  faGift,
  faFileAlt,
  faCheckCircle,
  faDollarSign,
  faSignOutAlt,
  faIndustry,
  faGraduationCap,
  faTachometerAlt,
  faUser,
  faSolidBookmark, // Icon bookmark solid
  farBookmark, // Icon bookmark regular
  faGoogle,
  faFacebook
);
