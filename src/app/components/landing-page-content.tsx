"use client";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import { useGitHubStars } from "../hooks/use-github-stars";
import GitHubIcon from "@mui/icons-material/GitHub";
import StarIcon from "@mui/icons-material/Star";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReactPlayer from "react-player";
import FAQ from "./faq";

const REPO = "jhigatzberger/flatex-analyzer";

export default function LandingPageContent() {
  const stars = useGitHubStars(REPO);

  return (
    <Box sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Stack spacing={4} alignItems="center">
          <Typography variant="h3" component="h1" fontWeight="bold">
            Flatex Depot Analyzer
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Analysiere deine Portfolio Performance. Open Source und vollkommen
            kostenlos.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
            <Button
              variant="contained"
              size="large"
              color="secondary"
              href="/dashboard"
            >
              Start direkt im Browser
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

          <FAQ />
        </Stack>
      </Container>
    </Box>
  );
}
