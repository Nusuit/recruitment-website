import React, { Component } from "react";
import { withRouter } from "react-router-dom"; // Use withRouter to access location and history
import { candidateAPI } from "../../api/candidate"; // Import candidateAPI
import JobList from "../../components/jobs/JobList";
import JobFilters from "../../components/jobs/JobFilters";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner"; // Import LoadingSpinner
import EmptyState from "../../components/common/EmptyState"; // Import EmptyState

class JobsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      loading: true,
      error: null,
      searchParams: {
        keyword: "",
        location: "",
        category: "",
        experience: [],
        salary: [],
        jobType: [],
        education: [],
        jobLevel: [],
      },
      currentPage: 1,
      totalPages: 1,
      totalJobsCount: 0, // To store total count from API
    };
    this.fetchJobs = this.fetchJobs.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.handleClearFilters = this.handleClearFilters.bind(this);
    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleMainSearch = this.handleMainSearch.bind(this);
  }

  componentDidMount() {
    // Parse query parameters on mount
    this.parseQueryParams();
  }

  componentDidUpdate(prevProps, prevState) {
    // Re-fetch jobs if searchParams or currentPage changes
    if (
      prevState.searchParams !== this.state.searchParams ||
      prevState.currentPage !== this.state.currentPage ||
      this.props.location.search !== prevProps.location.search // Listen for URL changes
    ) {
      this.fetchJobs();
    }
  }

  parseQueryParams() {
    const queryParams = new URLSearchParams(this.props.location.search);
    const newSearchParams = { ...this.state.searchParams };

    // Update search params from query parameters
    newSearchParams.keyword = queryParams.get("keyword") || "";
    newSearchParams.location = queryParams.get("location") || "";
    newSearchParams.category = queryParams.get("category") || "";
    newSearchParams.experience = queryParams.getAll("experience") || [];
    newSearchParams.salary = queryParams.getAll("salary") || [];
    newSearchParams.jobType = queryParams.getAll("jobType") || [];
    newSearchParams.education = queryParams.getAll("education") || [];
    newSearchParams.jobLevel = queryParams.getAll("jobLevel") || [];

    this.setState({ searchParams: newSearchParams }, () => {
      // Fetch jobs after state is updated from URL
      this.fetchJobs();
    });
  }

  async fetchJobs() {
    this.setState({ loading: true, error: null });
    const { searchParams, currentPage } = this.state;

    try {
      const params = {
        keyword: searchParams.keyword,
        location: searchParams.location,
        category: searchParams.category,
        experience: searchParams.experience.join(","), // Convert array to comma-separated string for API
        salary: searchParams.salary.join(","),
        jobType: searchParams.jobType.join(","),
        education: searchParams.education.join(","),
        jobLevel: searchParams.jobLevel.join(","),
        page: currentPage,
        limit: 10, // Number of items per page
      };

      const response = await candidateAPI.getJobs(params); // Call your backend API

      this.setState({
        jobs: response.jobs,
        totalPages: response.totalPages,
        totalJobsCount: response.totalJobs,
        loading: false,
      });
    } catch (err) {
      console.error("Lỗi khi lấy danh sách công việc:", err);
      this.setState({
        error: "Không thể tải danh sách công việc. Vui lòng thử lại sau.",
        loading: false,
      });
    }
  }

  handleFilterChange(newFilters) {
    this.setState(
      (prevState) => ({
        searchParams: {
          ...prevState.searchParams,
          ...newFilters,
        },
        currentPage: 1, // Reset to first page when filters change
      }),
      () => {
        // Update URL query params
        const { searchParams } = this.state;
        const query = new URLSearchParams();
        Object.keys(searchParams).forEach((key) => {
          const value = searchParams[key];
          if (Array.isArray(value)) {
            value.forEach((item) => query.append(key, item));
          } else if (value) {
            query.append(key, value);
          }
        });
        this.props.history.push(`/jobs?${query.toString()}`);
      }
    );
  }

  handleClearFilters() {
    this.setState(
      {
        searchParams: {
          keyword: "",
          location: "",
          category: "",
          experience: [],
          salary: [],
          jobType: [],
          education: [],
          jobLevel: [],
        },
        currentPage: 1,
      },
      () => {
        this.props.history.push("/jobs"); // Clear URL params
      }
    );
  }

  handlePageChange(pageNumber) {
    this.setState({ currentPage: pageNumber }, () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  handleSearchInputChange(e) {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      searchParams: {
        ...prevState.searchParams,
        [name]: value,
      },
    }));
  }

  handleMainSearch() {
    this.setState({ currentPage: 1 }, () => {
      const { searchParams } = this.state;
      const query = new URLSearchParams();
      Object.keys(searchParams).forEach((key) => {
        const value = searchParams[key];
        if (Array.isArray(value)) {
          value.forEach((item) => query.append(key, item));
        } else if (value) {
          query.append(key, value);
        }
      });
      this.props.history.push(`/jobs?${query.toString()}`);
    });
  }

  render() {
    const {
      jobs,
      loading,
      error,
      searchParams,
      currentPage,
      totalPages,
      totalJobsCount,
    } = this.state;

    return (
      <div className="job-search-page">
        <div className="py-8 text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Khám phá các cơ hội việc làm của chúng tôi
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Duyệt qua danh sách việc làm của chúng tôi và thực hiện bước đầu
            tiên hướng tới một sự nghiệp thú vị với chúng tôi.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-wrap items-center gap-4">
          <div className="flex-1 flex flex-col md:flex-row gap-2 min-w-full md:min-w-0">
            <div className="relative flex-1">
              <input
                type="text"
                name="keyword"
                placeholder="Chức danh, từ khóa..."
                value={searchParams.keyword}
                onChange={this.handleSearchInputChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                name="location"
                placeholder="Địa điểm"
                value={searchParams.location}
                onChange={this.handleSearchInputChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <i className="fa-solid fa-location-dot absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
            <div className="relative flex-1">
              <select
                name="category"
                value={searchParams.category}
                onChange={this.handleSearchInputChange}
                className="w-full p-3 pl-10 border border-gray-300 rounded appearance-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="">Chọn danh mục</option>
                <option value="design">Thiết kế thời trang</option>
                <option value="marketing">Tiếp thị</option>
                <option value="sales">Bán hàng</option>
                <option value="production">Sản xuất</option>
                <option value="management">Quản lý</option>
                <option value="retail">Bán lẻ</option>
              </select>
              <i className="fa-solid fa-briefcase absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors duration-200 min-w-[120px]"
            onClick={this.handleMainSearch}
          >
            Tìm việc
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <JobFilters
              filters={searchParams}
              onFilterChange={this.handleFilterChange}
              onClearFilters={this.handleClearFilters}
            />
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <LoadingSpinner fullPage={false} />
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
                {error}
              </div>
            ) : jobs.length === 0 ? (
              <EmptyState
                icon="search"
                title="Không tìm thấy việc làm nào"
                description="Không có việc làm nào phù hợp với tiêu chí tìm kiếm của bạn. Hãy thử điều chỉnh bộ lọc."
                action={
                  <button
                    onClick={this.handleClearFilters}
                    className="px-6 py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 transition-colors duration-200"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                }
              />
            ) : (
              <>
                <div className="text-sm text-gray-600 mb-4">
                  Hiển thị {jobs.length} trong số {totalJobsCount} việc làm
                </div>
                <JobList jobs={jobs} />

                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={this.handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

JobsPage.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(JobsPage);
