import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/dashboard/AppLayout';
import Home from '../pages/home/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import WorkspaceDetailPage from '../pages/workspace/WorkspaceDetail';
import WorkspacePage from '../pages/workspace/Workspace';
import MyProfilePage from '../pages/profile/profile';
import ProjectDetailPage from '../pages/project/projectpage';
import VerifyOtp from '../pages/auth/VerifyOtp';
import ForgotPassword from '../pages/auth/ForgotPassword';
import VerifySignupOtp from '../pages/auth/VerifySignupOtp';
import ProtectedRoute from './ProtectedRoute';
import DashboardPage from '../pages/Dashboard/Dashboard';

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/verify-otp', element: <VerifyOtp /> },
  { path: '/verify-signup-otp', element: <VerifySignupOtp /> },

  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <DashboardPage /> },
          { path: 'workspaces', element: <WorkspacePage /> },
          { path: 'workspace/:id', element: <WorkspaceDetailPage /> },
          { path: 'profile', element: <MyProfilePage /> },
          {
            path: 'projects/:workspaceId/:projectId',
            element: <ProjectDetailPage />,
          },
        ],
      },
    ],
  },
]);
