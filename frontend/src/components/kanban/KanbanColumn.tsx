import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { TaskCard } from './TaskCard';

export const KanbanColumn = ({ status, tasks }: any) => {
  return (
    <Card
      title={status.name}
      extra={
        <Button type='text' icon={<PlusOutlined />}>
          Add
        </Button>
      }
      style={{
        background: '#f4f5f7',
        height: '100%',
      }}
    >
      {tasks.map((task: any) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </Card>
  );
};
