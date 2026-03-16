import { Card, Col, Row, Typography, Tag, List, Empty } from 'antd';
import { useAuthStore } from '../../store/authStore';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { user } = useAuthStore();

  // Dummy data for now (replace with API later)
  const stats = {
    totalTasks: 12,
    dueToday: 3,
    overdue: 2,
    completed: 5,
  };

  const tasks = [
    {
      id: '1',
      title: 'Finish project UI',
      dueDate: '2026-03-16',
      status: 'In Progress',
    },
    {
      id: '2',
      title: 'Fix login bug',
      dueDate: '2026-03-15',
      status: 'Todo',
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Title level={3}>
        👋 Welcome back, {user?.name || 'User'}
      </Title>

      {/* Stats Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={6}>
          <Card>
            <Title level={4}>{stats.totalTasks}</Title>
            <Text>Total Tasks</Text>
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Title level={4} style={{ color: '#1890ff' }}>
              {stats.dueToday}
            </Title>
            <Text>Due Today</Text>
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Title level={4} style={{ color: '#ff4d4f' }}>
              {stats.overdue}
            </Title>
            <Text>Overdue</Text>
          </Card>
        </Col>

        <Col xs={24} md={6}>
          <Card>
            <Title level={4} style={{ color: '#52c41a' }}>
              {stats.completed}
            </Title>
            <Text>Completed</Text>
          </Card>
        </Col>
      </Row>

      {/* Task List */}
      <Card title="Your Tasks">
        {tasks.length === 0 ? (
          <Empty description="No tasks assigned to you" />
        ) : (
          <List
            dataSource={tasks}
            renderItem={(task) => (
              <List.Item>
                <List.Item.Meta
                  title={task.title}
                  description={`Due: ${task.dueDate}`}
                />
                <Tag
                  color={
                    task.status === 'Done'
                      ? 'green'
                      : task.status === 'In Progress'
                      ? 'blue'
                      : 'orange'
                  }
                >
                  {task.status}
                </Tag>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  );
};

export default Dashboard;