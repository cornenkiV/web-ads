import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, Row, Col, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../hooks/useAuth';
import axiosInstance from '../api/axiosInstance';
import useBreakpoint from '../hooks/useBreakpoint';
import loginIllustration from '../assetes/login-illustration2.svg';
import { AxiosError } from 'axios';

const { Title } = Typography;

const LoginPage: React.FC = () => {
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            username: '',
            password: '',
        },
    });

    const navigate = useNavigate();
    const { login } = useAuth();
    const isMobile = useBreakpoint();
    const [noptificationApi, notificationContextHolder] = notification.useNotification();

    const onSubmit = async (data: any) => {
        try {
            const response = await axiosInstance.post('/auth/login', data);
            const { token } = response.data;
            login(token);
            navigate('/');
        } catch (error) {
            console.error('Failed login:', error);
            let message = 'Unknown error, try again later';
            if (error instanceof AxiosError) {
                const status = error.response?.status;
                if (status == 403) {
                    message = "Wrong username or password";
                } else if (error.status == 429) {
                    message = "Too many requests, try again later"
                }
            }

            noptificationApi.error({
                message: 'Error',
                description: message,
                placement: 'topRight',
                duration: 3,
            });
        }
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: 'calc(100vh - 150px)' }}>
            {notificationContextHolder}
            <Col xs={24} sm={20} md={16} lg={12} xl={10}>
                <Card style={{ boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}>
                    <Row>

                        {!isMobile && (
                            <Col md={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }}>
                                <img src={loginIllustration} alt="Login" style={{ maxWidth: '100%', height: 'auto' }} />
                            </Col>
                        )}
                        <Col xs={24} md={12} style={{ padding: '24px' }}>
                            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Log In</Title>
                            <Form onFinish={handleSubmit(onSubmit)} layout="vertical">
                                <Form.Item
                                    label="Username"
                                    validateStatus={errors.username ? 'error' : ''}
                                    help={errors.username?.message}
                                >
                                    <Controller
                                        name="username"
                                        control={control}
                                        rules={{ required: 'Username is required' }}
                                        render={({ field }) => (
                                            <Input {...field} prefix={<UserOutlined />} placeholder="Enter username" />
                                        )}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Password"
                                    validateStatus={errors.password ? 'error' : ''}
                                    help={errors.password?.message}
                                >
                                    <Controller
                                        name="password"
                                        control={control}
                                        rules={{ required: 'Password is required' }}
                                        render={({ field }) => (
                                            <Input.Password {...field} prefix={<LockOutlined />} placeholder="Enter password" />
                                        )}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={isSubmitting} block>
                                        Log in
                                    </Button>
                                </Form.Item>

                                <Typography.Text style={{ textAlign: 'center', display: 'block' }}>
                                    Dont have an account? <Link to="/register">Sign up</Link>
                                </Typography.Text>
                            </Form>
                        </Col>

                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export default LoginPage;