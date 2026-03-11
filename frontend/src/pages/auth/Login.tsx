import { useState } from 'react';
import { Button, Input, Form, Card, message } from 'antd';
import api from '../../api/axiosService';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import './Auth.css';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);
  const setRefreshToken = useAuthStore((state) =>state.setRefreshToken)
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', values);
      if (res.data.code === 200) {
        const { user, accessToken,refreshToken } = res.data.data;
        setUser(user);
        setToken(accessToken);
        setRefreshToken(refreshToken);
        message.success('Login successful!');
        navigate('/app');
      }
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='auth-page-container'>
      <Navbar />

      <div className='auth-container'>
        <Card className='auth-card'>
          <h2>Login to Your Account</h2>
          <Form layout='vertical' onFinish={onFinish}>
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
                Login
              </Button>
            </Form.Item>
          </Form>
          <p className='auth-footer'>
            Don't have an account? <a href='/register'>Register</a>
          </p>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
