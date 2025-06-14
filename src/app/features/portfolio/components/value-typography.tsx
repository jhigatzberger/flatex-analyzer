import React from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import { useShowValues } from "../hooks/use-show-values";

type ValueTypographyProps = TypographyProps & {
    placeholder?: React.ReactNode;
};

const ValueTypography: React.FC<ValueTypographyProps> = ({
    placeholder = "•••••",
    children,
    ...typographyProps
}) => {
    const { showValues } = useShowValues();

    return (
        <Typography component={"span"} {...typographyProps}>
            {showValues ? children : placeholder}
        </Typography>
    );
};

export default ValueTypography;
