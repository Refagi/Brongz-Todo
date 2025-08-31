import { useState } from "react";
import api from "@/services/apiAuth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function SendVerifyEmail() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const onClick = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await api.post("/auth/send-verification-email");
      const tokens = response.data?.tokens;

      if (tokens) {
        setSuccessMessage(`${response.data.message}`);
        // navigate("/verify-email");
      } else {
        throw new Error("Token Not Found!");
      }
    } catch (error: unknown) {
      console.error("Send Verification Error:", error);

      if (axios.isAxiosError(error)) {
        setErrorMessage(
          error.response?.data?.message ||
            "Failed to Send Verification, Please try again"
        );
      } else {
        setErrorMessage("Failed to Send Verification, Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="sendVerifForm"
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
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/login')}
        sx={{
          color: "text.primary",
          textTransform: "none",
          fontSize: { xs: "0.8rem", sm: "0.9rem" },
        }}
      >
        Kembali
      </Button>
      <Box sx={{ mb: 2, textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{ mb: 1, fontSize: { xs: "1.5rem", sm: "1.8rem" }, color: 'var(--primary-color)' }}
        >
          Verification your Email
        </Typography>
        <Typography
          variant="body2"
          sx={{ fontSize: { xs: "0.8rem", sm: "0.875rem" }, color: 'var(--primary-color)' }}
        >
          Enter To verification your email
        </Typography>
      </Box>

      {errorMessage && (
        <Typography
          color="error"
          sx={{ mb: 2, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
        >
          {errorMessage}
        </Typography>
      )}

      {successMessage && (
        <Typography
          color="success"
          sx={{ mb: 2, fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
        >
          {successMessage}
        </Typography>
      )}
      <Button
        type="button"
        variant="contained"
        disabled={loading}
        fullWidth
        sx={{ bgcolor: '#031d44', '&:hover': { bgcolor: '#001233' }, textTransform: 'none' }}
        onClick={onClick}
      >
        {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Send"}
      </Button>
    </Box>
  );
}
