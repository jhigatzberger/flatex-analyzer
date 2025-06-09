"use client";
import { orange } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        secondary: { main: orange[800] },
      },
    },
    dark: {
      palette: {
        mode: "dark",
        secondary: { main: orange[400] },
      },
    },
  },
  typography: {
    fontFamily: "var(--font-roboto)",
  },
});

export default theme;
