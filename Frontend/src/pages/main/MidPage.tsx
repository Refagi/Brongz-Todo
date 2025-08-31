import { useContext, useState } from 'react';
// import ThemeContext  from '@/context/ThemeContext';
import AddTask from '@/components/inputs/AddTask';
import { Box, Button, Typography} from '@mui/material';
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import TaskContext from '@/context/TaskContext';
import BodyTask from '@/components/elements/BodyTask';
import Notification from '@/components/elements/ActionButtons';
import SearchTask from '@/components/elements/SearchTask';
import '@/styles/Main.css'

const MidPage = () => {
  // const { darkMode } = useContext(ThemeContext);
  const { tasks, loading, getAllTasks } = useContext(TaskContext)!;
  const [openAddTask, setOpenAddTask] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false, message: '' });
  };

  const handleAddTask = () => {
    setOpenAddTask(true);
  };

  const handleTaskAdded = async () => {
    getAllTasks();
    setNotification({
      open: true,
      message: 'Task added successfully!',
      severity: 'success',
    });
  };

  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box
      sx={{
        width: '70%',
        borderLeft: '1px solid var(--border-color)',
        borderRight: '1px solid var(--border-color)',
        minHeight: '100vh',
        bgcolor: 'var(--base-color)',
      }}
    >
      <Box component="header">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            padding: '10px',
          }}
        >

          <Box sx={{display: 'flex', justifyContent: 'space-between', width: '500px', alignItems: 'center'}}>
          <SearchTask/>
          <Typography
            sx={{
              minWidth: '200px',
              textAlign: 'center',
              color: 'var(--accent-color)',
            }}
          >
            {currentDate}
          </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<NoteAddIcon />}
            onClick={handleAddTask}
            sx={{
              bgcolor: 'var(--primary-color)',
              color: 'var(--secondary-text)',
              borderRadius: '20px',
              padding: '10px 20px',
              minWidth: '200px',
              textTransform: 'none',
            }}
          >
            Add New Task
          </Button>
          <AddTask open={openAddTask} onClose={() => setOpenAddTask(false)} onTaskAdded={handleTaskAdded}/>
        </Box>
      </Box>

      {/* Main */}
      <Box component="main">
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            padding: '20px',
            height: '100%',
          }}
        >
        {loading ? (
            <Typography>Loading...</Typography>
          ) : tasks.length === 0 ? (
            <Typography sx={{ color: '#d62828' }}>No tasks yet...</Typography>
          ) : (
            tasks.map((task) => (
              <BodyTask
                key={task.id}
                id={task.id}
                title={task.title}
                description={task.task}
                dueDate={task.dueDate}
                isCompleted={task.isCompleted}
                isImportant={task.isImportant}
              />
            ))
          )}
        </Box>
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

export default MidPage;