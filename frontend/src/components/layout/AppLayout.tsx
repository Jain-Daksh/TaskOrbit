import { Layout } from 'antd';
import Sidebar from './Sidebar';
import HeaderBar from './HeaderBar';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

export default function AppLayout() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar />

      <Layout>
        <HeaderBar />

        <Content style={{ padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
