import React from 'react';
import { Table, Typography } from 'antd';

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
}

export const WorkspaceMembersTable: React.FC<WorkspaceMembersTableProps> = ({
  members,
}) => {
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
