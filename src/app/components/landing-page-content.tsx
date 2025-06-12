"use client";

import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Image from "next/image";
import FAQ from "./faq";
import { ArrowForward } from "@mui/icons-material";
import InfoBox from "./info-box";

export default function LandingPageContent() {
  const theme = useTheme();

  return (
    <Box sx={{ py: { xs: 4, md: 12 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          <Grid size={{ lg: 7, xs: 12 }}>
            <Stack
              spacing={4}
              alignItems={{ lg: "start", xs: "center" }}
              textAlign={{ lg: "left", xs: "center" }}
            >
              <Typography
                sx={{
                  typography: {
                    lg: { fontSize: 60, fontWeight: "bold", lineHeight: 1 },
                    xs: { fontSize: 32, fontWeight: "bold", lineHeight: 1 },
                  },
                }}
                component="h1"
              >
                Mach dein Flatex Portfolio übersichtlich
              </Typography>
              <Typography
                sx={{
                  typography: {
                    lg: { fontSize: 20, fontWeight: 500 },
                    xs: { fontSize: 16, fontWeight: 500 },
                  },
                }}
                color="text.secondary"
              >
                Behalte deine Portfolio Performance, trotz Dividenden und
                Trades, im Blick. Open Source und vollkommen kostenlos.
              </Typography>
              <Stack direction={"row"} spacing={{ lg: 2, xs: 1 }} mt={2}>
                <Button
                  variant="outlined"
                  size="large"
                  color="secondary"
                  href="/demo"
                >
                  Ausprobieren
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  href="/dashboard"
                  endIcon={<ArrowForward fontSize="small" />}
                >
                  Loslegen
                </Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ lg: 5, xs: 12 }}>
            <Image
              src={`/dashboard-screenshot_${theme.palette.mode}.webp`}
              width={2746}
              height={1454}
              style={{
                borderColor: theme.palette.secondary.main,
              }}
              className="lg:scale-125 lg:mt-6 border blur-gradient-bottom drop rounded-lg overflow-hidden rotate-z-12 rotate-x-[-25deg] rotate-y-[28deg]"
              alt="Screenshot des Dashboards"
            />
          </Grid>
        </Grid>
        <InfoBox text="Die Flatex Umsatzhistorie beginnt ab 2020. Solltest du ein älteres Depot haben, kannst du die vollständige Historie vom Support unter info@flatex.at anfragen. Du kannst auch die unvollständige Historie hineinladen, es kann dann aber zu falschen Auswertungen führen." />
        <FAQ />
      </Container>
    </Box>
  );
}
