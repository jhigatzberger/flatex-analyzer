"use client";

import React, { useCallback } from "react";
import Papa from "papaparse";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Alert, Snackbar, alpha } from "@mui/material";
import { Check, FileUpload } from "@mui/icons-material";
import { blue, grey, orange } from "@mui/material/colors";
import { useTheme } from "@mui/material/styles";

interface CsvDropzoneUploaderProps {
  onParsed: (data: unknown[]) => void;
}

export default function CsvDropzoneUploader({
  onParsed,
}: CsvDropzoneUploaderProps) {
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const theme = useTheme();
  const { palette } = theme;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file || !file.name.endsWith(".csv")) {
        setError("Please upload a valid .csv file.");
        return;
      }

      setFileName(file.name);
      setError(null);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length) {
            setError("Error parsing CSV.");
            console.error(results.errors);
          } else {
            onParsed(results.data);
          }
        },
      });
    },
    [onParsed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: false,
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        padding: 4,
        textAlign: "center",
        cursor: "pointer",
        backdropFilter: "blur(20px)",
        transition: "all 0.3s ease",
        width: "100%",
        "&:hover": {
          backdropFilter: "blur(10px)", // less blur
          borderColor: palette.primary.dark, // darker border
        },
      }}
      borderRadius={2}
      border={`${palette.primary.light} 1px dashed`}
    >
      <input {...getInputProps()} />
      <FileUpload sx={{ fontSize: 40, color: "text.primary" }} />
      <Typography variant="body2" color="text.primary" mt={2}>
        {isDragActive
          ? "CSVs ablegen..."
          : "CSVs per Drag & Drop oder Klick laden"}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}
