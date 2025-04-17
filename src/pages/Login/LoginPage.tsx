import React, { useState } from 'react';
import { Form, Input, Button, message, Typography, Row, Col, Card } from 'antd';
import { MailOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { login as apiLogin } from '../../services/api';
import fetchLogo from '../../assets/footer-logo.svg';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import styles from './LoginPage.module.css';

const { Title, Paragraph } = Typography;

interface LoginFormValues {
  name: string;
  email: string;
}

const LoginPage: React.FC = () => {
  const auth = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || '/search';
  if (auth.isLoading) {
    return <LoadingSpinner />;
  }
  if (auth.isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const onFinish = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      await apiLogin(values.name, values.email);
      message.success('Login successful!');
      auth.login();
    } catch (error: unknown) {
      let displayMessage =
        'Login failed. Please check that your name and email are valid.';
      if (axios.isAxiosError(error)) {
        console.error(
          'Login API error:',
          error.response?.status,
          error.response?.data
        );
      } else if (error instanceof Error) {
        console.error('Login error:', error.message);
      } else {
        console.error('An unexpected error occurred:', error);
        displayMessage = 'An unexpected error occurred during login.';
      }
      message.error(displayMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Row align="middle" justify="center" className={styles.loginPageLayout}>
      <Col xs={22} sm={16} md={12} lg={10} xl={8}>
        <Card className={styles.loginCard}>
          <div className={styles.loginHeader}>
            <img
              src={fetchLogo}
              alt="Fetch Logo"
              className={styles.loginLogo}
            />
            <Title level={2} className={styles.loginTitle}>
              Welcome
            </Title>
            <Paragraph>Please sign in to continue</Paragraph>
          </div>
          <Form
            name="login-form"
            className={styles.loginForm}
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="Your Name" />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                  type: 'email',
                },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="Your Email" />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                className={styles.loginButton}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginPage;
