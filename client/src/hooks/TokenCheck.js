import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function TokenCheck() {
    const navigate = useNavigate();

    useEffect(() => {
        checkTokenStatus();
        const intervalId = setInterval(checkTokenStatus, 60000); // 60000 milliseconds = 1 minute
        return () => clearInterval(intervalId);
    }, [navigate]);

    const checkTokenStatus = () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken || isTokenExpired(storedToken)) navigate('/login');
    };

    const isTokenExpired = (token) => {
        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            return decodedToken.exp < Date.now() / 1000;
        } catch (error) {
            console.error('Error decoding token:', error);
            return true;
        }
    };

}

export default TokenCheck;