import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, Row, Col, notification } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import axiosInstance from '../api/axiosInstance';
import registerIllustration from '../assets/register-illustration.svg';
import useBreakpoint from '../hooks/useBreakpoint';
import authService from '../services/auth.service';
import { IRegisterRequest } from '../types';

const { Title } = Typography;

const RegisterPage: React.FC = () => {
    const { control, handleSubmit, formState: { errors, isSubmitting }, getValues } = useForm({
        defaultValues: {
            username: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
        },
    });


    const [notificationApi, notificationContextHolder] = notification.useNotification();
    const navigate = useNavigate();

    const isMobile = useBreakpoint();

    const onSubmit = async (data: any) => {
        
        const postData: IRegisterRequest = {
            username: data.username,
            password: data.password,
            phoneNumber: data.phoneNumber,
        };
        try {
            await authService.register(postData);

            notificationApi.success({
                message: 'Registration successful',
                description: 'Your account was successfully. Please log in.',
                placement: 'topRight',
            });

            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (error: any) {
            console.error('Registration failed:', error);
            notificationApi.error({
                message: 'Registration error',
                description: error.response?.data || 'Registration error. Please try again.',
                placement: 'topRight',
            });
        }
    };

    return (
        <Row justify="center" align="middle" style={{ minHeight: 'calc(100vh - 150px)' }}>
            {notificationContextHolder}
            <Col xs={24} sm={20} md={18} lg={14} xl={12}>
                <Card style={{ boxShadow: '0 4px 20px 0 rgba(0,0,0,0.1)' }}>
                    <Row>
                        <Col xs={24} md={12} style={{ padding: '24px' }}>
                            <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>Register</Title>
                            <Form onFinish={handleSubmit(onSubmit)} layout="vertical">

                                <Form.Item label="Username" validateStatus={errors.username ? 'error' : ''} help={errors.username?.message}>
                                    <Controller
                                        name="username"
                                        control={control}
                                        rules={{
                                            required: 'Username is required',
                                            minLength: { value: 3, message: 'Username must have atleast 3 characters' }
                                        }}
                                        render={({ field }) => <Input {...field} prefix={<UserOutlined />} placeholder="Enter username" />}
                                    />
                                </Form.Item>

                                <Form.Item label="Phone number" validateStatus={errors.phoneNumber ? 'error' : ''} help={errors.phoneNumber?.message}>
                                    <Controller
                                        name="phoneNumber"
                                        control={control}
                                        rules={{
                                            required: 'Phone number is required',
                                            pattern: {
                                                value: /^[0-9]{8,10}$/,
                                                message: 'Invalid phone number'
                                            }
                                        }}
                                        render={({ field }) => <Input {...field} prefix={<PhoneOutlined />} placeholder="Enter phone number" />}
                                    />
                                </Form.Item>

                                <Form.Item label="Password" validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
                                    <Controller
                                        name="password"
                                        control={control}
                                        rules={{
                                            required: 'Password is required',
                                            minLength: { value: 6, message: 'Password must have atleast 6 characters' }
                                        }}
                                        render={({ field }) => <Input.Password {...field} prefix={<LockOutlined />} placeholder="Enter password" />}
                                    />
                                </Form.Item>

                                <Form.Item label="Confirm password" validateStatus={errors.confirmPassword ? 'error' : ''} help={errors.confirmPassword?.message}>
                                    <Controller
                                        name="confirmPassword"
                                        control={control}
                                        rules={{
                                            required: 'Password confirmation is required',
                                            validate: value => value === getValues('password') || 'Passwords do not match'
                                        }}
                                        render={({ field }) => <Input.Password {...field} prefix={<LockOutlined />} placeholder="Enter password again" />}
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" loading={isSubmitting} block>
                                        Sign up
                                    </Button>
                                </Form.Item>

                                <Typography.Text style={{ textAlign: 'center', display: 'block' }}>
                                    Already have an account? <Link to="/login">Log In!</Link>
                                </Typography.Text>
                            </Form>
                        </Col>

                        {!isMobile && (
                            <Col xs={0} md={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px', borderLeft: '1px solid #f0f0f0' }}>
                                <img src={registerIllustration} alt="Register" style={{ maxWidth: '100%', height: 'auto' }} />
                            </Col>
                        )}
                    </Row>
                </Card>
            </Col>
        </Row>
    );
};

export default RegisterPage;