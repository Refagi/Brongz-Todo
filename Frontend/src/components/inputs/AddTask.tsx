import { useContext, useState } from "react";
import ThemeContext from "@/context/ThemeContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Checkbox,
  FormControlLabel,
  Button,
  IconButton,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import CustomTextFieldAdd from "./CustomTextFieldAdd";
import CloseIcon from "@mui/icons-material/Close";
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Notification from "../elements/ActionButtons";
import api from "@/services/api";
import axios from "axios";

interface TaskData {
  title: string;
  dueDate: string;
  task: string;
  isCompleted: boolean;
  isImportant: boolean;
}

interface AddTaskProps {
  open: boolean;
  onClose: () => void;
  onTaskAdded: () => void;
}

const AddTask = ({ open, onClose, onTaskAdded }: AddTaskProps) => {
  const { darkMode } = useContext(ThemeContext);
  const [taskData, setTaskData] = useState<TaskData>({
    title: "",
    task: "",
    dueDate: "",
    isCompleted: false,
    isImportant: false,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });
  const userId = localStorage.getItem("userId");

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false, message: "" });
  };

  // Handler untuk submit form
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!userId) {
      setErrorMessage("User ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(`/tasks/${userId}`, taskData);
      setNotification({
        open: true,
        message: response.data.message || "Create add successful!",
        severity: "success",
      });
      setTaskData({
        title: "",
        dueDate: "",
        task: "",
        isCompleted: false,
        isImportant: false,
      });
      onTaskAdded();
      onClose();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "Failed to add task.");
      } else {
        setErrorMessage("Unexpected error occurred.");
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

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            bgcolor: darkMode ? "var(--secondary-text)" : "var(--base-variant)",
            color: darkMode ? "var(--primary-color)" : "var(--text-color)",
            borderRadius: "20px",
            padding: "20px",
            width: "35%",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transform: "translate(-50%, -50%) scale(1.25)",
            position: "absolute",
            top: "45%",
            left: "50%",
          },
        }}
        BackdropProps={{
          sx: {
            bgcolor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 0,
          }}
        >
          <Typography variant="h6" component='span'>Add Task</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box
          component="hr"
          sx={{ borderColor: "var(--accent-color)", mb: 1 }}
        />
        <DialogContent sx={{ p: 0 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                variant="body2"
                sx={{
                  mb: "5px",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                }}
              >
                Title
              </Typography>
              <CustomTextFieldAdd
                fullWidth
                id="outlined-basic title"
                variant="outlined"
                type="text"
                placeholder="Todo list"
                value={taskData.title}
                onChange={(e) =>
                  setTaskData({ ...taskData, title: e.target.value })
                }
                required
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                variant="body2"
                sx={{
                  mb: "5px",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                }}
              >
                Date
              </Typography>
              <CustomTextFieldAdd
                type="date"
                id="outlined-basic date"
                value={taskData.dueDate}
                onChange={(e) =>
                  setTaskData({ ...taskData, dueDate: e.target.value })
                }
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
              />
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography
                variant="body2"
                sx={{
                  mb: "5px",
                  fontSize: "14px",
                  color: "var(--text-primary)",
                }}
              >
                Description
              </Typography>
              <CustomTextFieldAdd
                placeholder="Add your description here..."
                value={taskData.task}
                onChange={(e) =>
                  setTaskData({ ...taskData, task: e.target.value })
                }
                multiline
                rows={2}
                fullWidth
                required
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                ml: '5px'
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                  icon={<CircleOutlinedIcon/>}
                  checkedIcon={<CheckCircleIcon/>}
                    checked={taskData.isImportant}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        isImportant: e.target.checked,
                      })
                    }
                    sx={{ "& .MuiSvgIcon-root": { fontSize: "12px" }, "&.Mui-checked": { color: "#06d6a0" } }}
                  />
                }
                label="Mark as important"
              />
              <FormControlLabel
                control={
                  <Checkbox
                   icon={<CircleOutlinedIcon/>}
                   checkedIcon={<CheckCircleIcon/>}
                    checked={taskData.isCompleted}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
                        isCompleted: e.target.checked,
                      })
                    }
                    sx={{ "& .MuiSvgIcon-root": { fontSize: "12px" }, "&.Mui-checked": { color: "#06d6a0" } }}
                  />
                }
                label="Mark as completed"
              />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
                sx={{
                  bgcolor: "#031d44",
                  "&:hover": { bgcolor: "#001233" },
                  textTransform: "none",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Add Task"
                )}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

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

export default AddTask;
