import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

interface AiToolDetails {
  tool_id: string;
  name: string;
  description: string;
  capabilities: string;
  outputs: string;
  pricing: string;
  ease_of_use: number;
  tags: string[];
}

const UV_ToolDetails: React.FC = () => {
  const { tool_id } = useParams<{ tool_id: string }>();
  const [toolDetails, setToolDetails] = useState<AiToolDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchAiToolDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get<AiToolDetails>(`http://localhost:1337/api/ai_tools/${tool_id}`);
        setToolDetails(response.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAiToolDetails();
  }, [tool_id]);

  return (
    <>
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">Failed to load tool details. Please try again later.</div>
      ) : toolDetails ? (
        <>
          <div className="max-w-4xl mx-auto p-6">
            {/* Header with Tool Name */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{toolDetails.name}</h1>
              <p className="text-lg text-gray-600">{toolDetails.description}</p>
            </div>

            {/* Tool Capabilities */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold">Capabilities</h2>
              <p className="text-gray-700 mt-2">{toolDetails.capabilities}</p>
            </section>

            {/* Pricing Breakdown */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold">Pricing Breakdown</h2>
              <p className="text-gray-700 mt-2">{toolDetails.pricing}</p>
            </section>

            {/* Outputs/Use Cases */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold">What Can It Produce?</h2>
              <p className="text-gray-700 mt-2">{toolDetails.outputs}</p>
            </section>

            {/* Ease of Use Rating */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold">Ease of Use</h2>
              <div className="flex items-center mt-2">
                {Array(toolDetails.ease_of_use)
                  .fill("")
                  .map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-yellow-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927C9.276 2.276 9.724 2.276 9.951 2.927l1.22 3.747L15 7.788c.564.146.793.778.341 1.174l-2.902 2.507.92 3.641c.169.687-.469 1.272-1.065.93L9.993 14.5 6.827 15.872c-.597.341-1.234-.243-1.065-.93l.92-3.641-2.902-2.507c-.452-.396-.223-1.028.341-1.174l3.78-.957 1.22-3.747zM9.05 1c-.425 0-.849.127-1.205.485-.357.357-.485.781-.485 1.205L9.96 1C9.724 2.276 9.276 2.276 9.049 1z" />
                    </svg>
                  ))}
              </div>
            </section>

            {/* Example Tags */}
            <section className="mb-6">
              <h2 className="text-2xl font-semibold">Tags</h2>
              <div className="mt-2 flex flex-wrap">
                {toolDetails.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 text-gray-700 text-sm mr-2 px-4 py-1 rounded-full mb-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Back to Directory Link */}
            <div className="mt-10">
              <Link
                to="/ai-tools"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
              >
                Back to AI Tools Directory
              </Link>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default UV_ToolDetails;