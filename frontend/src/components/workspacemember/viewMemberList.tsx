import React from 'react';
import { Table, Typography, Button, Popconfirm, message } from 'antd';

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
  members: Member[];
  onRemoveMember?: (memberId: string) => Promise<void>; // Callback to remove a member
}

export const WorkspaceMembersTable: React.FC<WorkspaceMembersTableProps> = ({
  members,
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

  const columns = [
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
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: Member) =>
        onRemoveMember ? (
          <Popconfirm
            title={`Are you sure to remove ${record.user.name}?`}
            onConfirm={() => handleRemove(record.id)}
            okText='Yes'
            cancelText='No'
          >
            <Button danger size='small'>
              Remove
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  if (members.length === 0) {
    return <Text type='secondary'>No members yet.</Text>;
  }

  return (
    <Table
      dataSource={members}
      columns={columns}
      rowKey='id'
      pagination={false}
    />
  );
};
