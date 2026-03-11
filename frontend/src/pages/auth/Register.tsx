import { useState } from 'react';
import { Button, Input, Form, Card, message } from 'antd';
import api from '../../api/axiosService';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './Auth.css';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', values);
      if (res.data.code === 200) {
        const { user, token } = res.data.data;
        setUser(user);
        setToken(token);
        message.success('Signup successful!');
        navigate('/app');
      }
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <Navbar />

      <div className='auth-container'>
        <Card className='auth-card'>
          <h2>Create Your Account</h2>
          <Form layout='vertical' onFinish={onFinish}>
            <Form.Item
              label='Name'
              name='name'
              rules={[{ required: true, message: 'Enter your name' }]}
            >
              <Input placeholder='John Doe' />
            </Form.Item>
            <Form.Item
              label='Email'
              name='email'
              rules={[
                { required: true, message: 'Enter your email' },
                { type: 'email' },
              ]}
            >
              <Input placeholder='email@example.com' />
            </Form.Item>
            <Form.Item
              label='Password'
              name='password'
              rules={[{ required: true, message: 'Enter password' }]}
            >
              <Input.Password placeholder='********' />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit' loading={loading} block>
                Register
              </Button>
            </Form.Item>
          </Form>
          <p className='auth-footer'>
            Already have an account? <a href='/login'>Login</a>
          </p>
        </Card>
      </div>

      <Footer />
    </div>
  );
}