import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Input,
  Modal,
  Popconfirm,
  Typography,
  message,
} from 'antd';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import api from '../../api/axiosService';

const { Text } = Typography;

interface Status {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
}

interface Props {
  statuses: Status[];
  workspaceId: string;
  refreshWorkspace?: () => void;
}

export const StatusManager: React.FC<Props> = ({ statuses, workspaceId }) => {
  const [statusList, setStatusList] = useState<Status[]>(statuses);
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
  const [newName, setNewName] = useState('');

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = statusList.findIndex((s) => s.id === active.id);
      const newIndex = statusList.findIndex((s) => s.id === over.id);
      const newList = arrayMove(statusList, oldIndex, newIndex);
      setStatusList(newList);

      try {
        await api.put(`/status/reorder`, {
          workspaceId,
          statuses: newList.map((s, index) => ({ id: s.id, order: index + 1 })),
        });
        message.success('Statuses reordered');
      } catch (err: any) {
        message.error(err.response?.data?.message || 'Failed to reorder');
      }
    }
  };

  const handleEdit = (status: Status) => {
    setEditingStatus(status);
    setNewName(status.name);
  };

  const handleSaveEdit = async () => {
    if (!editingStatus) return;
    try {
      await api.put(`/statuses/${editingStatus.id}`, { name: newName });
      setStatusList((prev) =>
        prev.map((s) =>
          s.id === editingStatus.id ? { ...s, name: newName } : s,
        ),
      );
      setEditingStatus(null);
      message.success('Status updated');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeactivate = async (status: Status) => {
    try {
      await api.delete(`/statuses/${status.id}`);
      setStatusList((prev) => prev.filter((s) => s.id !== status.id));
      message.success('Status marked inactive');
    } catch (err: any) {
      message.error(
        err.response?.data?.message || 'Failed to deactivate status',
      );
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: Status) => <Text>{record.name}</Text>,
    },
    {
      title: 'Active',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (active: boolean) => (active ? 'Yes' : 'No'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Status) => (
        <Space>
          <Button type='link' onClick={() => handleEdit(record)}>
            Edit
          </Button>
          <Popconfirm
            title='Are you sure to deactivate?'
            onConfirm={() => handleDeactivate(record)}
          >
            <Button type='link' danger>
              Deactivate
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const SortableRow: React.FC<any> = (props) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: props['data-row-key'] });
    const style = {
      ...props.style,
      transform: CSS.Transform.toString(transform),
      transition,
    };
    return (
      <tr
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        {...props}
      />
    );
  };

  return (
    <div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={statusList.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            dataSource={statusList}
            columns={columns}
            rowKey='id'
            components={{
              body: { row: SortableRow },
            }}
            pagination={false}
          />
        </SortableContext>
      </DndContext>

      <Modal
        title='Edit Status'
        open={!!editingStatus}
        onOk={handleSaveEdit}
        onCancel={() => setEditingStatus(null)}
      >
        <Input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder='Status name'
        />
      </Modal>
    </div>
  );
};
