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
import { useGitHubStars } from "../hooks/use-github-stars";
import GitHubIcon from "@mui/icons-material/GitHub";
import StarIcon from "@mui/icons-material/Star";
import FAQ from "./faq";

const REPO = "jhigatzberger/flatex-analyzer";

export default function LandingPageContent() {
  const stars = useGitHubStars(REPO);
  const theme = useTheme();

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Grid container spacing={4} justifyContent="center">
          <Grid size={{ lg: 6, xs: 12 }}>
            <Stack spacing={4} alignItems={{ lg: "start", sm: "center" }} textAlign={{ lg: "left", sm: "center" }}>
              <Typography variant="h3" component="h1" fontWeight="bold">
                Flatex Analyzer
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Analysiere deine Portfolio Performance. <br />Open Source und vollkommen
                kostenlos.
              </Typography>
              <Stack direction={"row"} spacing={2} mt={2}>
                <Button
                  variant="contained"
                  size="large"
                  color="secondary"
                  href="/dashboard"
                >
                  Dashboard
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  color="secondary"
                  startIcon={<GitHubIcon />}
                  href={`https://github.com/${REPO}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub{" "}
                  {stars !== null && (
                    <Stack direction="row" spacing={0.5} alignItems="center" ml={1}>
                      <StarIcon fontSize="small" />
                      <Typography variant="body2">{stars}</Typography>
                    </Stack>
                  )}
                </Button>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ lg: 6, xs: 12 }} >
            <div>
              <Image
                src={`/dashboard-screenshot_${theme.palette.mode}.webp`}
                width={2746}
                height={1454}
                style={{
                  borderColor: theme.palette.secondary.main
                }}
                className="border lg:scale-125 blur-gradient-bottom drop rounded-lg overflow-hidden rotate-z-12 rotate-x-[-25deg] rotate-y-[28deg]"
                alt="Screenshot des Dashboards"
              />
            </div>
          </Grid>
        </Grid>
        <FAQ />
      </Container>
    </Box>
  );
}
