import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { notification, Spin, Alert } from 'antd';
import AdForm from '../components/AdForm';
import adService, { IAdFormData } from '../services/ad.service';
import { IAd } from '../types';

const EditAdPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const [initialData, setInitialData] = useState<IAd | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const [notificationApi, notificationContextHolder] = notification.useNotification();

    useEffect(() => {
        if (!id) return;
        adService.getAdById(id)
            .then(data => setInitialData(data))
            .catch(() => setError('Couldnt load ad data'));
    }, [id]);

    const handleUpdateAd = async (data: IAdFormData) => {
        if (!id) return;
        setIsLoading(true);
        try {
            await adService.updateAd(id, data);
            notificationApi.success({ message: 'Ad edited successfully' });
            setTimeout(() => navigate(`/ads/${id}`), 1000);
        } catch (error) {
            notificationApi.error({ message: 'Error editing ad' });
        } finally {
            setIsLoading(false);
        }
    };

    if (error) return <Alert  style={{ marginTop: 80 }} message="Error" description={error} type="error" />;
    if (!initialData) return <div style={{ textAlign: 'center', padding: '50px', marginTop: 80 }}><Spin size="large" /></div>;

    return (
        <>
            {notificationContextHolder}
            <AdForm mode="edit" initialData={initialData} onSubmit={handleUpdateAd} isLoading={isLoading} />
        </>
    );
};

export default EditAdPage;