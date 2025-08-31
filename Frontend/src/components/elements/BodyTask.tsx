import { useState, useContext } from "react";
import { Box, Typography, Button, Divider } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import api from "@/services/api";
import Notification from "./ActionButtons";
import TaskContext from "@/context/TaskContext";
import EditTask from "../inputs/EditTask";
import axios from "axios";

interface BodyTaskProps {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  isCompleted: boolean;
  isImportant: boolean;
}

const BodyTask = ({
  id,
  title,
  description,
  dueDate,
  isCompleted,
  isImportant,
}: BodyTaskProps) => {
  const { getAllTasks } = useContext(TaskContext)!;
  const [loading, setLoading] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false, message: "" });
  };

  const handleDeleteTask = async () => {
    setLoading(true);
    setNotification({ ...notification, open: false, message: "" });
    try {
      await api.delete(`/tasks/${id}`);
      setNotification({
        open: true,
        message: "Task deleted successfully!",
        severity: "success",
      });
      getAllTasks();
    } catch (error: unknown) {
      let errorMessage = "Failed to delete task.";
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message || "Failed to delete task.";
      }
      setNotification({
        open: true,
        message: errorMessage,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = () => {
    setEditOpen(true);
  };

  const handleTaskUpdated = () => {
    getAllTasks();
    setEditOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          bgcolor: "var(--primary-color)",
          borderRadius: "15px",
          padding: "20px",
          width: "250px",
          height: "200px",
          color: "var(--secondary-text)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
          <Typography variant="h6" sx={{ fontSize: "18px", mb: "5px" }}>
            {title}
          </Typography>
          <Typography
             sx={{
              fontSize: "15px",
              color: "var(--base-variant)",
              // display: "-webkit-box",
              // WebkitLineClamp: 3,
              // WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxHeight: "60px",
            }}>
            {description}
          </Typography>
        </Box>
        <Divider sx={{bgcolor: 'var(--base-variant)'}}/>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            fontSize: "14px",
            mb: "5px",
            mt: '5px'
          }}
        >
          <Typography>{dueDate}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: "0px" }}>
            <Button disabled sx={{ minWidth: "auto", color: "var(--secondary-text)"}}>
              {isCompleted ? (
                <CheckCircleIcon style={{ color: "#06d6a0" }} />
              ) : (
                <CheckCircleOutlineIcon style={{ color: "#ffd166" }} />
              )}
            </Button>
            <Button
              disabled
              sx={{ minWidth: "auto", color: "var(--secondary-text)" }}>
              {isImportant ? (
                <FavoriteIcon style={{ color: "#d62828" }} />
              ) : (
                <FavoriteBorderIcon style={{ color: "#d62828" }}/>
              )}
            </Button>
            <Button
              sx={{ minWidth: "auto", color: "var(--secondary-text)" }} onClick={handleEditTask}>
              <EditIcon />
            </Button>
            <Button
              sx={{ minWidth: "auto", color: "var(--secondary-text)" }}
              onClick={handleDeleteTask}
              disabled={loading}
            >
              <DeleteIcon />
            </Button>
          </Box>
        </Box>
      </Box>

      <EditTask
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onTaskUpdated={handleTaskUpdated}
        task={{ id, title, task: description, dueDate, isCompleted, isImportant }}
      />

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={handleCloseNotification}
        vertical="bottom"
        horizontal="center"
        autoHideDuration={6000}
      />
    </>
  );
};

export default BodyTask;
