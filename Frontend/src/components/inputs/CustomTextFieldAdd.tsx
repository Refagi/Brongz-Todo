import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import '@/styles/Main.css';

const CustomTextFieldAdd = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#6c757d",
    },
    "&:hover fieldset": {
      borderColor: "#031d44",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#001233",
    },
  },
  "& .MuiInputBase-root": {
    backgroundColor: "#ffff",
  },
  "& .MuiInputLabel-root": {
    color: "#6c757d",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#001233",
  },
    "& .MuiInputBase-input": {
      fontSize: "12px", 
      padding: "8px",
    },
});

export default CustomTextFieldAdd;
