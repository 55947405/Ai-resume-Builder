import Header from "@/components/custom/Header";
import React, { useEffect, useState } from "react";
import heroSnapshot from "@/assets/react.svg";
import { useNavigate } from "react-router-dom";
import { FaGithub, FaCircle, FaInfoCircle, FaRobot, FaEdit, FaDownload, FaAward, FaLightbulb, FaChartLine } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { startUser } from "../../Services/login.js";
import { useDispatch, useSelector } from "react-redux";
import { addUserData } from "@/features/user/userFeatures.js";

function HomePage() {
  const user = useSelector((state) => state.editUser.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [scrollY, setScrollY] = useState(0);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    window.open(
      "https://github.com/Bharamdev",
      "_blank"
    );
  };

  useEffect(() => {
    const fetchResponse = async () => {
      try {
        const response = await startUser();
        if (response.statusCode == 200) {
          dispatch(addUserData(response.data));
        } else {
          dispatch(addUserData(""));
        }
      } catch (error) {
        console.log(
          "Printing from Home Page there was a error ->",
          error.message
        );
        dispatch(addUserData(""));
      }
    };
    fetchResponse();
  }, []);

  const hadnleGetStartedClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth/sign-in");
    }
  };
  return (
    <>
      <Header user={user} />
      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-white via-blue-50 to-purple-50 overflow-hidden relative min-h-screen flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{animationDelay: "1s"}}></div>
        </div>
        <div className="px-12 mx-auto max-w-7xl relative z-10 w-full">
          <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center transform transition-all duration-700" style={{opacity: 1 - scrollY / 500, transform: `translateY(${scrollY * 0.3}px)`}}>
            <div className="inline-block mb-6 px-4 py-2 bg-blue-100 rounded-full text-blue-700 font-semibold text-sm animate-bounce">
              ✨ AI-Powered Resume Builder
            </div>
            <h1 className="mb-8 text-4xl font-extrabold leading-none tracking-normal text-gray-900 md:text-6xl md:tracking-tight">
              <span>Start</span>{" "}
              <span className="block w-full py-2 text-transparent bg-clip-text leading-12 bg-gradient-to-r from-green-400 to-purple-500 lg:inline animate-gradient">
                building a Resume
              </span>{" "}
              <span>for your next Job</span>
            </h1>
            <p className="px-0 mb-8 text-lg text-gray-600 md:text-xl lg:px-24">
              Build. Refine. Shine. With AI-Driven Resumes
            </p>
            <div className="mb-4 space-x-0 md:space-x-2 md:mb-8">
              <a
                className="inline-flex items-center justify-center w-full px-6 py-3 mb-2 text-lg text-white bg-green-400 rounded-2xl sm:w-auto sm:mb-0 hover:cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                onClick={hadnleGetStartedClick}
              >
                Get Started
                <svg
                  className="w-4 h-4 ml-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a
                onClick={handleClick}
                className="inline-flex items-center justify-center w-full px-6 py-3 mb-2 text-lg bg-gray-100 rounded-2xl sm:w-auto sm:mb-0 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Learn More
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  ></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="w-full mx-auto mt-20 text-center md:w-10/12">
            <div className="relative z-0 w-full mt-8">
              <div className="relative overflow-hidden shadow-2xl rounded-lg transform transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between px-4 bg-gradient-to-r from-green-400 to-purple-500 h-11 rounded-t-lg">
                  <div className="flex space-x-1.5">
                    <FaCircle className="w-3 h-3 text-white hover:text-gray-300 transition duration-300 transform hover:scale-125 cursor-pointer" />
                    <FaCircle className="w-3 h-3 text-white hover:text-gray-300 transition duration-300 transform hover:scale-125 cursor-pointer" />
                    <FaCircle className="w-3 h-3 text-white hover:text-gray-300 transition duration-300 transform hover:scale-125 cursor-pointer" />
                  </div>
                  <FaInfoCircle className="text-white hover:text-gray-300 transition duration-300 transform hover:rotate-45 cursor-pointer" />
                </div>
                <img
                  className="object-cover py-2 px-4 rounded-b-lg transition duration-300 transform hover:scale-105"
                  src={heroSnapshot}
                  alt="Dashboard"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="px-12 mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to create a standout resume</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaRobot className="w-8 h-8" />,
                title: "AI-Powered Writing",
                description: "Get intelligent suggestions to improve your resume content and match job descriptions",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <FaEdit className="w-8 h-8" />,
                title: "Easy to Edit",
                description: "Intuitive interface with real-time preview. Update your resume anytime, anywhere",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: <FaDownload className="w-8 h-8" />,
                title: "Multiple Formats",
                description: "Download your resume in PDF, Word, or share directly with employers",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: <FaAward className="w-8 h-8" />,
                title: "Professional Templates",
                description: "Choose from ATS-friendly templates designed by hiring professionals",
                color: "from-orange-500 to-red-500"
              },
              {
                icon: <FaLightbulb className="w-8 h-8" />,
                title: "Smart Suggestions",
                description: "Get personalized tips to optimize your resume for better visibility",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: <FaChartLine className="w-8 h-8" />,
                title: "Track Success",
                description: "Monitor how your resume performs and get insights for improvement",
                color: "from-indigo-500 to-blue-500"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg border-2 border-transparent transition-all duration-300 cursor-pointer transform hover:scale-105 bg-gradient-to-br ${feature.color} hover:shadow-lg`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-gray-900 mb-4 transform transition-transform duration-300" style={{transform: hoveredFeature === index ? "rotate(12deg) scale(1.1)" : "rotate(0) scale(1)"}}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-100">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="px-12 mx-auto max-w-7xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Land Your Dream Job?</h2>
          <p className="text-xl mb-8 text-blue-100">Join thousands of job seekers who've already built their perfect resume</p>
          <Button
            onClick={hadnleGetStartedClick}
            className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-3 font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Get Started Now →
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="px-12 mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Resumes Created" },
              { number: "95%", label: "Job Interview Rate" },
              { number: "50+", label: "Template Designs" },
              { number: "24/7", label: "Support Available" }
            ].map((stat, index) => (
              <div key={index} className="p-6 transform transition-all duration-300 hover:scale-110">
                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">{stat.number}</div>
                <p className="text-gray-400 text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200" aria-labelledby="footer-heading">
        <div className="mt-16 pt-8 sm:mt-20 lg:mt-24 p-5 flex justify-between items-center">\n          <div>
            <p className="text-sm leading-5 text-gray-600 font-semibold">
              AI-Resume-Builder
            </p>
            <p className="text-xs leading-5 text-gray-500">
              &copy; 2026 All rights reserved. Powered by AI Technology.
            </p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={handleClick}>
              <FaGithub className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button variant="outline">
              Privacy Policy
            </Button>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
          background-size: 200% 200%;
        }
      `}</style>
    </>
  );
}

export default HomePage;
