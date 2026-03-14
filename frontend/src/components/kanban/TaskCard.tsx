import { Card } from "antd";

export const TaskCard = ({ task }) => {
  return (
    <Card
      size="small"
      style={{
        marginBottom: 10,
        cursor: "grab",
      }}
    >
      {task.title}
    </Card>
  );
};