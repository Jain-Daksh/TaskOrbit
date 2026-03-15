import { Card } from 'antd';

export const TaskCard = ({ task }: any) => {
  return (
    <Card
      size='small'
      style={{
        marginBottom: 10,
        cursor: 'grab',
      }}
    >
      {task.title}
    </Card>
  );
};
