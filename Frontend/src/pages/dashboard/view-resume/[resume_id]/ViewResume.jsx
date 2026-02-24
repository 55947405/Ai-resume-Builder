import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getResumeData } from "@/Services/resumeAPI";
import ResumePreview from "../../edit-resume/components/PreviewPage";
import { useDispatch } from "react-redux";
import { addResumeData } from "@/features/resume/resumeFeatures";
import { RWebShare } from "react-web-share";
import { toast } from "sonner";
import { FaDownload, FaShare, FaEdit, FaArrowLeft, FaCheckCircle } from "react-icons/fa";

function ViewResume() {
  const [resumeInfo, setResumeInfo] = React.useState({});
  const { resume_id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumeInfo();
  }, []);
  const fetchResumeInfo = async () => {
    const response = await getResumeData(resume_id);
    dispatch(addResumeData(response.data));
  };

  const HandleDownload = () => {
    window.print();
  };

  const handleEditClick = () => {
    navigate(`/dashboard/edit-resume/${resume_id}`);
  };

  const handleBackClick = () => {
    navigate(`/dashboard`);
  };

  return (
    <>
      <div className="flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <div id="noPrint" className="w-full">
          <div className="my-10 mx-10 md:mx-20 lg:mx-36">
            {/* Success Banner */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-3 mb-3">
                <FaCheckCircle className="text-green-600 text-2xl" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Resume is Ready! 🎉
                </h2>
              </div>
              <p className="text-gray-600 text-lg">
                Your AI-powered resume has been successfully created. You can now download it, share it with employers, or continue editing to make it perfect.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <Button
                onClick={HandleDownload}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <FaDownload size={20} />
                Download PDF
              </Button>
              <RWebShare
                data={{
                  text: "Check out my AI-generated resume!",
                  url: import.meta.env.VITE_APP_URL + "/dashboard/view-resume/" + resume_id,
                  title: "My Resume",
                }}
                onClick={() => toast("Resume link copied successfully!")}
              >
                <Button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <FaShare size={20} />
                  Share Resume
                </Button>
              </RWebShare>
              <Button
                onClick={handleEditClick}
                className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white py-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                <FaEdit size={20} />
                Edit Resume
              </Button>
              <Button
                onClick={handleBackClick}
                variant="outline"
                className="flex items-center justify-center gap-2 border-2 py-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <FaArrowLeft size={20} />
                Back to Dashboard
              </Button>
            </div>

            {/* Info Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-10">
              <div className="bg-white p-4 rounded-lg border-l-4 border-blue-600 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">💾 Save & Store</h3>
                <p className="text-sm text-gray-600">Your resume is saved in the cloud and accessible anytime</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-l-4 border-purple-600 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">📧 Share Easily</h3>
                <p className="text-sm text-gray-600">Share with employers directly or through social media</p>
              </div>
              <div className="bg-white p-4 rounded-lg border-l-4 border-green-600 shadow-md">
                <h3 className="font-bold text-gray-900 mb-2">✏️ Edit Anytime</h3>
                <p className="text-sm text-gray-600">Update your resume whenever you want with new achievements</p>
              </div>
            </div>
          </div>
        </div>
        <div
          className=" bg-white rounded-lg p-8 print-area"
          style={{ width: "210mm", height: "297mm" }}
        >
          <div className="print">
            <ResumePreview />
          </div>
        </div>
      </div>
    </>
  );
}

export default ViewResume;
