// src/components/task/TaskView.tsx
import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Typography,
  Select,
  Input,
  Button,
  Spin,
  message,
  Col,
  Row,
} from 'antd';
import { useMediaQuery } from 'react-responsive';
import api from '../../api/axiosService';

const { Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface Task {
  id: string;
  title: string;
  description: string;
  statusId: string;
  priority: string;
  assigneeId?: string;
  comments: { id: string; user: string; text: string }[];
}

interface Status {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

interface TaskViewProps {
  taskId: string;
  visible?: boolean; // for Drawer
  onClose?: () => void;
  status: any;
  workspaceId: string;
}

export const TaskView: React.FC<TaskViewProps> = ({
  taskId,
  visible,
  onClose,
  status,
  workspaceId,
}) => {
  const [task, setTask] = useState<Task | null>(null);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('');
  const [assigneeId, setAssigneeId] = useState<string | undefined>('');
  const isMobile = useMediaQuery({ maxWidth: 768 });

  const loadTask = async () => {
    try {
      setLoading(true);

      const taskRes = await api.get(`/task/${taskId}`);

      const usersRes = await api.get(`/workspacemember/${workspaceId}`);

      const mappedUsers = usersRes.data.data.map((m: any) => ({
        id: m.user.id,
        name: m.user.name,
      }));

      setTask(taskRes.data.data);
      setDescription(taskRes.data.data.description || '');
      setPriority(taskRes.data.data.priority || 'Medium');
      setAssigneeId(taskRes.data.data.assigneeId);

      setStatuses(status);
      setUsers(mappedUsers);
    } catch (err) {
      console.error(err);
      message.error('Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTask();
  }, [taskId]);

  const handleSave = async () => {
    if (!task) return;
    try {
      await api.put(`/task/${task.id}`, {
        description,
        priority,
        assigneeId,
      });
      message.success('Task updated!');
      loadTask();
    } catch (err) {
      console.error(err);
      message.error('Failed to update task');
    }
  };

  const TaskContent = () => (
    <div style={{ padding: isMobile ? 16 : 32 }}>
      <Row gutter={32}>
        {/* LEFT CONTENT */}
        <Col xs={24} md={16}>
          {/* TITLE */}
          <Input
            value={task?.title}
            bordered={false}
            style={{
              fontSize: 22,
              fontWeight: 600,
              padding: 0,
              marginBottom: 20,
            }}
            onChange={(e) =>
              setTask((prev) => prev && { ...prev, title: e.target.value })
            }
          />

          {/* DESCRIPTION */}
          <div style={{ marginBottom: 32 }}>
            <Text type='secondary' style={{ fontSize: 12 }}>
              DESCRIPTION
            </Text>

            <TextArea
              rows={5}
              value={description}
              placeholder='Add a description...'
              style={{ marginTop: 6 }}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* COMMENTS */}
          <div>
            <Text type='secondary' style={{ fontSize: 12 }}>
              COMMENTS
            </Text>

            <div style={{ marginTop: 10 }}>
              {task?.comments?.length ? (
                task.comments.map((c) => (
                  <div
                    key={c.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 6,
                      background: '#fafafa',
                      marginBottom: 8,
                    }}
                  >
                    <Text strong>{c.user}</Text>
                    <div style={{ marginTop: 2 }}>{c.text}</div>
                  </div>
                ))
              ) : (
                <Text type='secondary'>No comments yet</Text>
              )}
            </div>
          </div>
        </Col>

        {/* RIGHT SIDEBAR */}
        <Col xs={24} md={8}>
          <div
            style={{
              borderLeft: isMobile ? 'none' : '1px solid #f0f0f0',
              paddingLeft: isMobile ? 0 : 24,
            }}
          >
            {/* STATUS */}
            <div style={{ marginBottom: 20 }}>
              <Text type='secondary' style={{ fontSize: 12 }}>
                STATUS
              </Text>

              <Select
                value={task?.statusId}
                style={{ width: '100%', marginTop: 6 }}
                onChange={(value) =>
                  setTask((prev) => prev && { ...prev, statusId: value })
                }
              >
                {statuses.map((s) => (
                  <Option key={s.id} value={s.id}>
                    {s.name}
                  </Option>
                ))}
              </Select>
            </div>

            {/* PRIORITY */}
            <div style={{ marginBottom: 20 }}>
              <Text type='secondary' style={{ fontSize: 12 }}>
                PRIORITY
              </Text>

              <Select
                value={priority}
                style={{ width: '100%', marginTop: 6 }}
                onChange={setPriority}
              >
                <Option value='Low'>Low</Option>
                <Option value='Medium'>Medium</Option>
                <Option value='High'>High</Option>
              </Select>
            </div>

            {/* ASSIGNEE */}
            <div style={{ marginBottom: 24 }}>
              <Text type='secondary' style={{ fontSize: 12 }}>
                ASSIGNEE
              </Text>

              <Select
                value={assigneeId}
                allowClear
                style={{ width: '100%', marginTop: 6 }}
                onChange={setAssigneeId}
              >
                {users.map((u) => (
                  <Option key={u.id} value={u.id}>
                    {u.name}
                  </Option>
                ))}
              </Select>
            </div>

            <Button type='primary' block size='large' onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );

  if (loading) return <Spin />;

  return isMobile ? (
    <div style={{ padding: 16 }}>
      <TaskContent />
    </div>
  ) : (
    <Drawer
      open={visible}
      title={task?.title}
      width={750}
      onClose={onClose}
      bodyStyle={{ padding: 0 }}
    >
      <TaskContent />
    </Drawer>
  );
};
