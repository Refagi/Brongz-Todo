import { useState } from 'react';
import { FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import styled from '@emotion/styled';
import '@/styles/Main.css'

const CustomOutlinedInput = styled(OutlinedInput)({
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "#6c757d",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#031d44", 
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "#001233", 
  },
  "& input": {
    color: "#001233",
  },
  "&.Mui-focused .MuiIconButton-root": {
    color: "#001233",
  },
})

const CustomInputLabel = styled(InputLabel)({
  color: "#6c757d",
  "&.Mui-focused": {
    color: "#001233",
  },
})

interface PasswordProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputPassword({ value, onChange }: PasswordProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <FormControl variant="outlined" required fullWidth>
      <CustomInputLabel htmlFor="outlined-adornment-password">Kata Sandi</CustomInputLabel>
      <CustomOutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              onMouseUp={handleMouseUpPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label="Kata Sandi"
      />
    </FormControl>
  );
}