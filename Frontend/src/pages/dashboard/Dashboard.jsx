import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { getAllResumeData } from "@/Services/resumeAPI";
import AddResume from "./components/AddResume";
import ResumeCard from "./components/ResumeCard";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FaHome, FaSearch, FaSortAmountDown, FaSync } from "react-icons/fa";

function Dashboard() {
  const user = useSelector((state) => state.editUser.userData);
  const navigate = useNavigate();
  const [resumeList, setResumeList] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortBy, setSortBy] = React.useState("latest"); // latest, oldest, alphabetical
  const [isLoading, setIsLoading] = React.useState(false);

  const fetchAllResumeData = async () => {
    try {
      setIsLoading(true);
      const resumes = await getAllResumeData();
      console.log(
        `Printing from DashBoard List of Resumes got from Backend`,
        resumes.data
      );
      setResumeList(resumes.data);
    } catch (error) {
      console.log("Error from dashboard", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllResumeData();
  }, [user]);

  // Filter resumes based on search term
  const filteredResumes = resumeList.filter((resume) =>
    resume?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort resumes based on selected option
  const sortedResumes = [...filteredResumes].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "alphabetical":
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      case "latest":
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const handleGoHome = () => {
    navigate("/");
  };

  const handleRefresh = () => {
    fetchAllResumeData();
  };

  return (
    <div className="p-10 md:px-20 lg:px-32">
      {/* Header Section with Home Button */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="font-bold text-3xl">My Resume</h2>
          <p className="py-3 text-gray-600">
            Start creating your AI resume for next Job role
          </p>
        </div>
        <Button
          onClick={handleGoHome}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
        >
          <FaHome size={18} />
          Home
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search resumes by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="latest">Latest First</option>
          <option value="oldest">Oldest First</option>
          <option value="alphabetical">Alphabetical</option>
        </select>

        <Button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <FaSync size={16} className={isLoading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* Resume Statistics */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-700">
          Total Resumes: <strong>{resumeList.length}</strong> | Showing:{" "}
          <strong>{sortedResumes.length}</strong>
        </p>
      </div>

      {/* Resume Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4">
        <AddResume />
        {sortedResumes.length > 0 ? (
          sortedResumes.map((resume) => (
            <ResumeCard
              key={resume._id}
              resume={resume}
              refreshData={fetchAllResumeData}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 text-lg">
              {resumeList.length === 0
                ? "No resumes yet. Create your first resume!"
                : "No resumes match your search."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
