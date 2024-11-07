import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

/* Interface for AI Tool’s Details */
interface AiToolDetails {
  tool_id: string;
  name: string;
  description: string;
  capabilities: string;
  outputs: string;
  pricing: {
    tiers: { name: string; features: string[]; price: string }[];
  };
  ease_of_use: number;
  tags: string[];
}

const UV_ToolDetails: React.FC = () => {
  // Fetching Params, and State Setup
  const { tool_id } = useParams<{ tool_id: string }>();
  const [toolDetails, setToolDetails] = useState<AiToolDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // API Call to Fetch AI Tool Details
  useEffect(() => {
    const fetchAiToolDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get<AiToolDetails>(
          `http://localhost:1337/api/ai_tools/${tool_id}`
        );
        setToolDetails(response.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAiToolDetails();
  }, [tool_id]);

  // Main Render
  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-lg text-gray-600 animate-pulse">Loading...</p>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-10">
          Failed to load tool details. Please try again later.
        </div>
      ) : toolDetails ? (
        <>
          <div className="max-w-4xl mx-auto p-6">
            {/* Title and Description */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-extrabold">{toolDetails.name}</h1>
              <p className="text-lg text-gray-600 mt-4">{toolDetails.description}</p>
            </div>

            {/* Capabilities Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Capabilities</h2>
              <p className="text-gray-700 leading-7">{toolDetails.capabilities}</p>
            </section>

            {/* Pricing Breakdown */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Pricing Breakdown</h2>
              <Table className="w-full text-center">
                <TableCaption>Pricing tiers for {toolDetails.name}</TableCaption>
                <TableHeader>
                  <TableRow>
                    {toolDetails.pricing.tiers.map((tier) => (
                      <TableHead key={tier.name}>{tier.name}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {toolDetails.pricing.tiers[0].features.map((_, featureIndex) => (
                    <TableRow key={featureIndex}>
                      {toolDetails.pricing.tiers.map((tier) => (
                        <TableCell key={tier.name}>{tier.features[featureIndex]}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </section>

            {/* Outputs / Use Cases */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold border-b pb-2 mb-4">
                What Can It Produce?
              </h2>
              <p className="text-gray-700 leading-7">{toolDetails.outputs}</p>
            </section>

            {/* Ease of Use with Star Rating */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Ease of Use</h2>
              <div className="flex items-center">
                {[...Array(toolDetails.ease_of_use)].map((_, i) => (
                  <svg
                    key={i}
                    className="h-6 w-6 text-yellow-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927C9.276 2.276 9.724 2.276 9.951 2.927l1.22 3.747L15 7.788c.564.146.793.778.341 1.174l-2.902 2.507.92 3.641c.169.687-.469 1.272-1.065.93L9.993 14.5 6.827 15.872c-.597.341-1.234-.243-1.065-.93l.92-3.641-2.902-2.507c-.452-.396-.223-1.028.341-1.174l3.78-.957 1.22-3.747z" />
                  </svg>
                ))}
              </div>
            </section>

            {/* Tags */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {toolDetails.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Case Studies */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold border-b pb-2 mb-4">Examples and Case Studies</h2>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Case Study 1</AccordionTrigger>
                  <AccordionContent>
                    Example content that showcases the AI tool in a real-world scenario.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Case Study 2</AccordionTrigger>
                  <AccordionContent>
                    Another example and detailed view of how the AI tool was used.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </section>

            {/* Back to Tools Directory */}
            <div className="mt-10">
              <Link
                to="/ai-tools"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition-colors"
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
