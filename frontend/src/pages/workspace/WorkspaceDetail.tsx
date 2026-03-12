import { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Spin,
  Space,
  Tabs,
  Table,
  App,
} from 'antd';
import { PlusOutlined, TeamOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosService';
import './WorkspaceDetailPage.css';
import { StatusManager } from '../../components/status/status';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface Member {
  id: string;
  userId: string;
  workspaceId: string;
  roleId: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: {
    id: string;
    name: string;
  };
}

interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface Statuses {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
}

interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  members: Member[];
  projects: Project[];
  statuses: Statuses[];
}

export default function WorkspaceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchWorkspaceDetail = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/workspaces/${id}`);
      const data = res.data.data;

      setWorkspace({
        ...data,
        members: data.members || [],
        projects: data.projects || [],
      });
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to load workspace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchWorkspaceDetail();
  }, [id]);

  if (loading || !workspace) {
    return (
      <div className='workspace-detail-page-loading'>
        <Spin size='large' />
      </div>
    );
  }

  // Columns for Members Table
  const memberColumns = [
    {
      title: 'Name',
      dataIndex: ['user', 'name'],
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: ['role', 'name'],
      key: 'role',
    },
    {
      title: 'Joined At',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  // Columns for Projects Table
  const projectColumns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Project) => (
        <Button
          type='link'
          onClick={() => navigate(`/app/projects/${record.id}`)}
        >
          {name}
        </Button>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const statusColumns = [
    {
      title: 'Status Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Is Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (active ? 'Yes' : 'No'),
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
    },
  ];

  return (
    <div className='workspace-detail-page'>
      {/* HEADER */}
      <div className='workspace-detail-header'>
        <div>
          <Title level={2}>{workspace.name}</Title>
          <Text type='secondary'>{workspace.members.length} members</Text>
        </div>

        <Space>
          <Button
            icon={<TeamOutlined />}
            onClick={() => message.info('Manage members modal coming soon')}
          >
            Members
          </Button>

          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => message.info('Create project modal here')}
          >
            New Project
          </Button>
        </Space>
      </div>

      {/* TABS: Members / Projects */}
      <Tabs defaultActiveKey='members' style={{ marginTop: 24 }}>
        <TabPane tab={`Members (${workspace.members.length})`} key='members'>
          <Table
            dataSource={workspace.members}
            columns={memberColumns}
            rowKey='id'
            pagination={false}
          />
        </TabPane>

        <TabPane tab={`Projects (${workspace.projects.length})`} key='projects'>
          {workspace.projects.length === 0 ? (
            <Text type='secondary'>
              No projects yet. Create one to get started!
            </Text>
          ) : (
            <Table
              dataSource={workspace.projects}
              columns={projectColumns}
              rowKey='id'
              pagination={false}
            />
          )}
        </TabPane>
        <TabPane tab={`Status (${workspace.statuses.length})`} key='statuses'>
          {workspace.statuses.length === 0 ? (
            <Text type='secondary'>
              No Status yet. Create one to get started!
            </Text>
          ) : (
            <StatusManager
              statuses={workspace.statuses}
              workspaceId={workspace.id}
            />
          )}
        </TabPane>
      </Tabs>
    </div>
  );
}
