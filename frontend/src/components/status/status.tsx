import React, { useEffect, useState } from 'react';
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
  isDefault: boolean;
}

interface Props {
  statuses: Status[];
  workspaceId: string;
  isAdmin: boolean;
  refreshWorkspace?: () => void;
}

export const StatusManager: React.FC<Props> = ({
  statuses,
  workspaceId,
  isAdmin = false,
}) => {
  const [statusList, setStatusList] = useState<Status[]>(statuses);
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
  const [newName, setNewName] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newStatusName, setNewStatusName] = useState('');
  const [creating, setCreating] = useState(false);

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
      await api.put(`/status/${editingStatus.id}`, { name: newName });
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

  const handleDelete = async (status: Status) => {
    console.log('ee');
    try {
      await api.delete(`/status/${status.id}`);

      setStatusList((prev) => prev.filter((s) => s.id !== status.id));

      message.success('Status deleted');
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to delete status');
    }
  };

  useEffect(() => {
    setStatusList(statuses);
  }, [statuses]);

  const handleCreateStatus = async () => {
    if (!newStatusName.trim()) {
      message.error('Status name required');
      return;
    }

    try {
      setCreating(true);

      const res = await api.post('/status', {
        name: newStatusName,
        workspaceId,
      });

      const newStatus = res.data.data;

      setStatusList((prev) => [...prev, newStatus]);

      message.success('Status created');

      setNewStatusName('');
      setAddModalOpen(false);
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to create status');
    } finally {
      setCreating(false);
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
      render: (_: any, record: Status) =>
        isAdmin && (
          <Space>
            <Button
              type='link'
              onClick={() => handleEdit(record)}
              disabled={record.isDefault}
            >
              Edit
            </Button>

            <Popconfirm
              title='Delete this status?'
              okText='Yes'
              cancelText='No'
              onConfirm={() => handleDelete(record)}
              disabled={record.isDefault}
            >
              <Button type='link' danger disabled={record.isDefault}>
                Delete
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
            title={() =>
              isAdmin && (
                <Button type='primary' onClick={() => setAddModalOpen(true)}>
                  Add Status
                </Button>
              )
            }
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
      <Modal
        title='Add Status'
        open={addModalOpen}
        confirmLoading={creating}
        onOk={handleCreateStatus}
        onCancel={() => setAddModalOpen(false)}
      >
        <Input
          placeholder='Status name'
          value={newStatusName}
          onChange={(e) => setNewStatusName(e.target.value)}
        />
      </Modal>
      ;
    </div>
  );
};
