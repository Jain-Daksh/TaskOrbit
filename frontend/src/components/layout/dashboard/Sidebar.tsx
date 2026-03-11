import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

const { Sider } = Layout;

export default function Sidebar() {
  const { user } = useAuthStore();

  return (
    <Sider theme='dark'>
      <div style={{ color: 'white', padding: 16, fontWeight: 'bold' }}>
        Task Manager
      </div>
      hi {user?.name}
      <Menu
        theme='dark'
        mode='inline'
        items={[
          {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: <Link to='/'>Dashboard</Link>,
          },
          {
            key: 'projects',
            icon: <ProjectOutlined />,
            label: <Link to='/projects'>Projects</Link>,
          },
          {
            key: 'tasks',
            icon: <CheckSquareOutlined />,
            label: <Link to='/tasks'>Tasks</Link>,
          },
        ]}
      />
    </Sider>
  );
}
