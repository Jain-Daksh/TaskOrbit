import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Home from '../pages/home/Home';

const Dashboard = () => <h1>Dashboard</h1>;
const Projects = () => <h1>Projects</h1>;
const Tasks = () => <h1>Tasks</h1>;

export const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'projects', element: <Projects /> },
      { path: 'tasks', element: <Tasks /> },
    ],
  },
]);
