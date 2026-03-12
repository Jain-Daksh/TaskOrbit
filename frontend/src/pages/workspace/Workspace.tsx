import { useEffect, useState } from 'react';
import {
  Card,
  Row,
  Col,
  Button,
  Input,
  Typography,
  message,
  Modal,
  Table,
  Space,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  AppstoreOutlined,
  TableOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import api from '../../api/axiosService';
import './workspace.css';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

interface Workspace {
  id: string;
  name: string;
  totalMembers: number;
  createdAt: string;
  updatedAt: string;
}

export default function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const navigate = useNavigate();

  // Fetch workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      setLoading(true);
      try {
        const res = await api.get('/workspaces');
        const data = res.data.data.map((ws: any) => ({
          ...ws,
          totalMembers: ws.totalMembers ?? ws.members?.length ?? 0,
        }));
        setWorkspaces(data);
      } catch (err: any) {
        message.error(
          err.response?.data?.message || 'Failed to load workspaces',
        );
      } finally {
        setLoading(false);
      }
    };
    fetchWorkspaces();
  }, []);

  const createWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;
    try {
      const res = await api.post('/workspaces', { name: newWorkspaceName });
      const newWs = {
        ...res.data.data,
        totalMembers: res.data.data.totalMembers ?? 1,
      };
      setWorkspaces((prev) => [...prev, newWs]);
      setModalVisible(false);
      setNewWorkspaceName('');
      message.success('Workspace created!');
    } catch (err: any) {
      message.error(
        err.response?.data?.message || 'Failed to create workspace',
      );
    }
  };

  const deleteWorkspace = async (id: string) => {
    try {
      await api.delete(`/workspaces/${id}`);
      setWorkspaces((prev) => prev.filter((ws) => ws.id !== id));
      message.success('Workspace deleted!');
    } catch (err: any) {
      message.error(
        err.response?.data?.message || 'Failed to delete workspace',
      );
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Workspace Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Members',
      dataIndex: 'totalMembers',
      key: 'totalMembers',
      render: (count: number) => <Text type='secondary'>{count}</Text>,
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => (
        <Text>{new Date(date).toLocaleDateString()}</Text>
      ),
    },
    {
      title: 'Updated At',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date: string) => (
        <Text>{new Date(date).toLocaleDateString()}</Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Workspace) => (
        <Space size='middle'>
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`app/workspace/${record.id}`)}
          >
            View
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`app/workspace/${record.id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title='Are you sure to delete?'
            onConfirm={() => deleteWorkspace(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className='workspace-page'>
      <div className='workspace-header'>
        <Title level={2}>Your Workspaces</Title>
        <Space>
          <Button
            type='default'
            icon={
              viewMode === 'grid' ? <TableOutlined /> : <AppstoreOutlined />
            }
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
          >
            {viewMode === 'grid' ? 'Table View' : 'Grid View'}
          </Button>
          <Button
            type='primary'
            icon={<PlusOutlined />}
            loading={loading}
            onClick={() => setModalVisible(true)}
          >
            Create Workspace
          </Button>
        </Space>
      </div>

      {workspaces.length === 0 ? (
        <Text type='secondary'>
          No workspaces yet. Create one to get started!
        </Text>
      ) : viewMode === 'grid' ? (
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {workspaces.map((ws) => (
            <Col xs={24} sm={12} md={8} lg={6} key={ws.id}>
              <Card
                hoverable
                className='workspace-card'
                style={{ borderRadius: 12 }}
              >
                <Title level={4}>{ws.name}</Title>
                <Text type='secondary'>{ws.totalMembers} members</Text>
                <div style={{ marginTop: 12 }}>
                  <Text type='secondary' style={{ display: 'block' }}>
                    Created: {new Date(ws.createdAt).toLocaleDateString()}
                  </Text>
                  <Text type='secondary' style={{ display: 'block' }}>
                    Updated: {new Date(ws.updatedAt).toLocaleDateString()}
                  </Text>
                </div>
                <Space style={{ marginTop: 12 }}>
                  <Button
                    size='small'
                    icon={<EyeOutlined />}
                    onClick={() => navigate(`app/workspace/${ws.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    size='small'
                    icon={<EditOutlined />}
                    onClick={() => navigate(`app/workspace/${ws.id}`)}
                  >
                    Edit
                  </Button>
                  <Popconfirm
                    title='Are you sure to delete?'
                    onConfirm={() => deleteWorkspace(ws.id)}
                    okText='Yes'
                    cancelText='No'
                  >
                    <Button size='small' danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Table
          dataSource={workspaces}
          columns={columns}
          rowKey='id'
          pagination={{ pageSize: 5 }}
          style={{ marginTop: 16 }}
        />
      )}

      <Modal
        title='Create Workspace'
        open={modalVisible}
        onOk={createWorkspace}
        onCancel={() => setModalVisible(false)}
        okText='Create'
      >
        <Input
          placeholder='Workspace Name'
          value={newWorkspaceName}
          onChange={(e) => setNewWorkspaceName(e.target.value)}
        />
      </Modal>
    </div>
  );
}
