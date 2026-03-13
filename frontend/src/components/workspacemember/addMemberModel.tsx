import React, { useState } from 'react';
import { Modal, Input, Select, message } from 'antd';
import api from '../../api/axiosService';

interface AddMemberModalProps {
  workspaceId: string;
  visible: boolean;
  onClose: () => void;
  onMemberAdded: () => void;
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  workspaceId,
  visible,
  onClose,
  onMemberAdded,
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');
  const [loading, setLoading] = useState(false);

  const handleAddMember = async () => {
    if (!email) return message.error('Please enter email');
    setLoading(true);
    try {
      await api.post(`/workspacemember/${workspaceId}/members`, {
        workspaceId,
        email,
        roleName: 'Admin',
      });
      message.success('Member added successfully');
      onMemberAdded();
      setEmail('');
      setRole('Member');
      onClose();
    } catch (err: any) {
      message.error(err.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title='Add Member'
      open={visible}
      onCancel={onClose}
      onOk={handleAddMember}
      confirmLoading={loading}
    >
      <Input
        placeholder="Enter user's email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Select value={role} onChange={setRole} style={{ width: '100%' }}>
        <Select.Option value='Member'>Member</Select.Option>
        <Select.Option value='Admin'>Admin</Select.Option>
      </Select>
    </Modal>
  );
};
