"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Drawer,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { RepoButton } from "./repo-button";
import { ColorModeToggle } from "./color-mode-toggle";

export function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 1,
        }}
      >
        <Link
          href="/"
          style={{
            gap: 2,
            textDecoration: "none",
            color: theme.palette.text.primary,
            display: "flex",
            alignItems: "center",
          }}
        >
          <AnalyticsIcon fontSize="medium" color="secondary" />
          <Typography variant="body1" color="text.primary">
            Flatex Analyzer
          </Typography>
        </Link>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        <ListItem>
          <RepoButton fullWidth />
        </ListItem>
        <ListItem>
          <ColorModeToggle fullWidth />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="header"
      sx={{
        py: 1,
        px: 2,
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Link
        href="/"
        style={{
          gap: 2,
          textDecoration: "none",
          color: theme.palette.text.primary,
          display: "flex",
          alignItems: "center",
        }}
      >
        <AnalyticsIcon fontSize="large" color="secondary" />
        <Typography variant="h6" color="text.primary">
          Flatex Analyzer
        </Typography>
      </Link>
      <Box sx={{ flexGrow: 1 }} />

      {isMobile ? (
        <>
          <IconButton
            aria-label="open drawer"
            onClick={toggleDrawer(true)}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            {drawerContent}
          </Drawer>
        </>
      ) : (
        <Box sx={{ display: "flex", gap: 2 }}>
          <RepoButton />
          <ColorModeToggle />
        </Box>
      )}
    </Box>
  );
}
