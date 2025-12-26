// lib/theme.ts
import { createTheme } from "@mui/material/styles";

import "@fontsource/rubik/500.css";
import "@fontsource/rubik/700.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1AB87A",
    },
    secondary: {
      main: "#1976D2",
    },
    background: {
      default: "#F7F9FA",
    },
    text: {
      primary: "#1A1A1A",
    },
  },
  typography: {
    fontFamily: `"Inter", "Helvetica", "Arial", sans-serif`,
    h1: { fontFamily: `"Rubik", "Inter", sans-serif`, fontWeight: 700 },
    h2: { fontFamily: `"Rubik", "Inter", sans-serif`, fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
});

export default theme;
