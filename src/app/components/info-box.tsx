// components/TransparentInfoBox.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

export default function InfoBox({ text }: { text: string }) {
  return (
    <Box
      display="flex"
      alignItems="center"
      bgcolor="rgba(255, 165, 0, 0.1)" // light transparent orange
      border={`1px solid rgba(255, 165, 0, 0.5)`} // soft orange border
      borderRadius={2}
      px={2}
      py={1.5}
      my={2}
    >
      <InfoIcon sx={{ color: "orange", mr: 1 }} />
      <Typography variant="body2" color="orange">
        {text}
      </Typography>
    </Box>
  );
}
