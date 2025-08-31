import { Box, Typography } from '@mui/material';

export default function SideBar() {

  return (
    <Box
      className="sidebar"
      sx={{
        boxShadow: '0 0 15px rgba(0,0,0,0.5)',
        bgcolor: '#031d44',
        color: 'aliceblue',
        p: { xs: 2, sm: 4 },
        width: { xs: '100%', sm: '100%' },
        minHeight: '100%',
        maxWidth: '1000px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        boxSizing: 'border-box',
        borderTopRightRadius: 5,
        borderBottomRightRadius: 5
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontSize: { xs: '1.2rem', sm: '1.5rem' } }}>
        "Sederhanakan manajemen tugas dengan Brongz-Todo"
      </Typography>
    </Box>
  );
}