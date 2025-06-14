// components/TransparentInfoBox.tsx
import React from "react";
import { alpha, Box, Typography, useTheme } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export default function InfoBox({ text }: { text: string }) {
  
  const theme = useTheme();
  const mainColor = alpha(theme.palette.secondary.main, 0.1);
  const borderColor = alpha(theme.palette.secondary.main, 0.5);
  return (
    <Box
      display="flex"
      alignItems="center"
      bgcolor={mainColor} // light transparent orange
      border={`1px solid ${borderColor}`} // soft orange border
      borderRadius={2}
      px={2}
      py={1.5}
      my={2}
    >
      <InfoIcon color="secondary" sx={{ mr: 1 }} />
      <Typography variant="body2" color="secondary">
        {text}
      </Typography>
    </Box>
  );
}
