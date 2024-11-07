import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/main";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Copy } from "lucide-react"; // Importing icons from lucide-react

const UV_SavedWorkflows: React.FC = () => {
  const [savedWorkflows, setSavedWorkflows] = useState<any[]>([]);
  const { userId, token } = useSelector((state: RootState) => state.authenticated_user) || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetchSavedWorkflows();
    }
  }, [token]);

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

  const handleEdit = (workflowId: string) => {
    navigate(`/workflows?workflow_id=${workflowId}`);
  };

  const handleDuplicate = async (workflowId: string) => {
    try {
      await axios.post(
        `http://localhost:1337/api/workflows`,
        { workflow_id: workflowId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSavedWorkflows();
    } catch (error) {
      console.error("Failed to duplicate workflow", error);
    }
  };

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
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-4xl font-semibold mb-8">Saved Workflows</h1>

        {savedWorkflows.length === 0 ? (
          <div className="text-center">
            <p className="text-lg mb-4">You don’t have any saved workflows yet.</p>
            <Link to="/workflows/new">
              <Button>Create New Workflow</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedWorkflows.map((workflow) => (
              <div key={workflow.workflow_id} className="p-6 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold mb-2">{workflow.title}</h2>
                <Badge variant="outline" className="mb-2">{workflow.category}</Badge>
                <p className="text-sm text-gray-600 mb-4">
                  Last modified: {new Date(workflow.lastModified).toLocaleDateString()}
                </p>

                <div className="flex justify-between gap-3">
                  <Button variant="outline" className="flex items-center gap-2" onClick={() => handleEdit(workflow.workflow_id)}>
                    <Edit className="w-4 h-4" /> Edit
                  </Button>

                  <Button variant="outline" className="flex items-center gap-2" onClick={() => handleDuplicate(workflow.workflow_id)}>
                    <Copy className="w-4 h-4" /> Duplicate
                  </Button>

                  <Button variant="destructive" className="flex items-center gap-2" onClick={() => handleDelete(workflow.workflow_id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
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