import React from 'react';
import { Form, Input, Button, Select, InputNumber, Card, Typography, Row, Col, Image, Divider } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { IAd, AdCategory } from '../types';
import { IAdFormData } from '../services/ad.service';

const { Title } = Typography;
const { Option } = Select;

interface AdFormProps {
    mode: 'create' | 'edit';
    initialData?: IAd;
    onSubmit: (data: IAdFormData) => Promise<void>;
    isLoading: boolean;
}

const AdForm: React.FC<AdFormProps> = ({ mode, initialData, onSubmit, isLoading }) => {
    const { control, handleSubmit, formState: { errors }, watch } = useForm<IAdFormData>({
        defaultValues: initialData || {
            name: '',
            description: '',
            imageUrl: '',
            price: undefined,
            category: undefined,
            city: '',
        },
    });

    const imageUrlValue = watch('imageUrl');

    return (
        <Row justify="center"  style={{ marginTop: 80 }}>
            <Col xs={24} md={20} lg={18}>
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <Card>
                        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>
                            {mode === 'create' ? 'Create New Ad' : 'Edit Ad'}
                        </Title>
                        
                        <Row gutter={24}>
                            <Col xs={24} md={12}>
                                <Form.Item label="Ad Name" required validateStatus={errors.name ? 'error' : ''} help={errors.name?.message}>
                                    <Controller name="name" control={control} rules={{ required: 'Name is required' }} render={({ field }) => <Input {...field} />} />
                                </Form.Item>
                                
                                <Row gutter={16}>
                                    <Col xs={24} sm={12}>
                                        <Form.Item label="Category" required validateStatus={errors.category ? 'error' : ''} help={errors.category?.message}>
                                            <Controller name="category" control={control} rules={{ required: 'Category is required' }} render={({ field }) => (
                                                <Select {...field} placeholder="Choose category">
                                                    {Object.values(AdCategory).map(cat => <Option key={cat} value={cat}>{cat}</Option>)}
                                                </Select>
                                            )} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <Form.Item label="City" required validateStatus={errors.city ? 'error' : ''} help={errors.city?.message}>
                                            <Controller name="city" control={control} rules={{ required: 'City is required' }} render={({ field }) => <Input {...field} />} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                
                                <Form.Item label="Price (RSD)" required validateStatus={errors.price ? 'error' : ''} help={errors.price?.message}>
                                    <Controller name="price" control={control} rules={{ required: 'Price is required', min: { value: 0, message: 'Price cant be negative number' } }} render={({ field }) => <InputNumber {...field} style={{ width: '100%' }} placeholder="price (RSD)" />} />
                                </Form.Item>

                                <Form.Item label="Image URL" validateStatus={errors.imageUrl ? 'error' : ''} help={errors.imageUrl?.message}>
                                    <Controller name="imageUrl" control={control} render={({ field }) => <Input {...field} placeholder="https://..."/>} />
                                </Form.Item>
                                
                                <Form.Item label="Description" required validateStatus={errors.description ? 'error' : ''} help={errors.description?.message}>
                                    <Controller name="description" control={control} rules={{ required: 'Description is required' }} render={({ field }) => <Input.TextArea {...field} rows={6} />} />
                                </Form.Item>
                            </Col>
                            
                            <Col xs={24} md={12}>
                                <Typography.Text>Image preview</Typography.Text>
                                <div style={{ marginTop: 8, padding: '16px', border: '1px dashed #d9d9d9', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Image
                                        width="100%"
                                        height="auto"
                                        src={imageUrlValue}
                                        alt="Image preview"
                                        style={{ maxHeight: 400, objectFit: 'contain' }}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Divider />

                        <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
                            <Button type="primary" htmlType="submit" loading={isLoading} size="large">
                                {mode === 'create' ? 'Create Ad' : 'Save Ad'}
                            </Button>
                        </Form.Item>
                    </Card>
                </Form>
            </Col>
        </Row>
    );
};

export default AdForm;