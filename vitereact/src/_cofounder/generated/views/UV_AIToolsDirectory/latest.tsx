import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters, resetFilters } from '@/store/main';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { RootState } from '@/store/main';

const UV_AIToolsDirectory: React.FC = () => {
  const dispatch = useDispatch();
  
  const { pricing, tags, ease_of_use, search_text } = useSelector((state: RootState) => state.ai_tool_filters);

  const [aiToolsList, setAiToolsList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>(search_text || '');

  const fetchAITools = async (additionalPage: number = 1) => {
    setLoading(true);
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
        setAiToolsList(response.data);
      } else {
        setAiToolsList((prev) => [...prev, ...response.data]);
      }
    } catch (error) {
      console.error('Error fetching AI tools', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAITools(1);
    setPage(1);
  }, [pricing, tags, ease_of_use, searchText]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setFilters({ search_text: searchText }));
  };

  const handleFilterReset = () => {
    dispatch(resetFilters());
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    await fetchAITools(nextPage);
    setPage(nextPage);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto p-6">
        {/* Search Section */}
        <form onSubmit={handleSearchSubmit} className="flex items-center justify-center w-full mb-6">
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border-2 border-gray-300 px-6 py-3 w-full max-w-6xl rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Search AI tools by name, task or capability..."
          />
          <Button type="submit" className="ml-4">Search</Button>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-6 relative w-full mb-8">
          {/* Left Sidebar - Filters */}
          <div className="p-6 shadow-lg rounded-md border bg-white space-y-6">
            {/* Pricing Filter */}
            <div>
              <h2 className="font-semibold text-lg">Pricing</h2>
              <div className="space-y-2">
                <Checkbox 
                  checked={pricing === 'Free'} 
                  onCheckedChange={() => dispatch(setFilters({ pricing: 'Free' }))} 
                  id="pricing-free" 
                />
                <label htmlFor="pricing-free" className="ml-2 text-sm">Free</label>
                <Checkbox 
                  checked={pricing === 'Paid'} 
                  onCheckedChange={() => dispatch(setFilters({ pricing: 'Paid' }))} 
                  id="pricing-paid" 
                />
                <label htmlFor="pricing-paid" className="ml-2 text-sm">Paid</label>
              </div>
            </div>

            {/* Ease of Use Filter */}
            <div>
              <h2 className="font-semibold text-lg">Ease of Use</h2>
              <div className="space-y-2">
                <Checkbox 
                  checked={ease_of_use === 'Beginner'} 
                  onCheckedChange={() => dispatch(setFilters({ ease_of_use: 'Beginner' }))} 
                  id="ease-beginner" 
                />
                <label htmlFor="ease-beginner" className="ml-2 text-sm">Beginner</label>
                <Checkbox 
                  checked={ease_of_use === 'Advanced'} 
                  onCheckedChange={() => dispatch(setFilters({ ease_of_use: 'Advanced' }))} 
                  id="ease-advanced" 
                />
                <label htmlFor="ease-advanced" className="ml-2 text-sm">Advanced</label>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h2 className="font-semibold text-lg">Tags</h2>
              <input
                type="text"
                value={tags}
                onChange={(e) => dispatch(setFilters({ tags: e.target.value }))}
                placeholder="Content creation, etc."
                className="border border-gray-300 px-4 py-2 rounded-md w-full"
              />
            </div>
            <Button onClick={handleFilterReset} variant="outline">Clear Filters</Button>
          </div>

          {/* AI Tools Grid */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiToolsList.map((tool) => (
                <div key={tool.tool_id} className="border rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow bg-white">
                  <h2 className="text-lg font-bold mb-2">{tool.name}</h2>
                  <p className="text-gray-600 mb-4">{tool.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="outline">{tool.pricing}</Badge>
                    <Badge variant="outline">{tool.capabilities}</Badge>
                  </div>

                  <Link 
                    to={`/ai-tools/${tool.tool_id}`} 
                    className="text-blue-600 hover:underline"
                  >See More</Link>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {!loading && (
              <div className="my-8 text-center">
                <Button onClick={handleLoadMore}>Show More Tools</Button>
              </div>
            )}
            {loading && <p className="text-center">Loading...</p>}
          </div>
        </div>
      </div>
    </>
  );
};

export default UV_AIToolsDirectory;