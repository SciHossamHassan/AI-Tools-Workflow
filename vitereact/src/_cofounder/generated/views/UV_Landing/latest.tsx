import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/main";
import { Link, useNavigate } from "react-router-dom";

// Button components following proper imports aligned with the provided documentation
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

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
        <div className="container mx-auto text-center px-6">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Top A.I. Tools Hub
          </h1>
          <p className="mt-4 text-xl text-gray-700 mb-8">
            Discover the best AI tools to enhance your productivity or build tailored workflows to suit your needs.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-center sm:space-x-6">
            {/* Discover AI Tools Button */}
            <Link to="/ai-tools">
              <Button variant="outline" className="px-8 py-3 text-lg">
                Discover AI Tools
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

            {/* Workflow Builder Button */}
            {isAuthenticated ? (
              <Button
                onClick={() => navigate("/workflows")}
                variant="secondary"
                className="px-8 py-3 text-lg"
              >
                Build a Workflow
              </Button>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                variant="secondary"
                className="px-8 py-3 text-lg"
              >
                Log in to Start Workflow
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Feature Explanation Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">
            How it Works
          </h2>
          <p className="mt-6 text-lg text-center text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Top A.I. Tools Hub allows you to:
            <br /> 1. Discover AI tools to solve specific business tasks.
            <br /> 2. Build strategic workflows with relevant AI tool suggestions at each step.
          </p>
        </div>
      </section>

      {/* Optional Explainer Video Section (if video was provided) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-8">Watch How It Works</h3>
          <iframe 
            className="w-full md:w-3/4 h-64 mx-auto rounded-lg shadow-lg"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="Top A.I. Tools Hub explainer video" 
            allowFullScreen>
          </iframe>
        </div>
      </section>

      {/* CTA for Login/Signup if user is not authenticated */}
      {!isAuthenticated && (
        <section className="py-16 bg-green-100">
          <div className="container mx-auto text-center px-6">
            <h2 className="text-3xl font-bold text-green-900 mb-4">
              Ready to explore the world of AI? Log in or sign up to get started!
            </h2>
            <Link to="/login">
              <Button className="bg-green-600 text-white px-8 py-3 text-lg hover:bg-green-700">
                Log In / Sign Up
              </Button>
            </Link>
          </div>
        </section>
      )}
    </>
  );
};

export default UV_Landing;