import { useEffect, useState } from 'react';
import { Spin, Typography, message } from 'antd';
import api from '../../api/axiosService';
import { useParams } from 'react-router-dom';
import { KanbanBoard } from '../../components/kanban/KanbanBoard';

const { Title } = Typography;

export default function ProjectDetailPage() {
  const { workspaceId, projectId } = useParams();

  const [statuses, setStatuses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBoard = async () => {
    try {
      setLoading(true);

      const [statusRes, projectRes] = await Promise.all([
        api.get(`/status/${workspaceId}`),
        api.get(`/projects/workspace/${workspaceId}/${projectId}`),
      ]);

      setStatuses(statusRes.data.data);
      setTasks(projectRes.data.data.tasks || []);
    } catch (err) {
      console.error(err);
      message.error('Failed to load board');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoard();
  }, [workspaceId, projectId]);

  const handleAddTask = async (statusId: string, title: string) => {
    try {
      await api.post('/task', {
        title,
        statusId,
        projectId,
      });
      message.success('Task created!');
      loadBoard(); 
    } catch (err) {
      console.error(err);
      message.error('Failed to create task');
    }
  };

  if (loading) return <Spin size='large' />;

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Project Board</Title>

      <KanbanBoard
        statuses={statuses}
        tasks={tasks}
        refresh={loadBoard}
        onAddTask={handleAddTask}
      />
    </div>
  );
}
