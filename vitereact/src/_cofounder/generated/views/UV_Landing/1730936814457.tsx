import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/main";
import { Link, useNavigate } from "react-router-dom";

const UV_Landing: React.FC = () => {
  // Fetch authentication state from global Redux store
  const authenticatedUser = useSelector((state: RootState) => state.authenticated_user);
  const isAuthenticated = authenticatedUser !== null; // Boolean check for authentication

  // React's navigate hook for programmatic navigation
  const navigate = useNavigate();

  return (
    <>
      {/* Hero Section with Primary CTAs for AI Tool Directory and Workflow Builder */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Welcome to Top A.I. Tools Hub
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Discover the best AI tools to enhance your productivity or build tailored workflows to suit your needs.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row sm:justify-center gap-4">
            {/* Discover AI Tools Button */}
            <Link
              to="/ai-tools"
              className="px-6 py-3 text-lg font-semibold bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            >
              Discover AI Tools
            </Link>

            {/* Workflow Builder Button */}
            {isAuthenticated ? (
              <button
                onClick={() => navigate("/workflows")}
                className="px-6 py-3 text-lg font-semibold bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
              >
                Build a Workflow
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 text-lg font-semibold bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
              >
                Log in to Start Workflow
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Feature Explanation Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            How it Works
          </h2>
          <p className="mt-6 text-center text-gray-700 text-lg max-w-3xl mx-auto">
            Top A.I. Tools Hub allows you to:
            <br /> 1. Discover AI tools to solve specific business tasks.
            <br /> 2. Build strategic workflows with relevant AI tool suggestions at each step.
          </p>
        </div>
      </section>

      {/* Optional Explainer Video Section (if video was provided) */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-900">Watch How It Works</h3>
          <iframe 
            className="mt-6 w-full sm:w-3/4 h-64 mx-auto rounded-lg shadow-lg" 
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="Top A.I. Tools Hub explainer video" 
            allowFullScreen>
          </iframe>
        </div>
      </section>

      {/* CTA for Login/Signup if user is not authenticated */}
      {!isAuthenticated && (
        <section className="py-12 bg-green-100">
          <div className="container mx-auto text-center">
            <h2 className="text-2xl font-bold text-green-800">
              Ready to explore the world of AI? Log in or sign up to get started!
            </h2>
            <div className="mt-6">
              <Link
                to="/login"
                className="px-6 py-3 text-lg bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
              >
                Log In / Sign Up
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default UV_Landing;