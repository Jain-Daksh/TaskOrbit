import { Card, Col, Row, Typography, Tag, List, Empty } from 'antd';
import { useAuthStore } from '../../store/authStore';
import { useEffect, useState } from 'react';
import api from '../../api/axiosService';

const { Title, Text } = Typography;

const Dashboard = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await api.get('/dashboard');
      setData(res.data.data);
    };

    fetchDashboard();
  }, []);

  if (!data) return <div>Loading...</div>;

  const renderTask = (task: any) => (
    <List.Item key={task.id}>
      <List.Item.Meta
        title={task.title}
        description={
          <>
            <Text type='secondary'>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </Text>
            <br />
            <Tag color='purple'>{task.project?.name}</Tag>
          </>
        }
      />
    </List.Item>
  );

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>👋 Welcome back, {user?.name || 'User'}</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={12} md={6}>
          <Card>
            <Title level={4}>{data.totalTasks}</Title>
            <Text>Total Tasks</Text>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card>
            <Title level={4} style={{ color: '#1890ff' }}>
              {data.dueTodayCount}
            </Title>
            <Text>Due Today</Text>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card>
            <Title level={4} style={{ color: '#fa8c16' }}>
              {data.dueTomorrowCount}
            </Title>
            <Text>Due Tomorrow</Text>
          </Card>
        </Col>

        <Col xs={12} sm={12} md={6}>
          <Card>
            <Title level={4} style={{ color: '#ff4d4f' }}>
              {data.overdueCount}
            </Title>
            <Text>Overdue</Text>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {/* Overdue */}
        <Col xs={24} md={12}>
          <Card title={`Overdue (${data.overdueCount})`}>
            {data.overdue.length === 0 ? (
              <Empty description='No overdue tasks' />
            ) : (
              <List dataSource={data.overdue} renderItem={renderTask} />
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title={`Due Today (${data.dueTodayCount})`}>
            {data.dueToday.length === 0 ? (
              <Empty description='No tasks due today' />
            ) : (
              <List dataSource={data.dueToday} renderItem={renderTask} />
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title={`Due Tomorrow (${data.dueTomorrowCount})`}>
            {data.dueTomorrow.length === 0 ? (
              <Empty description='No tasks due tomorrow' />
            ) : (
              <List dataSource={data.dueTomorrow} renderItem={renderTask} />
            )}
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title='Recent Tasks'>
            {data.recentTasks.length === 0 ? (
              <Empty description='No recent tasks' />
            ) : (
              <List dataSource={data.recentTasks} renderItem={renderTask} />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
