import { useEffect, useState } from 'react';
import { Typography, Form, Input, Button, Card, Spin, App } from 'antd';
import api from '../../api/axiosService';

const { Title } = Typography;

export default function MyProfilePage() {
  const { message: msg } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const res = await api.get('/user/profile');
      form.setFieldsValue({
        name: res.data.data.name,
        email: res.data.data.email,
      });
    } catch (err: any) {
      msg.error(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleUpdateProfile = async (values: any) => {
    setUpdating(true);
    try {
      await api.put('/user/profile', values);
      msg.success('Profile updated successfully');
      fetchUser();
    } catch (err: any) {
      msg.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdatePassword = async (values: any) => {
    setPasswordUpdating(true);
    try {
      await api.put('/user/password', values);
      msg.success('Password updated successfully');
      passwordForm.resetFields();
    } catch (err: any) {
      msg.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordUpdating(false);
    }
  };

  if (loading) return <Spin size='large' />;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <Title level={2}>My Profile</Title>

      <Card title='Profile Details' style={{ marginBottom: 24 }}>
        <Form form={form} layout='vertical' onFinish={handleUpdateProfile}>
          <Form.Item
            label='Name'
            name='name'
            rules={[
              { required: true, message: 'Please enter your name' },
              {
                validator: (_, value) => {
                  if (!value || !value.trim()) {
                    return Promise.reject(
                      new Error('Name cannot be empty or just spaces'),
                    );
                  }
                  const regex = /^[A-Za-z\s]+$/;
                  if (!regex.test(value)) {
                    return Promise.reject(
                      new Error('Name can only contain letters and spaces'),
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input placeholder='Your Name' />
          </Form.Item>
          <Form.Item
            label='Email'
            name='email'
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input placeholder='Your Email' disabled />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' loading={updating}>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card title='Change Password'>
        <Form
          form={passwordForm}
          layout='vertical'
          onFinish={handleUpdatePassword}
        >
          <Form.Item
            label='Current Password'
            name='currentPassword'
            rules={[
              { required: true, message: 'Please enter current password' },
            ]}
          >
            <Input.Password placeholder='Current Password' />
          </Form.Item>

          <Form.Item
            label='New Password'
            name='newPassword'
            rules={[{ required: true, message: 'Please enter new password' }]}
          >
            <Input.Password placeholder='New Password' />
          </Form.Item>

          <Form.Item
            label='Confirm New Password'
            name='confirmPassword'
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Please confirm your new password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password placeholder='Confirm New Password' />
          </Form.Item>

          <Form.Item>
            <Button type='primary' htmlType='submit' loading={passwordUpdating}>
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
