import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/dashboard/AppLayout';
import Home from '../pages/home/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import WorkspaceDetailPage from '../pages/workspace/WorkspaceDetail';
import WorkspacePage from '../pages/workspace/Workspace';

const Dashboard = () => <h1>Dashboard</h1>;
const Projects = () => <h1>Projects</h1>;
const Tasks = () => <h1>Tasks</h1>;

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/login', element: <Login /> },
  { path: '/register', element: <Register /> },

  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'projects', element: <Projects /> },
      { path: 'tasks', element: <Tasks /> },
      { path: 'workspaces', element: <WorkspacePage /> },
      { path: 'workspace/:id', element: <WorkspaceDetailPage /> },
    ],
  },
]);
