import React from 'react';
import { Result, Button, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';


const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Row justify="center" align="middle" style={{ minHeight: 'calc(100vh - 150px)' }}>
            <Col>
                <Result
                    status="404"
                    title="404 - Page not found"
                    extra={
                        <Button type="primary" onClick={() => navigate('/')}>
                            Back to home
                        </Button>
                    }
                />
            </Col>
        </Row>
    );
};

export default NotFoundPage;