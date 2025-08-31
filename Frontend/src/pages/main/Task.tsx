import LeftPage from "./leftPage";
import MidPage from "./MidPage";
import RightPage from './RightPage';
import { TaskProvider } from "@/context/TaskContext";
import '@/styles/Main.css';
import { Box } from "@mui/material";


export default function Task() {

  return (
     <TaskProvider>
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'flex-start',
          bgcolor: 'var(--base-color)',
          width: '100%',
        }}
      >
        <LeftPage />
        <MidPage />
        <RightPage />
      </Box>
     </TaskProvider>
  );
}
