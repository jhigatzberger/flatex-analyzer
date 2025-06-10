'use client';

import React from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, useTheme, useColorScheme } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import Link from 'next/link';

export function Header() {
    const theme = useTheme();
    const { mode, setMode } = useColorScheme();

    const handleChange = (
        _: React.MouseEvent<HTMLElement>,
        newMode: 'light' | 'dark' | null
    ) => {
        if (newMode !== null) {
            setMode(newMode);
        }
    };

    return (
        <Box
            component="header"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
                py: 1,
                px: 2,
                bgcolor: theme.palette.background.paper,
                borderBottom: `1px solid ${theme.palette.divider}`,
            }}
        >
            <Link href="/" style={{ textDecoration: 'none', color: theme.palette.text.primary, display: 'flex', alignItems: 'center' }}>
                <AnalyticsIcon fontSize="large" color='secondary' />
                <Typography variant="h6" color="text.primary">
                    Flatex Analyzer
                </Typography>
            </Link>

            <ToggleButtonGroup
                value={mode}
                exclusive
                onChange={handleChange}
                size="small"
                aria-label="theme mode"
                color="secondary"
            >
                <ToggleButton value="light" aria-label="light mode">
                    <LightModeIcon />
                </ToggleButton>
                <ToggleButton value="dark" aria-label="dark mode">
                    <DarkModeIcon />
                </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    );
}
