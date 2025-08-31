import { useContext } from 'react';
// import ThemeContext from '@/context/ThemeContext';
import TaskContext from '@/context/TaskContext';
import { Box, Button, Typography, List, ListItem } from '@mui/material';

const RightPage = () => {
  // const { darkMode } = useContext(ThemeContext);
  const { activeFilter, setActiveFilter, getAllTasks } = useContext(TaskContext)!;

  const handleFilterClick = (filter: 'all' | 'important' | 'completed' | 'uncompleted') => {
    setActiveFilter(filter);
    getAllTasks(filter);
  };

  return (
    <Box
      sx={{
        width: '18%',
        minHeight: '100vh',
        bgcolor: 'var(--base-color)',
      }}
    >
      <Box component="header">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: '10px',
          }}
        >
          <Typography variant="h5">
            Brongz-Todo
          </Typography>
        </Box>
      </Box>

      <Box component="main">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            mt: '5px',
          }}
        >
          <List>
            <ListItem>
              <Button
                fullWidth
                onClick={() => handleFilterClick('all')}
                sx={{
                  bgcolor: activeFilter === 'all' ? 'transparent' : 'var(--base-color)',
                  color: activeFilter === 'all' ? 'var(--property-color)' : 'var(--text-color)',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                }}
              >
                All Task
              </Button>
            </ListItem>
            <ListItem>
              <Button
                fullWidth
                onClick={() => handleFilterClick('important')}
                sx={{
                  bgcolor: activeFilter === 'important' ? 'transparent' : 'var(--base-color)',
                  color: activeFilter === 'important' ? 'var(--property-color)' : 'var(--text-color)',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                }}
              >
                Important Task
              </Button>
            </ListItem>
            <ListItem>
              <Button
                fullWidth
                onClick={() => handleFilterClick('completed')}
                sx={{
                  bgcolor: activeFilter === 'completed' ? 'transparent' : 'var(--base-color)',
                  color: activeFilter === 'completed' ? 'var(--property-color)' : 'var(--text-color)',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                }}
              >
                Completed Task
              </Button>
            </ListItem>
            <ListItem>
              <Button
                fullWidth
                onClick={() => handleFilterClick('uncompleted')}
                sx={{
                  bgcolor: activeFilter === 'uncompleted' ? 'transparent' : 'var(--base-color)',
                  color: activeFilter === 'uncompleted' ? 'var(--property-color)' : 'var(--text-color)',
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                }}
              >
                Uncompleted Task
              </Button>
            </ListItem>
          </List>
        </Box>
      </Box>
    </Box>
  );
};

export default RightPage;