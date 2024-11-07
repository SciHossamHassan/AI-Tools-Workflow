import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { RootState } from '@/store/main';  // Global state access.
import { setFilters, resetFilters } from '@/store/main';  // AI tools search filters.
import { logout } from '@/store/main';  // Logout action.

// React Functional Component
const GV_TopNav: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Access authenticated user state
  const authenticatedUser = useSelector((state: RootState) => state.authenticated_user);
  
  // Local state for search input
  const [searchInput, setSearchInput] = useState("");

  // Handle search input change
  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  // Trigger search and update global AI tool filters state
  const triggerSearch = () => {
    dispatch(setFilters({ search_text: searchInput }));
    navigate(`/ai-tools?searchText=${encodeURIComponent(searchInput)}`);
  };

  // Logout handler
  const handleLogout = () => {
    // Call logout action from redux store
    dispatch(logout());
    // Navigate to landing page after logout
    navigate('/');
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo/Home Button */}
          <Link to="/" className="text-2xl font-bold">Top A.I. Tools Hub</Link>

          {/* Search Bar */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={searchInput}
              onChange={handleSearchInput}
              placeholder="Search AI tools..."
              className="rounded px-2 py-1 text-black"
            />
            <button
              onClick={triggerSearch}
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          {/* Navigation & Auth */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <Link to="/" className="hover:text-gray-300">Home</Link>
            <Link to="/ai-tools" className="hover:text-gray-300">Discover AI Tools</Link>
            <Link to="/workflows" className="hover:text-gray-300">Workflow Builder</Link>
            {
              authenticatedUser ? (
                <>
                  <Link to="/workflows/saved" className="hover:text-gray-300">Saved Workflows</Link>
                  {/* Dropdown for authenticated users */}
                  <div className="relative">
                    <button className="hover:text-gray-300 focus:outline-none">
                      {authenticatedUser.first_name || 'Profile'}
                    </button>
                    <div className="absolute mt-2 right-0 bg-white text-black shadow-lg rounded py-2 px-4">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left hover:bg-gray-100 px-2 py-1 rounded"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                // Login button for unauthenticated users
                <Link to="/login" className="hover:text-gray-300">Login</Link>
              )
            }
          </div>

        </div>
      </nav>
    </>
  );
};

export default GV_TopNav;