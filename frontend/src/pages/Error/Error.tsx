import { Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

export default function ErrorPage() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <Title level={2}>Oops! Something went wrong.</Title>
      <Text>We couldn't find that page or something broke 😅</Text>
      <div style={{ marginTop: 20 }}>
        <Button type='primary' onClick={() => navigate('/')}>
          Go Home
        </Button>
      </div>
    </div>
  );
}
