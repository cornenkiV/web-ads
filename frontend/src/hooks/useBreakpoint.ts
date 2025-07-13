import { useState, useEffect } from 'react';
import { Grid } from 'antd';

const { useBreakpoint: useAntdBreakpoint } = Grid;

const useBreakpoint = () => {
    const screens = useAntdBreakpoint();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(!screens.md);
    }, [screens]);

    return isMobile;
};

export default useBreakpoint;