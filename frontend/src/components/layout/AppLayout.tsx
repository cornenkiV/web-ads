import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const { Header, Content, Footer } = Layout;

const AppLayout: React.FC = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{ position: 'fixed', zIndex: 1, width: '100%', padding: '0 24px' }}>
                <NavBar />
            </Header>
            <Content style={{ padding: '0 24px', marginTop: 88 }}>
                <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                    <Outlet />
                </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
                Vladimir Cornenki Inviggo Internship Task
            </Footer>
        </Layout>
    );
};

export default AppLayout;