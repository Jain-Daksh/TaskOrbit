import { useState } from "react";
import { Button, Input, Form, Card, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/axiosService";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { useAuthStore } from "../../store/authStore";
import "./Auth.css";

export default function VerifySignupOtp() {

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  const onFinish = async (values: any) => {

    setLoading(true);

    try {

      const res = await api.post("/auth/verify-signup-otp", {
        email,
        otp: values.otp
      });

      if (res.data.code === 200) {

        const { user, accessToken } = res.data.data;

        setUser(user);
        setToken(accessToken);

        message.success("Account verified successfully");

        navigate("/app");

      }

    } catch (err: any) {

      message.error(
        err.response?.data?.message || "Invalid OTP"
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

          <h2>Verify Your Email</h2>

          <Form layout="vertical" onFinish={onFinish}>

            <Form.Item
              label="Enter OTP"
              name="otp"
              rules={[{ required: true, message: "Enter OTP" }]}
            >
              <Input placeholder="Enter OTP" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
              >
                Verify Account
              </Button>
            </Form.Item>

          </Form>

        </Card>

      </div>

      <Footer />

    </div>
  );
}