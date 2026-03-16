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

const Dashboard = () => <h1>Dashboard</h1>;
const Projects = () => <h1>Projects</h1>;
const Tasks = () => <h1>Tasks</h1>;

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/verify-otp', element: <VerifyOtp /> },
  { path: '/verify-signup-otp', element: <VerifySignupOtp /> },



  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'projects', element: <Projects /> },
      { path: 'tasks', element: <Tasks /> },
      { path: 'workspaces', element: <WorkspacePage /> },
      { path: 'workspace/:id', element: <WorkspaceDetailPage /> },
      { path: 'profile', element: <MyProfilePage /> },
      {
        path: 'projects/:workspaceId/:projectId',
        element: <ProjectDetailPage />,
      },
    ],
  },
]);
