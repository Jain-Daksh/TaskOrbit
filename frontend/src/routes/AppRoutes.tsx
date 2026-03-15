import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/dashboard/AppLayout';
import Home from '../pages/home/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import WorkspaceDetailPage from '../pages/workspace/WorkspaceDetail';
import WorkspacePage from '../pages/workspace/Workspace';
import MyProfilePage from '../pages/profile/profile';
import ProjectDetailPage from '../pages/project/projectpage';
import ProtectedRoute from './ProtectedRoute';

const Dashboard = () => <h1>Dashboard</h1>;

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },

  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Dashboard /> },
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
