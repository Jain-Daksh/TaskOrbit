import { Layout, Menu, Drawer, Button } from 'antd';
import {
  DashboardOutlined,
  ProjectOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const { Sider } = Layout;

export default function Sidebar() {
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const [collapsed, setCollapsed] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to='/app'>Dashboard</Link>,
    },
    {
      key: 'workspace',
      icon: <ProjectOutlined />,
      label: <Link to='/app/workspaces'>Workspaces</Link>,
    },
  ];

  if (isMobile) {
    return (
      <>
        <Button
          type='text'
          icon={<MenuOutlined />}
          onClick={() => setOpenMobile(true)}
          style={{ fontSize: 20 }}
        />

        <Drawer
          placement='left'
          open={openMobile}
          onClose={() => setOpenMobile(false)}
          bodyStyle={{ padding: 0 }}
        >
          <Menu mode='inline' items={menuItems} />
        </Drawer>
      </>
    );
  }

  // 💻 DESKTOP
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      theme='dark'
    >
      <div
        style={{
          color: 'white',
          padding: 16,
          fontWeight: 'bold',
          textAlign: collapsed ? 'center' : 'left',
        }}
      >
        {collapsed ? 'TM' : 'Task Manager'}
      </div>

      <Menu theme='dark' mode='inline' items={menuItems} />
    </Sider>
  );
}
