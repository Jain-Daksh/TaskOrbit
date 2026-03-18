import { useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Spin,
  Space,
  Tabs,
  Table,
  App,
  Modal,
  Input,
} from 'antd';
import { PlusOutlined, TeamOutlined, EditOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosService';
import './WorkspaceDetailPage.css';
import { StatusManager } from '../../components/status/status';
import { WorkspaceMembersTable } from '../../components/workspacemember/viewMemberList';
import { AddMemberModal } from '../../components/workspacemember/addMemberModel';
import { useAuthStore } from '../../store/authStore';

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
  isDefault: boolean;
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
  const [addMemberVisible, setAddMemberVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [saving, setSaving] = useState(false);
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [creatingProject, setCreatingProject] = useState(false);
  const { user } = useAuthStore();

  const currentUserId = user.id;
  const currentUser = workspace?.members.find(
    (m) => m.user.id === currentUserId,
  );
  const isAdmin = currentUser?.role.name === 'Admin';
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

  const removeMember = async (memberId: string) => {
    try {
      await api.delete(`/workspacemember/${workspace?.id}/members/${memberId}`);
      setWorkspace((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          members: prev.members.filter((member) => member.id !== memberId),
        };
      });
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to remove member');
      throw err;
    }
  };

  const openEditModal = () => {
    setWorkspaceName(workspace?.name || '');
    setEditVisible(true);
  };

  const updateWorkspace = async () => {
    try {
      setSaving(true);

      await api.put(`/workspaces/${workspace?.id}`, {
        name: workspaceName,
      });

      setWorkspace((prev) => (prev ? { ...prev, name: workspaceName } : prev));

      message.success('Workspace updated successfully');
      setEditVisible(false);
    } catch (err: any) {
      message.error(
        err.response?.data?.message || 'Failed to update workspace',
      );
    } finally {
      setSaving(false);
    }
  };

  const createProject = async () => {
    if (!projectName.trim()) {
      message.warning('Project name is required');
      return;
    }

    try {
      setCreatingProject(true);

      const res = await api.post('/projects', {
        name: projectName,
        workspaceId: workspace?.id,
      });

      const newProject = res.data.data;

      setWorkspace((prev) =>
        prev
          ? {
            ...prev,
            projects: [...prev.projects, newProject],
          }
          : prev,
      );

      message.success('Project created successfully');

      setProjectModalVisible(false);
      setProjectName('');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setCreatingProject(false);
    }
  };

  // Callback after adding a member
  const handleMemberAdded = () => {
    fetchWorkspaceDetail(); // refresh members
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

  const projectColumns = [
    {
      title: 'Project Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Project) => (
        <Button
          type='link'
          onClick={() => navigate(`/app/projects/${id}/${record.id}`)}
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

  return (
    <div className='workspace-detail-page'>
      <div className='workspace-detail-header'>
        <div>
          <Title level={2}>{workspace.name}</Title>
          <Text type='secondary'>{workspace.members.length} members</Text>
        </div>

        <Space
          wrap
          size={[8, 8]} >
          {isAdmin && (
            <>
              <Button icon={<EditOutlined />} onClick={openEditModal}>
                Edit
              </Button>

              <Button
                icon={<TeamOutlined />}
                onClick={() => setAddMemberVisible(true)}
              >
                Add Member
              </Button>
            </>
          )}

          <Button
            type='primary'
            icon={<PlusOutlined />}
            onClick={() => setProjectModalVisible(true)}
          >
            New Project
          </Button>
        </Space>
      </div>

      {/* Add Member Modal */}
      <AddMemberModal
        workspaceId={workspace.id}
        visible={addMemberVisible}
        onClose={() => setAddMemberVisible(false)}
        onMemberAdded={handleMemberAdded}
      />

      <Modal
        title='Edit Workspace'
        open={editVisible}
        onCancel={() => setEditVisible(false)}
        onOk={updateWorkspace}
        confirmLoading={saving}
      >
        <Input
          value={workspaceName}
          onChange={(e) => setWorkspaceName(e.target.value)}
          placeholder='Workspace name'
        />
      </Modal>

      <Modal
        title='Create Project'
        open={projectModalVisible}
        onCancel={() => setProjectModalVisible(false)}
        onOk={createProject}
        confirmLoading={creatingProject}
      >
        <Input
          placeholder='Project name'
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />
      </Modal>

      {/* TABS */}
      <Tabs defaultActiveKey='members' style={{ marginTop: 24 }}>
        <TabPane tab={`Members (${workspace.members.length})`} key='members'>
          <WorkspaceMembersTable
            isAdmin={isAdmin}
            members={workspace.members}
            onRemoveMember={removeMember}
            userId={currentUserId}
          />
        </TabPane>

        <TabPane tab={`Projects (${workspace.projects.length})`} key='projects'>
          {workspace.projects.length === 0 ? (
            <Text type='secondary'>
              No projects yet. Create one to get started!
            </Text>
          ) : (
            <Table
              scroll={{ x: 'max-content' }}

              dataSource={workspace.projects}
              columns={projectColumns}
              rowKey='id'
              pagination={false}
            />
          )}
        </TabPane>

        <TabPane tab={`Status (${workspace.statuses.length})`} key='statuses'>
          <StatusManager
            isAdmin={isAdmin}
            statuses={workspace.statuses}
            workspaceId={workspace.id}
          />
        </TabPane>
      </Tabs>
    </div>
  );
}
