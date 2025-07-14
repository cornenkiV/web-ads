"use client"

import { useEffect, useState } from "react"
import {
    Row,
    Col,
    Card,
    Typography,
    Avatar,
    Button,
    Divider,
    Image,
    Space,
    Spin,
    Alert,
    Tag,
    Modal,
    notification,
} from "antd"
import {
    PhoneOutlined,
    EnvironmentOutlined,
    UserOutlined,
    MessageOutlined,
    SafetyOutlined,
    ClockCircleOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleFilled,
} from "@ant-design/icons"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { AdCategory, IAd } from "../types"
import adService from "../services/ad.service"

const { Title, Text, Paragraph } = Typography

const CATEGORY_COLOR_MAP: Record<AdCategory, string> = {
    [AdCategory.CLOTHING]: 'magenta',
    [AdCategory.TOOLS]: 'volcano',
    [AdCategory.SPORTS]: 'orange',
    [AdCategory.ACCESSORIES]: 'gold',
    [AdCategory.FURNITURE]: 'lime',
    [AdCategory.PETS]: 'green',
    [AdCategory.GAMES]: 'cyan',
    [AdCategory.BOOKS]: 'blue',
    [AdCategory.TECHNOLOGY]: 'geekblue',
};

function formatPrice(price: number): string {
    return new Intl.NumberFormat("en-EN").format(price) + " RSD"
}

function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-EN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })
}

function getTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) return "Today"
    if (diffInDays === 1) return "Yesterday"
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    return formatDate(dateString)
}

export default function AdListingPageAntd() {

    const { id } = useParams<{ id: string }>();
    const { user, isAuthenticated } = useAuth();

    const [ad, setAd] = useState<IAd | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const [notificationApi, notificationContextHolder] = notification.useNotification();
    const [modalApi, modalContextHolder] = Modal.useModal();

    const handleDelete = (id: number) => {
        modalApi.confirm({
            title: 'Are you sure you want to delete this ad?',
            icon: <ExclamationCircleFilled />,
            content: 'This action cant be undone.',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await adService.deleteAd(id);
                    notificationApi.success({ message: 'Ad successfully deleted' });
                    navigate('/');
                } catch (error) {
                    notificationApi.error({ message: 'Error deleting ad' });
                }
            },
        });
    };


    useEffect(() => {
        if (!id) return;
        setLoading(true);
        adService.getAdById(id)
            .then(data => setAd(data))
            .catch(() => setError("Ad not found"))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <Alert message="Greška" description={error} type="error" showIcon />;
    }

    if (!ad) {
        return <Alert message="Info" description="Ad not found" type="info" showIcon />;
    }

    const isOwner = isAuthenticated && user?.username === ad.seller.username;

    const handleContact = () => {
        console.log("Phone")
    }

    const handleMessage = () => {
        console.log("Message")
    }

    return (
        <div style={{ minHeight: "100vh", padding: "24px", marginTop: 60 }}>
            {notificationContextHolder}
            {modalContextHolder}
            <Row gutter={[24, 24]} justify="center">
                <Col xs={24} lg={16} xl={10}>
                    <Image
                        src={ad.imageUrl}
                        alt={ad.name}
                        width="100%"
                        style={{ objectFit: "cover" }}
                        preview={false}
                    />

                    <Card style={{ marginTop: 16 }}>
                        <Row justify="space-between" align="middle">
                            <Col>
                                <Tag color={CATEGORY_COLOR_MAP[ad.category] || 'default'}>
                                    {ad.category}
                                </Tag>

                                <Title level={3}>{ad.name}</Title>

                                <Space>
                                    <Text type="secondary">
                                        <EnvironmentOutlined /> {ad.city}
                                    </Text>
                                    <Text type="secondary">
                                        <ClockCircleOutlined /> {getTimeAgo(ad.postDate)}
                                    </Text>
                                </Space>
                            </Col>
                            <Col>
                                <Title level={3} style={{ color: "#1890ff", marginBottom: 0 }}>
                                    {formatPrice(ad.price)}
                                </Title>
                            </Col>
                        </Row>
                        <Divider />
                        <div>
                            <Title level={4}>Description</Title>
                            <Paragraph>{ad.description}</Paragraph>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} lg={7}>
                    <Card title={<><UserOutlined /> Contact</>}>
                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                            <Space>
                                <Avatar size={48} src="/placeholder-user.jpg">
                                    {ad.seller.username.charAt(0).toUpperCase()}
                                </Avatar>
                                <div>
                                    <Text strong>{ad.seller.username}</Text>
                                    <br />
                                    <Text type="secondary">
                                        <SafetyOutlined /> Member since {formatDate(ad.seller.registrationDate)}
                                    </Text>
                                </div>
                            </Space>
                            <Divider />
                            <Button type="primary" block icon={<PhoneOutlined />} onClick={handleContact}>
                                {ad.seller.phoneNumber}
                            </Button>
                            <Button block icon={<MessageOutlined />} onClick={handleMessage}>
                                Send message
                            </Button>

                        </Space>
                    </Card>

                    <Card title="Details" style={{ marginTop: 16 }}>
                        <Row justify="space-between">
                            <Text type="secondary">Date posted:</Text>
                            <Text>{formatDate(ad.postDate)}</Text>
                        </Row>
                        <Row justify="space-between">
                            <Text type="secondary">Category:</Text>
                            <Tag color={CATEGORY_COLOR_MAP[ad.category] || 'default'} style={{ marginRight: 0 }}>
                                {ad.category}
                            </Tag>
                        </Row>
                        <Row justify="space-between">
                            <Text type="secondary">Location:</Text>
                            <Text>{ad.city}</Text>
                        </Row>
                    </Card>

                    {isOwner && (
                        <Card title="Ad management" style={{ marginTop: 16 }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button
                                    block
                                    icon={<EditOutlined />}
                                    onClick={() => navigate(`/ads/edit/${ad.id}`)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    danger
                                    block
                                    icon={<DeleteOutlined />}
                                    onClick={() => { handleDelete(ad.id) }}
                                >
                                    Delete
                                </Button>
                            </Space>
                        </Card>
                    )}
                </Col>
            </Row>
        </div>
    )
}
