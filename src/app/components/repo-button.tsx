import { Button, ButtonProps, LinkProps, Stack, Typography } from "@mui/material";
import { useGitHubStars } from "../hooks/use-github-stars";
import GitHubIcon from "@mui/icons-material/GitHub";
import StarIcon from "@mui/icons-material/Star";
import { AnchorHTMLAttributes } from "react";

const REPO = "jhigatzberger/flatex-analyzer";



export function RepoButton(props: AnchorHTMLAttributes<HTMLAnchorElement> & ButtonProps) {
    const stars = useGitHubStars(REPO);
    return <Button
        variant="outlined"
        size="large"
        color="secondary"
        startIcon={<GitHubIcon />}
        href={`https://github.com/${REPO}`}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
    >
        GitHub{" "}
        {stars !== null && (
            <Stack direction="row" spacing={0.5} alignItems="center" ml={1}>
                <StarIcon fontSize="small" />
                <Typography variant="body2">{stars}</Typography>
            </Stack>
        )}
    </Button>
}