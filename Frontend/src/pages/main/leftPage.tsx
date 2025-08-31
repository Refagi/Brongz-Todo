import { useContext, useState } from "react";
import ThemeContext from "@/context/ThemeContext";
import TaskContext from "@/context/TaskContext";
import Notification from "@/components/elements/ActionButtons";
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "@/styles/Main.css";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";
import api from "@/services/api";
import axios from "axios";

const LeftPage = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { getAllTasks } = useContext(TaskContext)!;
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const navigate = useNavigate();
  const username = localStorage.getItem("username");
  const userId = localStorage.getItem("userId");

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false, message: '' });
  };

  const handleLogout = async () => {
    setLoadingLogout(true);
    setNotification({ ...notification, open: false, message: '' });
    try {
      const response = await api.post('/auth/logout');
      setNotification({
        open: true,
        message: response.data.message || 'Logout successful!',
        severity: 'success',
      });
      localStorage.clear();
      navigate("/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "Logout failed");
      } else {
        setErrorMessage("Unexpected error occurred");
      }
      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setLoadingLogout(false);
    }
  };

  const handleDeleteAllTasks = async () => {
    setLoadingDelete(true);
    setNotification({ ...notification, open: false, message: '' });
    try {
      const response = await api.delete(`/tasks/deletedAll/${userId}`);
      getAllTasks();
      setNotification({
        open: true,
        message: response.data.message || 'Delete all successful!',
        severity: 'success',
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "Delete All Task failed");
      } else {
        setErrorMessage("Unexpected error occurred");
      }
      setNotification({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <Box
      sx={{
        width: '15%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        textAlign: 'center',
        minHeight: '100vh',
      }}
    >
       <Box component="header">
        <Box sx={{ padding: "10px" }} className="textUsername">
          <Typography variant="h6">HI, {username}</Typography>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Typography variant="h6">
            {darkMode ? "Darkmode" : "Lightmode"}
          </Typography>
          <IconButton
            id="theme-switch"
            onClick={toggleDarkMode}
            sx={{
              height: "30px",
              width: "30px",
              minWidth: "30px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
            }}
          >
            {darkMode ? (
              <Brightness7Icon sx={{ color: "var(--text-color)" }} />
            ) : (
              <Brightness4Icon sx={{ color: "var(--text-color)" }} />
            )}
          </IconButton>
        </Box>
      </Box>


      <Box
        component="footer"
        sx={{
          position: "fixed",
          bottom: "10px",
          width: "12%",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Button
          variant="contained"
          disabled={loadingDelete}
          startIcon={<DeleteIcon />}
          onClick={handleDeleteAllTasks}
          sx={{
            backgroundColor: "var(--primary-color)",
            color: "var(--property-color)",
            borderRadius: "10px",
            padding: "5px",
            textTransform: "none",
          }}
        >
          {loadingDelete ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Delete All"
          )}
        </Button>
        <Button
          variant="contained"
          disabled={loadingLogout}
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            backgroundColor: "var(--property-color)",
            color: "var(--base-variant)",
            borderRadius: "10px",
            padding: "5px",
            textTransform: "none",
          }}
        >
          {loadingLogout ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            "Logout"
          )}
        </Button>
      </Box>

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
        vertical="bottom"
        horizontal="center"
        autoHideDuration={6000}
      />
    </Box>
  );
};

export default LeftPage;
