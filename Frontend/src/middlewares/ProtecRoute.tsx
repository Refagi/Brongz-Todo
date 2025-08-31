import { useEffect, useState } from 'react';
import { Navigate, Outlet} from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import axios from 'axios';
import api from '@/services/api';


const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      try {
        const response = await api.get('/auth/protectAuth');
        console.log('ProtectAuth response:', response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Token verification error:', error);
        if (axios.isAxiosError(error)) {
          console.error('Error details:', error.response?.data);
        }
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    setTimeout(checkAuth, 3000);
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
