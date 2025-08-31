import { useState } from "react";
import api from "@/services/apiAuth";
import InputPassword from "@/components/inputs/InputPassword";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Typography, Box, Stack, CircularProgress } from '@mui/material';
import CustomTextField from "@/components/inputs/CustomTextField";

type RegisterInputs = {
  username: string;
  email: string;
  password: string;
};

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ username, email, password });
  };

  const onSubmit = async (data: RegisterInputs) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/auth/register", data);

      if (response.status === 201) {
        navigate("/send-verification-email");
      } else {
        throw new Error("Token Not Found!");
      }
    } catch (error: unknown) {
      console.error("Register Error:", error);

      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Failed to Register, Please try again"
        );
        return
      } else {
        setErrorMessage("Failed to Login, Please try again");
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="registerForm"
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
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 1, fontSize: { xs: '1.5rem', sm: '1.8rem' }, color: 'var(--primary-color)' }}>
          Create Your Brongz-Todo account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: 'var(--primary-color)' }}>
          Sign up to continue
        </Typography>
      </Box>

      {errorMessage && (
        <Typography color="error" sx={{ mb: 2, fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
          {errorMessage}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '80%' }}>
        <Stack spacing={2}>
          <CustomTextField
            fullWidth
            id="outlined-basic username"
            label="Username"
            variant="outlined"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <CustomTextField
            fullWidth
            id="outlined-basic email"
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <InputPassword value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            fullWidth
            sx={{ bgcolor: '#031d44', '&:hover': { bgcolor: '#001233' }, textTransform: 'none' }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : 'Sign up'}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: '#6c757d' }}>
              Already have an account?{' '}
              <Button
                variant="text"
                color="primary"
                sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.9rem' }, color: '#001233' }}
                aria-label="Create new account"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}