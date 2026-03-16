import { useState } from "react";
import { Button, Input, Form, Card, message } from "antd";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosService";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import "./Auth.css";

export default function ForgotPassword() {

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setLoading(true);

    try {

      const res = await api.post("/auth/forgot-password", values);

      if (res.data.code === 200) {
        message.success("OTP sent to your email");

        navigate("/verify-otp", {
          state: { email: values.email }
        });
      }

    } catch (err: any) {

      message.error(
        err.response?.data?.message || "Failed to send OTP"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <Navbar />

      <div className="auth-container">

        <Card className="auth-card">

          <h2>Forgot Password</h2>

          <Form layout="vertical" onFinish={onFinish}>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Enter your email" },
                { type: "email" }
              ]}
            >
              <Input placeholder="email@example.com" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                Send OTP
              </Button>
            </Form.Item>

          </Form>

        </Card>

      </div>

      <Footer />
    </div>
  );
}