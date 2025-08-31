import { useState, useContext } from "react";
import { Box, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TaskContext from "@/context/TaskContext";
import Notification from "../elements/ActionButtons";
import "@/styles/Main.css";
import api from "@/services/api";

interface Task {
  id: string;
  title: string;
  task: string;
  dueDate: string;
  isCompleted: boolean;
  isImportant: boolean;
}

const SearchTask = () => {
  const { setTasks, getAllTasks } = useContext(TaskContext)!;
  const [searchQuery, setSearchQuery] = useState("");
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "error",
  });

  const handleSearch = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim();
    setSearchQuery(value);

    try {
      if (value === "") {
        getAllTasks();
        return;
      }

      const response = await api.get(
        `/tasks?title=${encodeURIComponent(value)}`
      );

      const result = await response.data;
      if (!response.status || !result.data || result.data.length === 0) {
        setTasks([]);
        return;
      }

      setTasks(result.data.tasks as Task[]);
    } catch (error) {
      console.error("Search Error:", error);
      setNotification({
        open: true,
        message: "Internal server error!",
        severity: "error",
      });
      setTasks([]);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false, message: "" });
  };

  return (
    <>
      <Box
        sx={{
          minWidthwidth: "150px",
          display: "flex",
          alignItems: "center",
          bgcolor: "var(--base-variant)",
          borderRadius: "20px",
          padding: "7px",
        }}
      >
        <SearchIcon sx={{ color: "#6c757d" }} />
        <TextField
          variant="standard"
          placeholder="Search on task..."
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            disableUnderline: true,
            sx: {
              bgcolor: "transparent",
              color: "var(--accent-color)",
            },
          }}
          sx={{ flexGrow: 1 }}
        />
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
    </>
  );
};

export default SearchTask;
