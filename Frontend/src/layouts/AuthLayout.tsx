import { Outlet } from 'react-router-dom';
import SideBar from '@/components/elements/SideBar';
import { Container } from '@mui/material';
import '@/styles/App.css'

const AuthLayout = () => {
  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 0,
      }}
    >
      <div className="containerLogin">
        <Outlet />
        <SideBar />
      </div>
    </Container>
  );
};

export default AuthLayout;