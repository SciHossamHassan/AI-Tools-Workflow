import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { RootState } from '@/store/main';  
import { setFilters, resetFilters, logout } from '@/store/main';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const GV_TopNav: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const authenticatedUser = useSelector((state: RootState) => state.authenticated_user);
  const [searchInput, setSearchInput] = useState("");

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const triggerSearch = () => {
    dispatch(setFilters({ search_text: searchInput }));
    navigate(`/ai-tools?searchText=${encodeURIComponent(searchInput)}`);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          
          {/* Logo/Home Button */}
          <Link to="/" className="text-xl font-bold text-gray-800">
            <img src="https://picsum.photos/100/40" alt="Top A.I. Tools Hub" className="h-10 w-auto" />
          </Link>
          
          {/* Search Bar */}
          <div className="hidden md:flex items-center w-2/5">
            <div className="relative flex w-full">
              <Input
                type="text"
                value={searchInput}
                onChange={handleSearchInput}
                placeholder="Search AI tools..."
                className="px-4 py-2 rounded-lg w-full border border-gray-300"
              />
              <Button
                onClick={triggerSearch}
                variant="outline"
                size="icon"
                className="absolute right-2 top-2 hover:bg-gray-100"
              >
                <Search className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>

          {/* Navigation & Auth */}
          <div className="flex items-center space-x-4">
            {/* Navigation Links */}
            <Link to="/" className="hidden md:inline-block font-medium text-gray-700 hover:text-gray-900">
              Home
            </Link>
            <Link to="/ai-tools" className="hidden md:inline-block font-medium text-gray-700 hover:text-gray-900">
              Discover AI Tools
            </Link>
            <Link to="/workflows" className="hidden md:inline-block font-medium text-gray-700 hover:text-gray-900">
              Workflow Builder
            </Link>
            {authenticatedUser ? (
              <>
                <Link to="/workflows/saved" className="hidden md:inline-block font-medium text-gray-700 hover:text-gray-900">
                  Saved Workflows
                </Link>

                {/* Authenticated User's Profile */}
                <div className="relative">
                  <Avatar>
                    <AvatarImage
                      src="https://picsum.photos/40/40"
                      alt={authenticatedUser.first_name || 'User'}
                    />
                    <AvatarFallback>{authenticatedUser.first_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="absolute mt-2 right-0 bg-white shadow-md rounded-lg py-2 px-4 w-48 text-gray-800">
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
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default GV_TopNav;