import { useState } from "react";
import api from "@/services/apiAuth";
import InputPassword from "@/components/inputs/InputPassword";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Typography, Box, Stack, CircularProgress } from '@mui/material';
import CustomTextField from "@/components/inputs/CustomTextField";

type LoginInputs = {
  email: string;
  password: string;
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  const onSubmit = async (data: LoginInputs) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/auth/login", data);
      const tokens = response.data?.tokens;
      const userData = response.data?.data;

      if (tokens?.access && tokens?.refresh) {
        localStorage.setItem("username", userData.username);
        localStorage.setItem("userId", userData.id);
        navigate("/");
      } else {
        throw new Error("Token Not Found!");
      }
    } catch (error: unknown) {
      console.error("Login Error:", error);

      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message || "Failed to Login, Please try again"
        );
      } else {
        setErrorMessage("Failed to Login, Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="loginForm"
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
          Welcome Back to Brongz-Todo
        </Typography>
        <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: 'var(--primary-color)' }}>
          Enter your email and password to continue.
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
            id="outlined-basic"
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
            {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : 'Sign in'}
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, color: '#6c757d' }}>
              Don't have an account?
              <Button
                variant="text"
                sx={{ textTransform: 'none', fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '0.9rem' }, color: '#001233' }}
                aria-label="Create new account"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </Button>
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}