import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login, Register, SendVerifyEmail, VerifyEmail } from '@/pages/auth/index';
import AuthLayout from '@/layouts/AuthLayout';
import ProtectedRoute from './middlewares/ProtecRoute';
import Task from './pages/main/Task';
import { ThemeProvider } from '@/context/ThemeContext';
import '@/styles/App.css';
import '@/styles/Main.css'

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AuthLayout/>}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/send-verification-email" element={<SendVerifyEmail />} />
              <Route path="/v1/auth/verify-email" element={<VerifyEmail />} />
          </Route>

         <Route element={<ProtectedRoute/>}>
           <Route path='/' element={<Task/>}/>
         </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;