import ReactDOM from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRoutes';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#4a90e2',
        colorTextBase: '#222',
        colorBgLayout: '#f9f9f9',
        colorBgContainer: '#fff',
        borderRadius: 8,
        fontSize: 15,
      },
    }}
  >
    <RouterProvider router={router} />
  </ConfigProvider>,
);
