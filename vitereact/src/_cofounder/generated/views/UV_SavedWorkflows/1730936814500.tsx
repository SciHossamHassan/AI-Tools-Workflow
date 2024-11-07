import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/main";
import axios from "axios";

const UV_SavedWorkflows: React.FC = () => {
  const [savedWorkflows, setSavedWorkflows] = useState<any[]>([]);
  const { userId, token } = useSelector((state: RootState) => state.authenticated_user) || {};
  const navigate = useNavigate();

  // Fetch list of saved workflows on page load
  useEffect(() => {
    if (token) {
      fetchSavedWorkflows();
    }
  }, [token]);

  // Fetch workflows from backend
  const fetchSavedWorkflows = async () => {
    try {
      const response = await axios.get("http://localhost:1337/api/workflows", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSavedWorkflows(response.data);
    } catch (error) {
      console.error("Failed to fetch workflows", error);
    }
  };

  // Handle edit workflow: Redirect to the workflow builder
  const handleEdit = (workflowId: string) => {
    // Navigate to the workflow builder (with workflow pre-loaded)
    navigate(`/workflows?workflow_id=${workflowId}`);
  };

  // Handle duplicate workflow
  const handleDuplicate = async (workflowId: string) => {
    try {
      const response = await axios.post(
        `http://localhost:1337/api/workflows`,
        { workflow_id: workflowId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Fetch updated workflows list
      fetchSavedWorkflows();
    } catch (error) {
      console.error("Failed to duplicate workflow", error);
    }
  };

  // Handle delete workflow
  const handleDelete = async (workflowId: string) => {
    if (confirm("Are you sure you want to delete this workflow?")) {
      try {
        await axios.delete(`http://localhost:1337/api/workflows/${workflowId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedWorkflows(savedWorkflows.filter((workflow) => workflow.workflow_id !== workflowId));
      } catch (error) {
        console.error("Failed to delete workflow", error);
      }
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">My Saved Workflows</h1>

        {savedWorkflows.length === 0 ? (
          <p>You don’t have any saved workflows yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedWorkflows.map((workflow) => (
              <div key={workflow.workflow_id} className="p-6 bg-white shadow-md rounded-lg">
                <h2 className="text-xl font-semibold mb-2">{workflow.title}</h2>
                <p className="text-sm text-gray-600 mb-4">{workflow.category}</p>
                <p className="text-xs text-gray-500 mb-6">Last modified: {new Date(workflow.lastModified).toLocaleDateString()}</p>

                <div className="flex justify-between">
                  <button
                    onClick={() => handleEdit(workflow.workflow_id)}
                    className="text-blue-500 hover:text-blue-700 font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDuplicate(workflow.workflow_id)}
                    className="text-green-500 hover:text-green-700 font-semibold"
                  >
                    Duplicate
                  </button>

                  <button
                    onClick={() => handleDelete(workflow.workflow_id)}
                    className="text-red-500 hover:text-red-700 font-semibold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default UV_SavedWorkflows;