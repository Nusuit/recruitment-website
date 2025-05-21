import React, { Component } from "react";
import { withRouter } from "react-router-dom"; // Import withRouter
import { validateJobPostingForm } from "../../../utils/validators";
import { recruiterAPI } from "../../../api/recruiter"; // Use recruiterAPI

class CreateJobPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        title: "",
        department: "",
        location: "",
        type: "FULL_TIME",
        description: "",
        requirements: "",
        benefits: "",
        salaryMin: "",
        salaryMax: "",
        experienceLevel: "",
        educationLevel: "",
        deadline: "",
        status: "DRAFT",
        selectedSkills: [],
      },
      errors: {},
      isSubmitting: false,
      isLoading: props.isEditing, // Set loading state based on isEditing prop
      error: null,
      skills: [], // Available skills from API
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSkillChange = this.handleSkillChange.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSaveAsDraft = this.handleSaveAsDraft.bind(this);
    this.fetchJobDetails = this.fetchJobDetails.bind(this);
    this.fetchSkills = this.fetchSkills.bind(this);
  }

  componentDidMount() {
    this.fetchSkills();
    if (this.props.isEditing && this.props.match.params.jobId) {
      this.fetchJobDetails(this.props.match.params.jobId);
    }
  }

  async fetchSkills() {
    try {
      const response = await recruiterAPI.getSkills();
      this.setState({ skills: response.skills });
    } catch (err) {
      console.error("Lỗi khi lấy kỹ năng:", err);
      this.setState({ error: "Không thể tải kỹ năng. Vui lòng thử lại." });
    }
  }

  async fetchJobDetails(jobId) {
    this.setState({ isLoading: true, error: null });
    try {
      const response = await recruiterAPI.getJobDetail(jobId);
      const job = response.job;

      this.setState((prevState) => ({
        formData: {
          ...prevState.formData,
          title: job.title || "",
          department: job.department || "",
          location: job.location || "",
          type: job.type || "FULL_TIME",
          description: job.description || "",
          requirements: job.requirements || "",
          benefits: job.benefits || "",
          salaryMin: job.salaryMin || "",
          salaryMax: job.salaryMax || "",
          experienceLevel: job.experienceLevel || "",
          educationLevel: job.educationLevel || "",
          deadline: job.deadline ? job.deadline.split("T")[0] : "", // Format date
          status: job.status || "DRAFT",
          selectedSkills: job.skills ? job.skills.map((s) => s.id) : [],
        },
        isLoading: false,
      }));
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết công việc:", err);
      this.setState({
        error: "Không thể tải chi tiết công việc. Vui lòng thử lại.",
        isLoading: false,
      });
    }
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
      },
      errors: {
        ...prevState.errors,
        [name]: "",
      },
    }));
  }

  handleSkillChange(skillId) {
    this.setState((prevState) => {
      const selectedSkills = prevState.formData.selectedSkills.includes(skillId)
        ? prevState.formData.selectedSkills.filter((id) => id !== skillId)
        : [...prevState.formData.selectedSkills, skillId];

      return {
        formData: {
          ...prevState.formData,
          selectedSkills,
        },
      };
    });
  }

  validateForm() {
    const errors = validateJobPostingForm(this.state.formData);
    this.setState({ errors });
    if (Object.keys(errors).length > 0) {
      this.setState({
        error: "Vui lòng điền đầy đủ các trường bắt buộc và hợp lệ.",
      });
      return false;
    }
    this.setState({ error: null }); // Clear general error if validation passes
    return true;
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    this.setState({ isSubmitting: true, error: null });

    try {
      const { formData } = this.state;
      const jobData = {
        ...formData,
        salaryMin: parseInt(formData.salaryMin),
        salaryMax: parseInt(formData.salaryMax),
        skills: formData.selectedSkills, // Send only selected skill IDs
      };

      let response;
      if (this.props.isEditing) {
        response = await recruiterAPI.updateJob(
          this.props.match.params.jobId,
          jobData
        );
      } else {
        response = await recruiterAPI.createJob(jobData);
      }

      // Update skills for the job
      if (response.job && response.job.id) {
        await recruiterAPI.updateJobSkills(
          response.job.id,
          formData.selectedSkills
        );
      }

      this.props.history.push("/admin/jobs", {
        state: {
          success: true,
          message: this.props.isEditing
            ? "Công việc đã được cập nhật thành công!"
            : "Công việc đã được đăng thành công!",
        },
      });
    } catch (err) {
      this.setState({
        error:
          err.message || "Không thể tạo/cập nhật công việc. Vui lòng thử lại.",
      });
      console.error("Lỗi khi tạo/cập nhật công việc:", err);
    } finally {
      this.setState({ isSubmitting: false });
    }
  }

  async handleSaveAsDraft() {
    this.setState({ isSubmitting: true, error: null });
    try {
      const { formData } = this.state;
      const jobData = {
        ...formData,
        status: "DRAFT", // Explicitly set status to DRAFT
        salaryMin: parseInt(formData.salaryMin),
        salaryMax: parseInt(formData.salaryMax),
        skills: formData.selectedSkills,
      };

      // If editing, update existing job as draft. If creating, create new as draft.
      if (this.props.isEditing && this.props.match.params.jobId) {
        await recruiterAPI.updateJob(this.props.match.params.jobId, jobData);
      } else {
        await recruiterAPI.createJob(jobData);
      }

      this.props.history.push("/admin/jobs", {
        state: {
          success: true,
          message: "Công việc đã được lưu dưới dạng bản nháp!",
        },
      });
    } catch (err) {
      this.setState({
        error: err.message || "Không thể lưu bản nháp. Vui lòng thử lại.",
      });
      console.error("Lỗi khi lưu bản nháp:", err);
    } finally {
      this.setState({ isSubmitting: false });
    }
  }

  render() {
    const { formData, errors, isSubmitting, isLoading, error, skills } =
      this.state;
    const { isEditing } = this.props;

    if (isLoading) {
      return (
        <div className="text-center py-8">Đang tải chi tiết công việc...</div>
      );
    }

    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? "Chỉnh sửa đăng tuyển" : "Tạo đăng tuyển mới"}
          </h1>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={this.handleSubmit}>
          {/* Basic Information */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Thông tin cơ bản
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-gray-800 font-medium mb-1"
                >
                  Chức danh công việc*
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={this.handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                {errors.title && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.title}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="department"
                  className="block text-gray-800 font-medium mb-1"
                >
                  Phòng ban
                </label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={this.handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="location"
                  className="block text-gray-800 font-medium mb-1"
                >
                  Địa điểm*
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={this.handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
                {errors.location && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.location}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="type"
                  className="block text-gray-800 font-medium mb-1"
                >
                  Loại hình làm việc*
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={this.handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="FULL_TIME">Toàn thời gian</option>
                  <option value="PART_TIME">Bán thời gian</option>
                  <option value="CONTRACT">Hợp đồng</option>
                  <option value="INTERNSHIP">Thực tập</option>
                  <option value="TEMPORARY">Tạm thời</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="salaryMin"
                  className="block text-gray-800 font-medium mb-1"
                >
                  Lương tối thiểu (Tháng)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    id="salaryMin"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={this.handleChange}
                    placeholder="Ví dụ: 2000"
                    min="0"
                    className="w-full p-3 pl-8 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                {errors.salaryMin && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.salaryMin}
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="salaryMax"
                  className="block text-gray-800 font-medium mb-1"
                >
                  Lương tối đa (Tháng)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    id="salaryMax"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={this.handleChange}
                    placeholder="Ví dụ: 2800"
                    min="0"
                    className="w-full p-3 pl-8 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                {errors.salaryMax && (
                  <div className="text-red-600 text-sm mt-1">
                    {errors.salaryMax}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Chi tiết công việc
            </h2>

            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-gray-800 font-medium mb-1"
              >
                Mô tả công việc*
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={this.handleChange}
                required
                rows="5"
                placeholder="Mô tả vai trò và trách nhiệm của công việc"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              ></textarea>
              {errors.description && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.description}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="requirements"
                className="block text-gray-800 font-medium mb-1"
              >
                Yêu cầu*
              </label>
              <textarea
                id="requirements"
                name="requirements"
                value={formData.requirements}
                onChange={this.handleChange}
                required
                rows="5"
                placeholder="Liệt kê các yêu cầu công việc (mỗi dòng một yêu cầu)"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              ></textarea>
              {errors.requirements && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.requirements}
                </div>
              )}
              <div className="text-gray-600 text-xs mt-1">
                Nhập mỗi yêu cầu trên một dòng mới, bắt đầu bằng dấu gạch ngang
                (-)
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="benefits"
                className="block text-gray-800 font-medium mb-1"
              >
                Phúc lợi
              </label>
              <textarea
                id="benefits"
                name="benefits"
                value={formData.benefits}
                onChange={this.handleChange}
                rows="5"
                placeholder="Liệt kê các phúc lợi được cung cấp (mỗi dòng một phúc lợi)"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              ></textarea>
              <div className="text-gray-600 text-xs mt-1">
                Nhập mỗi phúc lợi trên một dòng mới, bắt đầu bằng dấu gạch ngang
                (-)
              </div>
            </div>
          </div>

          {/* Qualifications */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Trình độ
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="experienceLevel"
                  className="block text-gray-800 font-medium mb-1"
                >
                  Cấp độ kinh nghiệm
                </label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={this.handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Chọn cấp độ kinh nghiệm</option>
                  <option value="ENTRY">Mới vào</option>
                  <option value="JUNIOR">Junior</option>
                  <option value="MID">Trung cấp</option>
                  <option value="SENIOR">Cao cấp</option>
                  <option value="EXPERT">Chuyên gia</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="educationLevel"
                  className="block text-gray-800 font-medium mb-1"
                >
                  Trình độ học vấn
                </label>
                <select
                  id="educationLevel"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={this.handleChange}
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Chọn trình độ học vấn</option>
                  <option value="HIGH_SCHOOL">Trung học phổ thông</option>
                  <option value="ASSOCIATE">Bằng cao đẳng</option>
                  <option value="BACHELOR">Bằng cử nhân</option>
                  <option value="MASTER">Bằng thạc sĩ</option>
                  <option value="DOCTORATE">Bằng tiến sĩ</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-800 font-medium mb-1">
                Kỹ năng bắt buộc*
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {skills.map((skill) => (
                  <label
                    key={skill.id}
                    className="flex items-center space-x-2 text-gray-800"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedSkills.includes(skill.id)}
                      onChange={() => this.handleSkillChange(skill.id)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{skill.name}</span>
                  </label>
                ))}
              </div>
              {errors.selectedSkills && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.selectedSkills}
                </div>
              )}
            </div>
          </div>

          {/* Posting Details */}
          <div className="mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Chi tiết đăng tuyển
            </h2>

            <div className="mb-4">
              <label
                htmlFor="deadline"
                className="block text-gray-800 font-medium mb-1"
              >
                Hạn chót nộp đơn*
              </label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline}
                onChange={this.handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
              {errors.deadline && (
                <div className="text-red-600 text-sm mt-1">
                  {errors.deadline}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded font-medium hover:bg-gray-300 transition-colors duration-200"
              onClick={() => this.props.history.push("/admin/jobs")}
            >
              Hủy
            </button>

            <button
              type="button"
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded font-medium hover:bg-gray-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={this.handleSaveAsDraft}
              disabled={isSubmitting}
            >
              Lưu bản nháp
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditing
                  ? "Đang cập nhật..."
                  : "Đang tạo..."
                : isEditing
                ? "Cập nhật công việc"
                : "Tạo công việc"}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

CreateJobPage.propTypes = {
  isEditing: PropTypes.bool,
  match: PropTypes.object.isRequired, // Injected by withRouter
  history: PropTypes.object.isRequired, // Injected by withRouter
};

CreateJobPage.defaultProps = {
  isEditing: false,
};

export default withRouter(CreateJobPage);
