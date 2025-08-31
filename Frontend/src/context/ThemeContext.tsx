import { createContext, useState, useEffect, type ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider  } from '@mui/material';
import '@/styles/App.css';
import '@/styles/Main.css'

const theme = createTheme({
  typography: {
    fontFamily: "'Montserrat', 'Nunito', 'Oswald', 'Caprasimo', sans-serif",
  },
});

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  toggleDarkMode: () => {},
});

export function ThemeProvider ({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('darkmode') === 'active';
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('darkmode', newMode ? 'active' : 'null');
      return newMode;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('darkmode');
    } else {
      document.body.classList.remove('darkmode');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeContext;