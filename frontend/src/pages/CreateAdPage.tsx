import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import AdForm from '../components/AdForm';
import adService, { IAdFormData } from '../services/ad.service';

const CreateAdPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [notificationApi, notificationContextHolder] = notification.useNotification();

    const handleCreateAd = async (data: IAdFormData) => {
        setIsLoading(true);
        try {
            const newAd = await adService.createAd(data);
            notificationApi.success({ message: 'Ad created successfully' });
            setTimeout(() => navigate(`/ads/${newAd.id}`), 1000);
        } catch (error) {
            notificationApi.error({ message: 'Error creating ad' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {notificationContextHolder}
            <AdForm mode="create" onSubmit={handleCreateAd} isLoading={isLoading} />
        </>
    );
};

export default CreateAdPage;