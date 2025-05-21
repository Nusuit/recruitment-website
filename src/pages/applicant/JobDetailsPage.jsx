import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom"; // Import withRouter
import AuthContext from "../../contexts/AuthContext";
import JobsContext from "../../contexts/JobsContext";
import ApplyForm from "../../components/jobs/ApplyForm";
import Modal from "../../components/common/Modal";
import { formatDate } from "../../utils/formatters";
import PropTypes from "prop-types";

class JobDetailsPage extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      job: null,
      loading: true,
      error: null,
      showApplyModal: false,
      isSaved: false,
      hasApplied: false,
    };
    this.fetchJobDetails = this.fetchJobDetails.bind(this);
    this.handleApplyClick = this.handleApplyClick.bind(this);
    this.handleSaveJob = this.handleSaveJob.bind(this);
    this.handleApplySubmit = this.handleApplySubmit.bind(this);
    this.parseList = this.parseList.bind(this);
  }

  componentDidMount() {
    this.fetchJobDetails();
  }

  async fetchJobDetails() {
    this.setState({ loading: true, error: null });
    const { id } = this.props.match.params;
    const { getJobById, isJobSaved, hasAppliedToJob } = this.context; // Assuming these are available from JobsContext or passed via props

    try {
      // In a real app, this would be an API call to get job details
      // For now, simulate fetching from JobsContext
      const job = getJobById(id);

      if (job) {
        this.setState({
          job,
          isSaved: isJobSaved(job.id),
          hasApplied: hasAppliedToJob(job.id),
          loading: false,
        });
      } else {
        this.setState({
          error: "Không tìm thấy chi tiết công việc.",
          loading: false,
        });
      }
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết công việc:", err);
      this.setState({
        error: "Không thể tải chi tiết công việc. Vui lòng thử lại sau.",
        loading: false,
      });
    }
  }

  handleApplyClick() {
    const { user } = this.context;
    const { id } = this.props.match.params;

    if (!user) {
      this.props.history.push("/login", { state: { from: `/jobs/${id}` } });
    } else {
      this.setState({ showApplyModal: true });
    }
  }

  handleSaveJob() {
    const { user } = this.context;
    const { id } = this.props.match.params;
    const { toggleSaveJob } = this.context; // Assuming toggleSaveJob is available from JobsContext

    if (!user) {
      this.props.history.push("/login", { state: { from: `/jobs/${id}` } });
    } else {
      toggleSaveJob(id); // Call to save/unsave the job
      this.setState((prevState) => ({ isSaved: !prevState.isSaved }));
    }
  }

  handleApplySubmit(formData) {
    console.log("Đơn đăng ký đã được gửi:", formData);
    this.setState({ showApplyModal: false, hasApplied: true });
    // Optionally, redirect to applications page
    this.props.history.push("/applicant/applications", {
      state: { success: true, message: "Đơn đăng ký đã được gửi thành công!" },
    });
  }

  parseList(text) {
    if (!text) return [];
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  render() {
    const { job, loading, error, showApplyModal, isSaved, hasApplied } =
      this.state;

    if (loading) {
      return (
        <div className="text-center py-8">Đang tải chi tiết công việc...</div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      );
    }

    if (!job) {
      return <div className="text-center py-8">Không tìm thấy công việc.</div>;
    }

    const responsibilities = this.parseList(job.responsibilities);
    const requirements = this.parseList(job.requirements);
    const benefits = this.parseList(job.benefits);
    const skills = job.skills
      ? job.skills.split(",").map((skill) => skill.trim())
      : [];

    return (
      <div className="job-details-page p-6 bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
              <img
                src="/assets/images/logo.png"
                alt={job.company}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                {job.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 text-gray-600 text-sm">
                <span className="font-medium">{job.company}</span>
                <span className="flex items-center">
                  <i className="fa-solid fa-location-dot mr-1"></i>{" "}
                  {job.location}
                </span>
                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs font-medium">
                  {job.type}
                </span>
                <span>Đăng: {formatDate(job.postedDate)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4 md:mt-0 w-full md:w-auto">
            <button
              className={`flex items-center gap-2 px-4 py-2 rounded font-medium transition-all duration-200 border
                ${
                  isSaved
                    ? "bg-blue-100 text-blue-600 border-blue-600"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                }`}
              onClick={this.handleSaveJob}
            >
              <i
                className={`fa-bookmark ${isSaved ? "fa-solid" : "fa-regular"}`}
              ></i>
              {isSaved ? "Đã lưu" : "Lưu việc làm"}
            </button>

            {hasApplied ? (
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded font-medium cursor-not-allowed"
                disabled
              >
                Đã ứng tuyển
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors duration-200"
                onClick={this.handleApplyClick}
              >
                Ứng tuyển ngay
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Mô tả công việc
              </h2>
              <div
                className="text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            {responsibilities.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Trách nhiệm
                </h2>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed">
                  {responsibilities.map((responsibility, index) => (
                    <li key={index} className="mb-2">
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {requirements.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Yêu cầu
                </h2>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="mb-2">
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {benefits.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Phúc lợi
                </h2>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="mb-2">
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {skills.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                  Kỹ năng yêu cầu
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1 flex flex-col space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Tổng quan công việc
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-industry text-lg"></i>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-600">Ngành</span>
                    <span className="block font-medium text-gray-800">
                      {job.industry || "Thời trang / Bán lẻ"}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-briefcase text-lg"></i>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-600">
                      Kinh nghiệm
                    </span>
                    <span className="block font-medium text-gray-800">
                      {job.experience}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-graduation-cap text-lg"></i>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-600">Học vấn</span>
                    <span className="block font-medium text-gray-800">
                      {job.education}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-yellow-100 text-yellow-600 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-dollar-sign text-lg"></i>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-600">
                      Mức lương
                    </span>
                    <span className="block font-medium text-gray-800">
                      {job.salary}
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                    <i className="fa-solid fa-calendar-times text-lg"></i>
                  </div>
                  <div>
                    <span className="block text-sm text-gray-600">
                      Hạn chót
                    </span>
                    <span className="block font-medium text-gray-800">
                      {formatDate(job.deadline)}
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Thông tin công ty
              </h3>
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center mb-4">
                <img
                  src="/assets/images/logo.png"
                  alt={job.company}
                  className="w-full h-full object-contain"
                />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {job.company}
              </h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                MyaCorp là nhà bán lẻ thời trang hàng đầu chuyên về quần áo và
                phụ kiện chất lượng cao.
              </p>
              <Link
                to="/about"
                className="block w-full py-2 bg-transparent text-blue-600 border border-blue-600 rounded font-medium text-center hover:bg-blue-600 hover:text-white transition-colors duration-200"
              >
                Xem hồ sơ công ty
              </Link>
            </div>
          </div>
        </div>

        {showApplyModal && (
          <Modal
            title={`Ứng tuyển cho ${job.title}`}
            onClose={() => this.setState({ showApplyModal: false })}
          >
            <ApplyForm
              jobId={job.id}
              jobTitle={job.title}
              onSubmit={this.handleApplySubmit}
            />
          </Modal>
        )}
      </div>
    );
  }
}

JobDetailsPage.propTypes = {
  match: PropTypes.object.isRequired, // Injected by withRouter
  history: PropTypes.object.isRequired, // Injected by withRouter
  location: PropTypes.object.isRequired, // Injected by withRouter
};

export default withRouter(JobDetailsPage);
