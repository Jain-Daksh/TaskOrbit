import { Layout, Avatar } from 'antd';

const { Header } = Layout;

export default function HeaderBar() {
  return (
    <Header
      style={{
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 20px',
      }}
    >
      <h3>Workspace</h3>

      <Avatar>U</Avatar>
    </Header>
  );
}
