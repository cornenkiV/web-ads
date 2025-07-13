import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Space, Typography, Avatar, Drawer } from 'antd';
import { UserOutlined, PlusOutlined, LogoutOutlined, MenuOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import useBreakpoint from '../../hooks/useBreakpoint';

const { Title } = Typography;

const NavBar: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const isMobile = useBreakpoint();

    const [drawerVisible, setDrawerVisible] = useState(false);

    const handleLogout = () => {
        logout();
        setDrawerVisible(false);
        navigate('/login');
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        setDrawerVisible(false);
    };

    const NavItems: React.FC<{ isDrawer?: boolean }> = ({ isDrawer = false }) => {
        const direction = isDrawer ? 'vertical' : 'horizontal';
        const size = isDrawer ? 'large' : 'middle';
        const width = isDrawer ? '100%' : 'auto';

        if (isAuthenticated && user) {
            return (
                <Space direction={direction} size={size} style={{ width }}>
                    <Space>
                        <Avatar icon={<UserOutlined />} />
                        <Typography.Text strong={!isDrawer} style={{ color: isDrawer ? 'inherit' : 'white' }}>{user.username}</Typography.Text>
                    </Space>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => handleNavigation('/ads/create')}
                        style={{ width }}
                    >
                        Create Ad
                    </Button>
                    <Button
                        icon={<LogoutOutlined />}
                        onClick={handleLogout}
                        danger
                        style={{ width }}
                    >
                        Sign Out
                    </Button>
                </Space>
            );
        }
        return (
            <Space direction={direction} size={size} style={{ width }}>
                <Button onClick={() => handleNavigation('/login')} style={{ width }}>
                    Login
                </Button>
                <Button type="primary" onClick={() => handleNavigation('/register')} style={{ width }}>
                    Sign Up
                </Button>
            </Space>
        );
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
            <Link to="/">
                <Title level={3} style={{ color: 'white', margin: 0 }}>
                    WebAds
                </Title>
            </Link>
            {isMobile ? (
                <>
                    <Button type="primary" icon={<MenuOutlined />} onClick={() => setDrawerVisible(true)} />
                    <Drawer
                        title="Menu"
                        placement="right"
                        onClose={() => setDrawerVisible(false)}
                        open={drawerVisible}
                    >
                        <NavItems isDrawer={true} />
                    </Drawer>
                </>
            ) : (
                <div>
                    <NavItems />
                </div>
            )}
        </div>
    );
};

export default NavBar;