import { Box, Typography, Switch } from "@mui/material";
import { useShowValues } from "../hooks/use-show-values";

export function ShowValuesToggle() {
  const { showValues, setShowValues } = useShowValues();
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography variant="body2" color="text.primary">
        Beträge anzeigen
      </Typography>
      <Switch value={showValues} defaultChecked onChange={e => setShowValues(e.target.checked)} />
    </Box>
  );
}