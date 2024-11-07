import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addNode, removeNode, setWorkflowMeta, resetWorkflow } from '@/store/main';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // For generating random node ids.

const UV_WorkflowBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Global state: Workflow being worked on and authenticated user.
  const workflow = useSelector((state: RootState) => state.workflow_in_progress);
  const authenticatedUser = useSelector((state: RootState) => state.authenticated_user);

  // Local state for managing AI tool suggestions per node.
  const [currentNode, setCurrentNode] = useState({ nodeId: '', title: '', description: '', aiToolSuggestions: [] });

  // For loading AI tool suggestions.
  const [loadingTools, setLoadingTools] = useState(false);

  // Handlers:
  const handleNodeCreation = () => {
    const newNode = {
      node_id: uuidv4(), // unique node id generation
      title: '',
      description: ''
    };
    dispatch(addNode(newNode));
  };

  const handleDeleteNode = (nodeId: string) => {
    dispatch(removeNode(nodeId));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
    setCurrentNode(prevState => ({ ...prevState, [field]: event.target.value }));
  };

  const fetchAiToolSuggestions = async (nodeId: string) => {
    try {
      setLoadingTools(true); // Start loader

      const response = await axios.get(`http://localhost:1337/api/workflows/${workflow.workflow_id}/nodes/${nodeId}/suggestions`, {
        headers: {
          Authorization: `Bearer ${authenticatedUser?.token}`,
        },
      });

      const suggestions = response.data.map((tool: any) => ({
        tool_id: tool.tool_id,
        name: tool.name,
        description: tool.description,
      }));

      setCurrentNode((prevState) => ({ ...prevState, aiToolSuggestions: suggestions }));
      setLoadingTools(false); // Stop loader
    } catch (error) {
      console.error("Error fetching AI tool suggestions:", error);
      setLoadingTools(false);
    }
  };

  const handleSaveWorkflow = async () => {
    if (!authenticatedUser) {
      navigate("/login");
      return;
    }

    try {
      // Make API request.
      await axios.post(
        'http://localhost:1337/api/workflows',
        {
          title: workflow.title,
          category: workflow.category,
          description: workflow.description,
          nodes: workflow.nodes,
        },
        {
          headers: {
            Authorization: `Bearer ${authenticatedUser.token}`,
          }
        }
      );
      alert('Workflow saved successfully');
    } catch (error) {
      console.error("Error saving workflow:", error);
    }
  };

  return (
    <>
      <div className="container mx-auto p-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold mb-2">Workflow Builder</h1>
          <p className="text-gray-700">Create a custom workflow or use templates to automate your tasks with AI.</p>
        </div>

        {/* Workflow Metadata Section */}
        <div className="mb-6">
          <input
            className="block mb-2 p-2 w-full border"
            type="text"
            value={workflow.title}
            placeholder="Workflow Title"
            onChange={(e) => dispatch(setWorkflowMeta({ title: e.target.value }))}
          />
          <textarea
            className="block p-2 w-full border"
            value={workflow.description}
            placeholder="Workflow Description"
            onChange={(e) => dispatch(setWorkflowMeta({ description: e.target.value }))}
          />
        </div>

        {/* Node List */}
        <div>
          {workflow.nodes.map(node => (
            <div key={node.node_id} className="mb-6 p-4 border bg-white rounded-md shadow-md">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">Node: {node.title || 'Untitled Node'}</h2>
                <button onClick={() => handleDeleteNode(node.node_id)} className="text-red-500">Delete Node</button>
              </div>
              <input
                className="block mb-2 p-2 w-full border"
                type="text"
                placeholder="Node Title"
                value={node.title}
                onChange={(e) => handleInputChange(e, 'title')}
              />
              <textarea
                className="block p-2 w-full border"
                placeholder="Node Description"
                value={node.description}
                onChange={(e) => handleInputChange(e, 'description')}
              />
              <button
                className="mt-2 p-2 w-full bg-blue-500 text-white rounded"
                onClick={() => fetchAiToolSuggestions(node.node_id)}
              >
                {loadingTools ? 'Fetching AI Tools...' : 'Show How AI Can Help'}
              </button>

              {/* Suggested AI Tools Section */}
              {currentNode.nodeId === node.node_id && (
                <div className="mt-4">
                  {currentNode.aiToolSuggestions.length > 0 ? (
                    <ul>
                      {currentNode.aiToolSuggestions.map((tool) => (
                        <li key={tool.tool_id} className="p-2 border mb-2">
                          <h3 className="font-bold">{tool.name}</h3>
                          <p className="text-gray-600">{tool.description}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No AI tool suggestions yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Add Node Button */}
          <button
            className="mt-6 p-4 bg-green-500 text-white rounded"
            onClick={handleNodeCreation}
          >
            Add Node
          </button>
        </div>

        {/* Save Workflow Button */}
        <div className="mt-8">
          <button
            className="p-4 bg-blue-600 text-white font-bold rounded"
            onClick={handleSaveWorkflow}
          >
            Save Workflow
          </button>
        </div>
      </div>
    </>
  );
};

export default UV_WorkflowBuilder;