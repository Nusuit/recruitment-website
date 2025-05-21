import React, { Component } from "react";
import { withRouter } from "react-router-dom"; // Import withRouter
import { candidateAPI } from "../../api/candidate";
import PropTypes from "prop-types";

class JobApplicationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        experience: "",
        linkedin: "",
        coverLetter: "",
        resume: null,
        expectedSalary: "",
        noticePeriod: "",
        availableDate: "",
        questions: {
          workAuthorization: "",
          relocate: "",
          remoteWork: "",
          salaryExpectations: "",
        },
      },
      loading: false,
      error: null,
      profile: null,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.validateForm = this.validateForm.bind(this);
  }

  componentDidMount() {
    this.fetchProfile();
  }

  async fetchProfile() {
    try {
      const response = await candidateAPI.getProfile();
      const userProfile = response.profile;

      this.setState((prevState) => ({
        profile: userProfile,
        formData: {
          ...prevState.formData,
          firstName: userProfile.firstName || "",
          lastName: userProfile.lastName || "",
          email: userProfile.email || "",
          phone: userProfile.phone || "",
          experience: userProfile.experience || "",
          linkedin: userProfile.linkedin || "",
        },
      }));
    } catch (err) {
      console.error("Lỗi khi lấy hồ sơ:", err);
    }
  }

  handleInputChange(e) {
    const { name, value } = e.target;
    if (name.includes("questions.")) {
      const questionKey = name.split(".")[1];
      this.setState((prevState) => ({
        formData: {
          ...prevState.formData,
          questions: {
            ...prevState.formData.questions,
            [questionKey]: value,
          },
        },
      }));
    } else {
      this.setState((prevState) => ({
        formData: {
          ...prevState.formData,
          [name]: value,
        },
      }));
    }
  }

  handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        this.setState({
          error: "Kích thước tệp sơ yếu lý lịch không được vượt quá 5MB",
        });
        return;
      }
      this.setState((prevState) => ({
        formData: {
          ...prevState.formData,
          resume: file,
        },
        error: null, // Clear previous file error
      }));
    }
  }

  validateForm() {
    const { formData } = this.state;
    const errors = {};

    if (!formData.firstName) errors.firstName = "Tên là bắt buộc";
    if (!formData.lastName) errors.lastName = "Họ là bắt buộc";
    if (!formData.email) errors.email = "Email là bắt buộc";
    if (!formData.phone) errors.phone = "Số điện thoại là bắt buộc";
    if (!formData.resume) errors.resume = "Sơ yếu lý lịch là bắt buộc";

    if (Object.keys(errors).length > 0) {
      this.setState({ error: "Vui lòng điền đầy đủ các trường bắt buộc" });
      return false;
    }

    return true;
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.setState({ loading: true, error: null });

    try {
      const { jobId } = this.props;
      const { formData } = this.state;
      const applicationData = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key !== "resume" && key !== "questions") {
          applicationData.append(key, formData[key]);
        }
      });

      applicationData.append("questions", JSON.stringify(formData.questions));

      if (formData.resume) {
        applicationData.append("resume", formData.resume);
      }

      await candidateAPI.applyJob(jobId, applicationData);

      this.props.history.push("/applications", {
        state: {
          success: true,
          message: "Đơn đăng ký đã được gửi thành công!",
        },
      });
    } catch (err) {
      this.setState({
        error: err.message || "Không thể gửi đơn đăng ký. Vui lòng thử lại.",
      });
      console.error("Lỗi khi gửi đơn đăng ký:", err);
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { formData, loading, error } = this.state;
    const { jobTitle } = this.props;

    return (
      <form
        onSubmit={this.handleSubmit}
        className="job-application-form p-6 bg-white rounded-lg shadow-md"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Ứng tuyển cho {jobTitle}
          </h2>
          <p className="text-gray-600">
            Vui lòng điền vào biểu mẫu dưới đây để gửi đơn đăng ký của bạn
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Thông tin cá nhân
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-gray-800 font-medium mb-1"
              >
                Tên*
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={this.handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-gray-800 font-medium mb-1"
              >
                Họ*
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={this.handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-gray-800 font-medium mb-1"
              >
                Địa chỉ Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={this.handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-gray-800 font-medium mb-1"
              >
                Số điện thoại*
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={this.handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Thông tin nghề nghiệp
          </h3>

          <div className="mb-4">
            <label
              htmlFor="resume"
              className="block text-gray-800 font-medium mb-1"
            >
              Sơ yếu lý lịch/CV*
            </label>
            <div className="file-upload border border-gray-300 rounded p-3">
              <input
                type="file"
                id="resume"
                name="resume"
                accept=".pdf,.doc,.docx"
                onChange={this.handleFileChange}
                required
                className="w-full"
              />
              <p className="text-gray-600 text-sm mt-1">
                Định dạng chấp nhận: PDF, DOC, hoặc DOCX (Tối đa 5MB)
              </p>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="experience"
              className="block text-gray-800 font-medium mb-1"
            >
              Số năm kinh nghiệm
            </label>
            <input
              type="text"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={this.handleInputChange}
              placeholder="Ví dụ: 3 năm"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="linkedin"
              className="block text-gray-800 font-medium mb-1"
            >
              Hồ sơ LinkedIn
            </label>
            <input
              type="url"
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={this.handleInputChange}
              placeholder="https://linkedin.com/in/yourprofile"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="coverLetter"
              className="block text-gray-800 font-medium mb-1"
            >
              Thư xin việc
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={this.handleInputChange}
              rows="5"
              placeholder="Hãy cho chúng tôi biết tại sao bạn quan tâm đến vị trí này và điều gì khiến bạn trở thành một ứng viên tuyệt vời"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Câu hỏi bổ sung
          </h3>

          <div className="mb-4">
            <label
              htmlFor="questions.workAuthorization"
              className="block text-gray-800 font-medium mb-1"
            >
              Bạn có được pháp luật cho phép làm việc tại quốc gia này không?*
            </label>
            <select
              id="questions.workAuthorization"
              name="questions.workAuthorization"
              value={formData.questions.workAuthorization}
              onChange={this.handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="">Chọn một câu trả lời</option>
              <option value="yes">Có</option>
              <option value="no">Không</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="questions.relocate"
              className="block text-gray-800 font-medium mb-1"
            >
              Bạn có sẵn sàng chuyển địa điểm nếu cần không?
            </label>
            <select
              id="questions.relocate"
              name="questions.relocate"
              value={formData.questions.relocate}
              onChange={this.handleInputChange}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="">Chọn một câu trả lời</option>
              <option value="yes">Có</option>
              <option value="no">Không</option>
              <option value="maybe">Có thể</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="expectedSalary"
              className="block text-gray-800 font-medium mb-1"
            >
              Mức lương mong đợi
            </label>
            <input
              type="text"
              id="expectedSalary"
              name="expectedSalary"
              value={formData.expectedSalary}
              onChange={this.handleInputChange}
              placeholder="Ví dụ: $50,000/năm"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="availableDate"
              className="block text-gray-800 font-medium mb-1"
            >
              Ngày bắt đầu có thể
            </label>
            <input
              type="date"
              id="availableDate"
              name="availableDate"
              value={formData.availableDate}
              onChange={this.handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded font-medium hover:bg-gray-300 transition-colors duration-200"
            onClick={() => this.props.history.goBack()}
          >
            Hủy
          </button>

          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Gửi đơn đăng ký"}
          </button>
        </div>
      </form>
    );
  }
}

JobApplicationForm.propTypes = {
  jobId: PropTypes.number.isRequired,
  jobTitle: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired, // Injected by withRouter
};

export default withRouter(JobApplicationForm);
