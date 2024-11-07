import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, addNode, removeNode, setWorkflowMeta, resetWorkflow } from '@/store/main';
import { Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'; // For generating random node ids.
import { ChevronRight, Loader2, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const UV_WorkflowBuilder: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const workflow = useSelector((state: RootState) => state.workflow_in_progress);
  const authenticatedUser = useSelector((state: RootState) => state.authenticated_user);

  const [currentNode, setCurrentNode] = useState({ nodeId: '', title: '', description: '', aiToolSuggestions: [] });
  const [loadingTools, setLoadingTools] = useState(false);

  const handleNodeCreation = () => {
    const newNode = {
      node_id: uuidv4(), 
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
      setLoadingTools(true); 

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
      setLoadingTools(false); 
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
        {/* Top bar with title and action buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Workflow Builder</h1>
          <div className="flex space-x-4">
            <Button variant="outline">Simulate Workflow</Button>
            <Button variant="default" onClick={handleSaveWorkflow}>
              <ChevronRight className="mr-2 h-4 w-4" /> Save Workflow
            </Button>
          </div>
        </div>

        {/* Workflow Metadata */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Workflow Title"
            value={workflow.title}
            className="w-full mb-4"
            onChange={(e) => dispatch(setWorkflowMeta({ title: e.target.value }))}
          />
          <Textarea
            placeholder="Workflow Description"
            value={workflow.description}
            className="w-full"
            onChange={(e) => dispatch(setWorkflowMeta({ description: e.target.value }))}
          />
        </div>

        {/* Node List */}
        <div className="grid gap-6">
          {workflow.nodes.map((node) => (
            <div key={node.node_id} className="p-4 border rounded-lg shadow-sm bg-white relative">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">{node.title || 'Untitled Node'}</h2>
                <Trash2
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDeleteNode(node.node_id)}
                />
              </div>

              <Input
                type="text"
                placeholder="Node Title"
                className="mt-2"
                value={node.title}
                onChange={(e) => handleInputChange(e, 'title')}
              />
              <Textarea
                placeholder="Node Description"
                className="mt-2"
                value={node.description}
                onChange={(e) => handleInputChange(e, 'description')}
              />

              <Button
                variant="default"
                className="mt-4"
                onClick={() => fetchAiToolSuggestions(node.node_id)}
              >
                {loadingTools ? 
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
                  'Show How AI Can Help'}
              </Button>

              {/* AI Tool Suggestions */}
              {currentNode.nodeId === node.node_id && (
                <div className="mt-4">
                  {currentNode.aiToolSuggestions.length > 0 ? (
                    <ul>
                      {currentNode.aiToolSuggestions.map(tool => (
                        <li key={tool.tool_id} className="mb-2 p-4 border rounded-md shadow-sm bg-gray-50">
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
        </div>

        {/* Floating Add Node Button */}
        <div className="fixed bottom-10 right-10">
          <Button
            variant="default"
            size="icon"
            onClick={handleNodeCreation}
          >
            <ChevronRight className="h-5 w-5" />
            Add Node
          </Button>
        </div>
      </div>
    </>
  );
};

export default UV_WorkflowBuilder;