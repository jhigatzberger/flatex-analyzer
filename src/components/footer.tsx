'use client';

import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import Link from 'next/link';

export function Footer() {

    const theme = useTheme();

    return (
        <Box
            component="footer"
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
            sx={(theme) => ({
                mt: 'auto',
                py: 1,
                px: 2,
                bgcolor: theme.palette.background.paper,
                borderTop: `1px solid ${theme.palette.divider}`,
            })}
        >
            <Link href="/impressum" className="text-sm hover:underline">
                <Typography variant="body2" color="text.secondary" align="center">
                    Impressum
                </Typography>
            </Link>
            <Link href="https://www.linkedin.com/in/jhigatzberger" className="text-sm hover:underline">
                <Typography variant="body2" color="text.secondary" align="center">
                    © {new Date().getFullYear()} Johannes Higatzberger
                </Typography>
            </Link>
            {theme.palette.mode === "light" && <a href="https://www.yahoo.com/?ilc=401" target="_blank"> <img src="https://poweredby.yahoo.com/poweredby_yahoo_h_purple.png" width="134" height="20" /> </a>}
            {theme.palette.mode === "dark" && <a href="https://www.yahoo.com/?ilc=401" target="_blank"> <img src="https://poweredby.yahoo.com/poweredby_yahoo_h_white.png" width="134" height="20" /> </a>}
        </Box>
    );
};