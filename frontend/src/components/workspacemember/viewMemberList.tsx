import React from 'react';
import { Table, Typography, Button, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
const { Text } = Typography;

interface Member {
  id: string;
  userId: string;
  workspaceId: string;
  roleId: string;
  joinedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  role: {
    id: string;
    name: string;
  };
}

interface WorkspaceMembersTableProps {
  isAdmin: boolean;
  members: Member[];
  userId: string;
  onRemoveMember?: (memberId: string) => Promise<void>; // Callback to remove a member
}

export const WorkspaceMembersTable: React.FC<WorkspaceMembersTableProps> = ({
  isAdmin = false,
  members,
  userId,
  onRemoveMember,
}) => {
  const handleRemove = async (memberId: string) => {
    if (!onRemoveMember) return;

    try {
      await onRemoveMember(memberId);
      message.success('Member removed successfully');
    } catch (err: any) {
      message.error(err.message || 'Failed to remove member');
    }
  };

  const columns: ColumnsType<Member> = [
    {
      title: 'Name',
      dataIndex: ['user', 'name'],
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: ['user', 'email'],
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: ['role', 'name'],
      key: 'role',
    },
    {
      title: 'Joined At',
      dataIndex: 'joinedAt',
      key: 'joinedAt',
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  if (isAdmin) {
    columns.push({
      title: 'Action',
      key: 'action',
      render: (_: any, record: Member) =>
        onRemoveMember ? (
          <Popconfirm
            title={`Are you sure to remove ${record.user.name}?`}
            onConfirm={() => handleRemove(record.id)}
            okText='Yes'
            cancelText='No'
            disabled={record.userId === userId}
          >
            <Button danger size='small' disabled={record.userId === userId}>
              Remove
            </Button>
          </Popconfirm>
        ) : null,
    });
  }
  if (members.length === 0) {
    return <Text type='secondary'>No members yet.</Text>;
  }

  return (
    <Table
      dataSource={members}
      columns={columns}
      rowKey='id'
      scroll={{ x: 'max-content' }}
      pagination={false}
    />
  );
};
