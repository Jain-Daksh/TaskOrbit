import { useEffect, useState } from 'react';
import { Spin, Typography, message } from 'antd';
import api from '../../api/axiosService';
import { useParams } from 'react-router-dom';
import { KanbanBoard } from '../../components/kanban/KanbanBoard';
import { TaskView } from '../../components/task/TaskView';
import { useMediaQuery } from 'react-responsive';

const { Title } = Typography;

export default function ProjectDetailPage() {
  const { workspaceId, projectId } = useParams();
  const [statuses, setStatuses] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const isMobile = useMediaQuery({ maxWidth: 768 });

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
      await api.post('/task', { title, statusId, projectId });
      message.success('Task created!');
      loadBoard();
    } catch (err) {
      console.error(err);
      message.error('Failed to create task');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Title level={3}>Project Board</Title>

      {loading ? (
        <Spin size='large' />
      ) : (
        <KanbanBoard
          statuses={statuses}
          tasks={tasks}
          onAddTask={handleAddTask}
          onTaskClick={(taskId) => setSelectedTaskId(taskId)}
        />
      )}

      {selectedTaskId && (
        <TaskView
          taskId={selectedTaskId}
          visible={!isMobile}
          status={statuses}
          workspaceId={workspaceId as string}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}
