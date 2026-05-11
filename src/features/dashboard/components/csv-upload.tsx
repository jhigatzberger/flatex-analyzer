"use client";

import React, { useCallback } from "react";
import Papa from "papaparse";
import { useDropzone } from "react-dropzone";
import { Box, Typography, Alert, alpha } from "@mui/material";
import { Check, FileUpload } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

interface CsvDropzoneUploaderProps {
  onParsed: (data: unknown[], filename: string) => void;
}

export default function CsvDropzoneUploader({
  onParsed,
}: CsvDropzoneUploaderProps) {
  const [loadedFiles, setLoadedFiles] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState<string[]>([]);

  const theme = useTheme();
  const { palette } = theme;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const csvFiles = acceptedFiles.filter((f) => f.name.endsWith(".csv"));
      if (!csvFiles.length) {
        setErrors(["Please upload valid .csv files."]);
        return;
      }

      setErrors([]);

      csvFiles.forEach((file) => {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.errors.length) {
              setErrors((prev) => [...prev, `Error parsing ${file.name}.`]);
              console.error(results.errors);
            } else {
              setLoadedFiles((prev) =>
                prev.includes(file.name) ? prev : [...prev, file.name]
              );
              onParsed(results.data, file.name);
            }
          },
        });
      });
    },
    [onParsed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "text/csv": [".csv"] },
    multiple: true,
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
        height: "100%",
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
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
      {loadedFiles.length > 0 && (
        <Box mt={2} textAlign="left" width="100%">
          {loadedFiles.map((name) => (
            <Box key={name} display="flex" alignItems="center" gap={1}>
              <Check fontSize="small" color="success" />
              <Typography variant="caption" noWrap>{name}</Typography>
            </Box>
          ))}
        </Box>
      )}
      {errors.map((err, i) => (
        <Alert key={i} severity="error" sx={{ mt: 1 }}>
          {err}
        </Alert>
      ))}
    </Box>
  );
}
