import React from "react";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/main';  // For accessing global state.
import {
	Route,
	Routes,
	Navigate,
} from "react-router-dom";

/* Import views: unique views (UV_*) and shared global views (GV_*) */
import GV_TopNav from '@/components/views/GV_TopNav.tsx';
import GV_Footer from '@/components/views/GV_Footer.tsx';
import UV_Landing from '@/components/views/UV_Landing.tsx';
import UV_AIToolsDirectory from '@/components/views/UV_AIToolsDirectory.tsx';
import UV_WorkflowBuilder from '@/components/views/UV_WorkflowBuilder.tsx';
import UV_ToolDetails from '@/components/views/UV_ToolDetails.tsx';
import UV_SavedWorkflows from '@/components/views/UV_SavedWorkflows.tsx';
import UV_Login from '@/components/views/UV_Login.tsx';

const App: React.FC = () => {
  // Access the authenticated_user slice from Redux store.
  const authenticatedUser = useSelector((state: RootState) => state.authenticated_user);

  // Helper function to handle protected routes.
  const ProtectedRoute = ({ element }: { element: JSX.Element }): JSX.Element => {
    if (!authenticatedUser) {
      return <Navigate to="/login" />;
    }
    return element;
  };

  return (
    <>
      {/* Global Top Navigation (sticky header) */}
      <GV_TopNav />

      {/* Main App Routes */}
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<UV_Landing />} />

        {/* AI Tools Directory with optional search filters using URLParams */}
        <Route path="/ai-tools" element={<UV_AIToolsDirectory />} />

        {/* AI Tool Detail View by tool_id */}
        <Route path="/ai-tools/:tool_id" element={<UV_ToolDetails />} />

        {/* Workflow Builder - Protected (Auth Required) */}
        <Route path="/workflows" element={<ProtectedRoute element={<UV_WorkflowBuilder />} />} />

        {/* Saved Workflows Management - Protected (Auth Required) */}
        <Route path="/workflows/saved" element={<ProtectedRoute element={<UV_SavedWorkflows />} />} />

        {/* User Login Page */}
        <Route path="/login" element={<UV_Login />} />
      </Routes>

      {/* Global Footer (fixed at the bottom) */}
      <GV_Footer />
    </>
  );
};

export default App;