import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#333",
    },
    secondary: {
      main: "#ff7043",
    },
  },
  typography: {
    h6: {
      fontWeight: 500,
    },
  },
});

export default theme;