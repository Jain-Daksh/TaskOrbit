// src/components/kanban/KanbanBoard.tsx
import React, { useState } from 'react';
import { Card, Typography, Modal, Input } from 'antd';

const { Text } = Typography;

interface Task {
  id: string;
  title: string;
  statusId: string;
}

interface Status {
  id: string;
  name: string;
}

interface KanbanBoardProps {
  statuses: Status[];
  tasks: Task[];
  refresh: () => void;
  onAddTask?: (statusId: string, title: string) => void; // now receives title
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  statuses,
  tasks,
  onAddTask,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const openAddTask = (statusId: string) => {
    setCurrentStatus(statusId);
    setModalVisible(true);
  };

  const handleAddTask = () => {
    if (currentStatus && newTaskTitle.trim()) {
      onAddTask && onAddTask(currentStatus, newTaskTitle.trim());
      setNewTaskTitle('');
      setModalVisible(false);
    }
  };

  return (
    <>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        {statuses.map((status) => {
          const statusTasks = tasks.filter(
            (task) => task.statusId === status.id,
          );

          return (
            <div
              key={status.id}
              style={{
                flex: 1,
                background: '#f0f2f5',
                borderRadius: 6,
                padding: 10,
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <h4 style={{ marginBottom: 10 }}>{status.name}</h4>

              <div style={{ flexGrow: 1 }}>
                {statusTasks.length === 0 ? (
                  <Text type='secondary'>No tasks yet</Text>
                ) : (
                  statusTasks.map((task) => (
                    <Card
                      key={task.id}
                      size='small'
                      style={{ marginBottom: 8, cursor: 'pointer' }}
                    >
                      {task.title}
                    </Card>
                  ))
                )}
              </div>

              <div style={{ marginTop: 10 }}>
                <Card
                  type='inner'
                  style={{
                    border: '1px dashed #1890ff',
                    textAlign: 'center',
                    cursor: 'pointer',
                    color: '#1890ff',
                  }}
                  onClick={() => openAddTask(status.id)}
                >
                  + Add Task
                </Card>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Task Modal */}
      <Modal
        title='Add Task'
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleAddTask}
        okText='Add'
      >
        <Input
          placeholder='Task title'
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
        />
      </Modal>
    </>
  );
};
