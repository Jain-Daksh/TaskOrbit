import { Layout, Avatar, Dropdown, Badge, Typography } from 'antd';
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  ProfileOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../../store/authStore';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;
const { Text } = Typography;
// const { Search } = Input;

export default function HeaderBar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const items = [
    {
      key: 'profile',
      icon: <ProfileOutlined />,
      label: 'Profile',
      onClick: () => navigate('/app/profile'),
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];
  // const menu = (
  //   <Menu>
  //     <Menu.Item
  //       key='profile'
  //       icon={<ProfileOutlined />}
  //       onClick={() => navigate('/profile')}
  //     >
  //       Profile
  //     </Menu.Item>
  //     <Menu.Item key='logout' icon={<LogoutOutlined />} onClick={handleLogout}>
  //       Logout
  //     </Menu.Item>
  //   </Menu>
  // );

  return (
    <Header
      style={{
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Left side: Logo and name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img
          src='/workspace.png'
          alt='Logo'
          style={{ width: 36, height: 36 }}
        />
        <Text strong style={{ fontSize: 18 }}>
          Workspace
        </Text>
      </div>

      {/* Middle: Search (optional) */}
      {/* <div style={{ flex: 1, marginLeft: 24, marginRight: 24 }}>
        <Search placeholder='Search issues...' allowClear enterButton />
      </div> */}

      {/* Right side: Notifications + User profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {/* Notifications */}
        <Badge dot>
          <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
        </Badge>

        {/* User profile dropdown */}
        {user ? (
          <Dropdown
            menu={{ items }}
            placement='bottomRight'
            trigger={['click']}
          >
            <div
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Avatar size='large' icon={<UserOutlined />} />
              <Text>{user.name}</Text>
            </div>
          </Dropdown>
        ) : (
          <Text
            style={{ cursor: 'pointer', fontWeight: 500 }}
            onClick={() => navigate('/login')}
          >
            Login
          </Text>
        )}
      </div>
    </Header>
  );
}
