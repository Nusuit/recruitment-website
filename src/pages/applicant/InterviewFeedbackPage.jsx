import React, { Component } from "react";
import { withRouter } from "react-router-dom"; // Import withRouter
import { candidateAPI } from "../../api/candidate";
import PropTypes from "prop-types";

class InterviewFeedbackPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      application: null,
      loading: true,
      error: null,
      feedbackSent: false,
      feedback: {
        overallExperience: 5, // 1-10
        preparedness: 5, // 1-10
        clarity: 5, // 1-10
        technicalDepth: 5, // 1-10
        cultureFit: 5, // 1-10
        comments: "",
        wouldRecommend: null, // true/false
      },
    };
    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.fetchApplicationDetails = this.fetchApplicationDetails.bind(this);
  }

  componentDidMount() {
    this.fetchApplicationDetails();
  }

  async fetchApplicationDetails() {
    this.setState({ loading: true, error: null });
    const { applicationId } = this.props.match.params;

    try {
      const response = await candidateAPI.getApplicationDetail(applicationId);
      if (!response.application.interview) {
        throw new Error("Không tìm thấy chi tiết phỏng vấn");
      }
      this.setState({
        application: response.application,
        feedback: response.application.feedback || this.state.feedback, // Load existing feedback
        feedbackSent: !!response.application.feedback, // Set feedbackSent if feedback exists
        loading: false,
      });
    } catch (err) {
      this.setState({
        error:
          err.message || "Không thể tải chi tiết phỏng vấn. Vui lòng thử lại.",
        loading: false,
      });
      console.error("Lỗi khi lấy đơn đăng ký:", err);
    }
  }

  handleRatingChange(field, value) {
    this.setState((prevState) => ({
      feedback: {
        ...prevState.feedback,
        [field]: value,
      },
    }));
  }

  async handleSubmit(e) {
    e.preventDefault();
    this.setState({ error: null });
    const { applicationId } = this.props.match.params;

    try {
      await candidateAPI.updateApplication(applicationId, {
        feedback: this.state.feedback,
      });
      this.setState({ feedbackSent: true });

      setTimeout(() => {
        this.props.history.push("/applicant/applications");
      }, 2000);
    } catch (err) {
      this.setState({ error: "Không thể gửi phản hồi. Vui lòng thử lại." });
      console.error("Lỗi khi gửi phản hồi:", err);
    }
  }

  render() {
    const { application, loading, error, feedbackSent, feedback } = this.state;

    if (loading) {
      return (
        <div className="text-center py-8">Đang tải chi tiết phỏng vấn...</div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
      );
    }

    if (!application) {
      return (
        <div className="text-center py-8">
          Không tìm thấy chi tiết đơn đăng ký.
        </div>
      );
    }

    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Phản hồi phỏng vấn
          </h1>
          <p className="text-gray-600">
            Vui lòng chia sẻ suy nghĩ của bạn về trải nghiệm phỏng vấn
          </p>
        </div>

        {feedbackSent ? (
          <div className="bg-green-100 text-green-700 p-6 rounded mb-4 text-center">
            <div className="text-2xl mb-2">✓</div>
            <h2 className="text-xl font-semibold mb-2">
              Cảm ơn bạn đã phản hồi!
            </h2>
            <p className="text-gray-700">
              Phản hồi của bạn giúp chúng tôi cải thiện quy trình phỏng vấn.
            </p>
          </div>
        ) : (
          <form onSubmit={this.handleSubmit}>
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Chi tiết phỏng vấn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm">Vị trí</label>
                  <span className="block text-gray-800 font-medium">
                    {application.jobTitle}
                  </span>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm">Công ty</label>
                  <span className="block text-gray-800 font-medium">
                    {application.company}
                  </span>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm">Ngày</label>
                  <span className="block text-gray-800 font-medium">
                    {new Date(
                      application.interview.dateTime
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm">Loại</label>
                  <span className="block text-gray-800 font-medium">
                    {application.interview.type}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Đánh giá trải nghiệm của bạn
              </h2>

              <div className="mb-4">
                <label className="block text-gray-800 font-medium mb-2">
                  Trải nghiệm phỏng vấn tổng thể
                </label>
                <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200
                        ${
                          feedback.overallExperience === num
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-200"
                        }`}
                      onClick={() =>
                        this.handleRatingChange("overallExperience", num)
                      }
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Kém</span>
                  <span>Xuất sắc</span>
                </div>
              </div>

              {/* Repeat for other rating groups */}
              <div className="mb-4">
                <label className="block text-gray-800 font-medium mb-2">
                  Sự chuẩn bị của người phỏng vấn
                </label>
                <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200
                        ${
                          feedback.preparedness === num
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-200"
                        }`}
                      onClick={() =>
                        this.handleRatingChange("preparedness", num)
                      }
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Chưa chuẩn bị</span>
                  <span>Chuẩn bị tốt</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-800 font-medium mb-2">
                  Sự rõ ràng của câu hỏi
                </label>
                <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200
                        ${
                          feedback.clarity === num
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-200"
                        }`}
                      onClick={() => this.handleRatingChange("clarity", num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Không rõ ràng</span>
                  <span>Rất rõ ràng</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-800 font-medium mb-2">
                  Độ sâu thảo luận kỹ thuật
                </label>
                <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200
                        ${
                          feedback.technicalDepth === num
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-200"
                        }`}
                      onClick={() =>
                        this.handleRatingChange("technicalDepth", num)
                      }
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Quá cơ bản</span>
                  <span>Vừa đủ</span>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-800 font-medium mb-2">
                  Thảo luận về văn hóa công ty
                </label>
                <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200
                        ${
                          feedback.cultureFit === num
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-200"
                        }`}
                      onClick={() => this.handleRatingChange("cultureFit", num)}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Không thảo luận</span>
                  <span>Được đề cập tốt</span>
                </div>
              </div>
            </div>

            <div className="mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Bạn có giới thiệu công ty chúng tôi cho người khác không?
              </h2>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className={`px-6 py-2 rounded font-medium transition-colors duration-200
                    ${
                      feedback.wouldRecommend === true
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  onClick={() =>
                    this.handleRatingChange("wouldRecommend", true)
                  }
                >
                  Có
                </button>
                <button
                  type="button"
                  className={`px-6 py-2 rounded font-medium transition-colors duration-200
                    ${
                      feedback.wouldRecommend === false
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  onClick={() =>
                    this.handleRatingChange("wouldRecommend", false)
                  }
                >
                  Không
                </button>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Bình luận bổ sung
              </h2>
              <textarea
                value={feedback.comments}
                onChange={(e) =>
                  this.handleRatingChange("comments", e.target.value)
                }
                placeholder="Vui lòng chia sẻ bất kỳ suy nghĩ hoặc đề xuất bổ sung nào về trải nghiệm phỏng vấn của bạn..."
                rows="5"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors duration-200"
              >
                Gửi phản hồi
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }
}

InterviewFeedbackPage.propTypes = {
  match: PropTypes.object.isRequired, // Injected by withRouter
  history: PropTypes.object.isRequired, // Injected by withRouter
};

export default withRouter(InterviewFeedbackPage);
