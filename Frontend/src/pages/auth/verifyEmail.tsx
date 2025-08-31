import { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import api from '@/services/apiAuth';
import axios from 'axios';

export default function VerifyEmail() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      setStatus('loading');

      try {
        const response = await api.get(`/auth/verify-email`);
        setStatus('success');
        setMessage(response.data.message || 'Success Verification Email!');
      } catch (error: unknown) {
        console.error('Verification Error:', error);
        setStatus('error');
        if (axios.isAxiosError(error)) {
          setMessage(error.response?.data?.message || 'Failed to Verification Email, Please try again');
        } else {
          setMessage('Failed to Verification Email, Please try again');
        }
      }
    };

    verify();
  }, []);


  return (
    <Box
      sx={{
        boxShadow: '0 0 15px rgba(0,0,0,0.5)',
        bgcolor: 'var(--form-color)',
        p: { xs: 2, sm: 4 },
        width: { xs: '100%', sm: '100%' },
        minHeight: '100%',
        maxWidth: 700,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box',
        borderTopLeftRadius: 5,
        borderBottomLeftRadius: 5
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h5" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '1.8rem' } }}>
          Verifikasi Email
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}
        >
          {status === 'loading' && 'Memverifikasi email Anda...'}
          {status === 'success' && message}
          {status === 'error' && message}
        </Typography>
      </Box>

      {status === 'loading' && <CircularProgress sx={{ my: 2 }} />}

      {(status === 'success' || status === 'error')}
    </Box>
  );
}
