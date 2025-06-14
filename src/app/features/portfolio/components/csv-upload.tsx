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
        transition: "all 0.3s ease",
        width: "100%",
        backgroundColor: alpha(palette.primary.main, 0.1), 
        "&:hover": {
          backgroundColor: alpha(palette.primary.main, 0.2),
        },
      }}
      borderRadius={2}
      border={`${palette.primary.main} 1px dashed`}
    >
      <input {...getInputProps()} />
      <FileUpload color="primary" sx={{ fontSize: 40 }} />
      <Typography variant="body2" color="primary" mt={2}>
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
