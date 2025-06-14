import { useColorScheme, ToggleButtonGroup, ToggleButton } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

export function ColorModeToggle(props: React.ComponentProps<typeof ToggleButtonGroup>) {
    const { mode, setMode } = useColorScheme();

    const handleChange = (
        _: React.MouseEvent<HTMLElement>,
        newMode: 'light' | 'dark' | null
    ) => {
        if (newMode !== null) {
            setMode(newMode);
        }
    };
    return <ToggleButtonGroup
        {...props}
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
}