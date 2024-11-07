import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, resetFilters } from '@/store/main';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { RootState } from '@/store/main';

const UV_AIToolsDirectory: React.FC = () => {
  const dispatch = useDispatch();
  
  // Access global filters from Redux store
  const { pricing, tags, ease_of_use, search_text } = useSelector((state: RootState) => state.ai_tool_filters);

  // Local state for managing tools, pagination, and loading state
  const [aiToolsList, setAiToolsList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  
  // Local state for search input
  const [searchText, setSearchText] = useState<string>(search_text || '');

  // API call to fetch AI tools based on filters
  const fetchAITools = async (additionalPage: number = 1) => {
    setLoading(true);

    // Construct query params based on filters
    const params = {
      pricing: pricing || '',
      tags: tags || '',
      easeOfUse: ease_of_use || '',
      searchText: searchText || '',
      page: additionalPage,
    };

    try {
      const response = await axios.get('http://localhost:1337/api/ai_tools', { params });
      if (additionalPage === 1) {
        setAiToolsList(response.data);  // On first page load, replace list
      } else {
        setAiToolsList((prev) => [...prev, ...response.data]);  // For pagination, append to existing list
      }
    } catch (error) {
      console.error('Error fetching AI tools', error);
    } finally {
      setLoading(false);
    }
  };

  // Effect to load tools on component mount or when filters change
  useEffect(() => {
    fetchAITools(1);  // Reset to page 1 on every filter/search change
    setPage(1);
  }, [pricing, tags, ease_of_use, searchText]);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters({ search_text: searchText }));
  };

  // Load more tools (pagination on button click)
  const handleLoadMore = async () => {
    const nextPage = page + 1;
    await fetchAITools(nextPage);
    setPage(nextPage);
  };

  return (
    <>
      <div className="px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">AI Tools Directory</h1>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border rounded px-4 py-2 w-full mb-2"
            placeholder="Search AI tools by name, task or capability..."
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
        </form>

        {/* Filters Section */}
        <div className="flex gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium">Pricing</label>
            <select
              value={pricing}
              onChange={(e) => dispatch(setFilters({ pricing: e.target.value }))}
              className="border rounded px-2 py-1"
            >
              <option value="">All</option>
              <option value="Free">Free</option>
              <option value="Paid">Paid</option>
              <option value="Free Plan">Free Plan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Ease of Use</label>
            <select
              value={ease_of_use}
              onChange={(e) => dispatch(setFilters({ ease_of_use: e.target.value }))}
              className="border rounded px-2 py-1"
            >
              <option value="">All</option>
              <option value="Beginner">Beginner</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => dispatch(setFilters({ tags: e.target.value }))}
              placeholder="e.g., content creation"
              className="border rounded px-2 py-1"
            />
          </div>
        </div>

        {/* Cards for AI Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiToolsList.map((tool) => (
            <div key={tool.tool_id} className="border rounded-lg p-4">
              <h2 className="text-lg font-bold">{tool.name}</h2>
              <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
              <p className="text-sm font-bold">Pricing: {tool.pricing}</p>
              <p className="text-sm">Capabilities: {tool.capabilities}</p>
              <p className="text-sm mb-2">Ease of Use: {tool.ease_of_use}</p>
              <Link to={`/ai-tools/${tool.tool_id}`} className="text-blue-600">See More</Link>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {!loading && (
          <div className="my-8 text-center">
            <button
              onClick={handleLoadMore}
              className="bg-gray-800 text-white px-4 py-2 rounded"
            >
              Show More Tools
            </button>
          </div>
        )}

        {loading && <p className="text-center">Loading...</p>}
      </div>
    </>
  );
};

export default UV_AIToolsDirectory;