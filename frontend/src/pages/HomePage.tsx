import React, { useState, useEffect, useCallback, useReducer } from 'react';
import { Table, Input, Button, Space, Row, Col, Select, Checkbox, Form, Card, Typography, Tooltip, Tag, notification, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, SearchOutlined, ClearOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { IAd, AdCategory, Page } from '../types';
import adService, { IAdFilterParams } from '../services/ad.service';
import { useAuth } from '../hooks/useAuth';
import useBreakpoint from '../hooks/useBreakpoint';
import { AxiosError } from 'axios';
import type { TableProps } from 'antd';

const { Option } = Select;
const { Title } = Typography;

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

const HomePage: React.FC = () => {
    const [adsPage, setAdsPage] = useState<Page<IAd>>();
    const [loading, setLoading] = useState<boolean>(true);

    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const isMobile = useBreakpoint();
    const [notificationApi, notificationContextHolder] = notification.useNotification();
    const [modalApi, modalContextHolder] = Modal.useModal();

    
    type FilterAction =
        | { type: 'SET_FILTERS', payload: IAdFilterParams }
        | { type: 'SET_PAGE', payload: { page: number, size: number } }
        | { type: 'RESET_FILTERS' };


    const filterReducer = (state: IAdFilterParams, action: FilterAction): IAdFilterParams => {
        switch (action.type) {
            case 'SET_FILTERS':
                return { ...state, ...action.payload, page: 0 };
            case 'SET_PAGE':
                return { ...state, ...action.payload };
            case 'RESET_FILTERS':
                return { page: 0, size: state.size };
            default:
                return state;
        }
    };
    
    const [filters, dispatch] = useReducer(filterReducer, { page: 0, size: 20 });

    const fetchAds = useCallback(async (currentFilters: IAdFilterParams) => {
        setLoading(true);
        try {
            const data = await adService.getAllAds(currentFilters);
            setAdsPage(data);
        } catch (error) {
            console.error("Error fetching ads", error);
            let message = 'Unknown error, try again later';
            if (error instanceof AxiosError) {
                const status = error.response?.status;
                console.log("STATUS", status)
                if (status === 429) {
                    message = "Too many requests, try again later"
                }
            }
            notificationApi.error({
                message: 'Error',
                description: message,
                placement: 'topRight',
                duration: 3,
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAds(filters);
    }, [filters]);

    const handleDelete = (id: number) => {
        console.log("asd")
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
                    fetchAds(filters);
                } catch (error) {
                    notificationApi.error({ message: 'Error deleting ad' });
                }
            },
        });
    };


    const handleTableChange = (pagination: any) => {
        dispatch({ type: 'SET_PAGE', payload: { page: pagination.current - 1, size: pagination.pageSize } });
    };

    const onFilterFinish = (values: any) => {
        const newFilters: IAdFilterParams = { page: 0, size: filters.size };

        for (const key in values) {
            const value = values[key];
            if (value !== null && value !== undefined && value !== '') {
                (newFilters as any)[key] = value;
            }
        }

        dispatch({ type: 'SET_FILTERS', payload: newFilters });
    };

    const resetFilters = () => {
        form.resetFields();
        dispatch({ type: 'RESET_FILTERS' });
    };

    const mobileColumns: ColumnsType<IAd> = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: IAd) => (
                <div>
                    <Typography.Text strong>{text}</Typography.Text>
                    <img src={record.imageUrl} alt={record.name} style={{ width: '100%', height: 'auto', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />
                </div>
            )
        },
        {
            title: 'Info',
            key: 'info',
            align: 'right',
            render: (_, record: IAd) => (
                <Space direction="vertical" align="end">
                    <Tag color={CATEGORY_COLOR_MAP[record.category] || 'default'}>
                        {record.category}
                    </Tag>
                    <p>Price: <strong> {record.price.toFixed(2)}</strong></p>
                    <strong>{record.city}</strong>
                    {(isAuthenticated && user?.username === record.seller.username) && (
                        <Space style={{ marginTop: '10px' }}>
                            <Tooltip title="Edit">
                                <Button
                                    size="large"
                                    icon={<EditOutlined />}
                                    onClick={(e) => { e.stopPropagation(); navigate(`/ads/edit/${record.id}`) }}
                                />
                            </Tooltip>
                            <Tooltip title="Delete">
                                <Button
                                    size="large"
                                    icon={<DeleteOutlined />}
                                    danger
                                    onClick={(e) => { e.stopPropagation(); handleDelete(record.id); }}
                                />
                            </Tooltip>
                        </Space>
                    )}
                </Space>
            )
        }
    ];

    const desktopColumns: ColumnsType<IAd> = [
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'image',
            render: (url: string, record: IAd) => <img src={url} alt={record.name} style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: '4px' }} />,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
        },
        {
            title: 'City',
            dataIndex: 'city',
            key: 'city',
        },
        {
            title: <div style={{ textAlign: 'center', width: '100%' }}>Price</div>,
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            width: 150,
            render: (price: number) => <strong>{price.toFixed(2) + ' RSD'}</strong>,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            align: 'center',
            render: (category: AdCategory) => (
                <Tag color={CATEGORY_COLOR_MAP[category] || 'default'}>
                    {category}
                </Tag>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: (_, record: IAd) => {
                if (isAuthenticated && user?.username === record.seller.username) {
                    return (
                        <Space size="middle">
                            <Tooltip title="Edit">
                                <Button shape="circle" icon={<EditOutlined />} onClick={(e) => { e.stopPropagation(); navigate(`/ads/edit/${record.id}`) }} />
                            </Tooltip>
                            <Tooltip title="Delete">
                                <Button shape="circle" icon={<DeleteOutlined />} danger onClick={(e) => { e.stopPropagation(); handleDelete(record.id); }} />
                            </Tooltip>
                        </Space>
                    );
                }
                return null;
            },
        },
    ];

    const columns = isMobile ? mobileColumns : desktopColumns;

    const containerStyle: React.CSSProperties = {
        marginTop: 80,
        marginLeft: isMobile ? 15 : 100,
        marginRight: isMobile ? 15 : 100,
    };

    return (
        <div style={containerStyle}>
            {notificationContextHolder}
            {modalContextHolder}
            <Card style={{ marginBottom: 24 }}>
                <Title level={2}>Filters</Title>
                <Form form={form} layout="vertical" onFinish={onFilterFinish}>
                    <Row gutter={16}>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item name="name" label="Name">
                                <Input placeholder="Search by name..." prefix={<SearchOutlined />} />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Form.Item name="category" label="Category">
                                <Select placeholder="Choose category" allowClear>
                                    {Object.values(AdCategory).map(cat => <Option key={cat} value={cat}>{cat}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4}>
                            <Form.Item name="minPrice" label="Min price">
                                <Input type="number" placeholder="min price" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12} md={8} lg={4}>
                            <Form.Item name="maxPrice" label="Max price">
                                <Input type="number" placeholder="max price" />
                            </Form.Item>
                        </Col>
                        {isAuthenticated && (
                            <Col xs={24} sm={12} md={8} lg={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <Form.Item name="showMineOnly" valuePropName="checked">
                                    <Checkbox>Show mine only</Checkbox>
                                </Form.Item>
                            </Col>
                        )}
                    </Row>
                    <Row justify="end">
                        <Space>
                            <Button icon={<ClearOutlined />} onClick={resetFilters}>Reset</Button>
                            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Apply filters</Button>
                        </Space>
                    </Row>
                </Form>
            </Card>

            <Table
                columns={columns}
                dataSource={adsPage?.content}
                rowKey="id"
                loading={loading}
                pagination={{
                    current: (adsPage?.number ?? 0) + 1,
                    pageSize: adsPage?.size,
                    total: adsPage?.totalElements,
                    position: ['bottomCenter']
                }}
                onChange={handleTableChange}
                onRow={(record) => ({
                    onClick: () => navigate(`/ads/${record.id}`),
                    style: { cursor: 'pointer' }
                })}
            />
        </div>
    );
};

export default HomePage;