import {
  Avatar,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { sectorIcons } from "./sector-icons";
import { useState } from "react";
import AssetHistoryItem from "./asset-history";
import ValueTypography from "./value-typography";
import { Asset } from "../types/asset";

export function LazyContent({
  checkValue,
  width = 100,
  children,
}: {
  checkValue: unknown;
  width?: number | string;
  children: React.ReactNode | null | undefined;
}) {
  if (checkValue === null || checkValue === undefined) {
    return <Skeleton animation={false} variant="text" width={width} />;
  }
  return <> {children} </>;
}

export function DepotItemCard({ item }: { item: Asset }) {
  const [open, setOpen] = useState(false);
  const currentValue = item.currentPositionValue;

  const netProfit =
    currentValue !== null
      ? item.details.dividends.totalValue +
        item.details.realized.totalValue +
        currentValue -
        item.details.investment.totalValue
      : null;

  const sectorIconKey =
    item.tickerData?.sectorKey || item.tickerData?.quoteType;
  const SectorIcon = sectorIcons[sectorIconKey];

  const sectorName = item.tickerData?.sectorDisp || item.tickerData?.quoteType;

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{item.name}</DialogTitle>
        <AssetHistoryItem item={item} />
      </Dialog>
      <Card
        sx={{
          height: "100%",
          cursor: "pointer",
          transition: "0.3s",
          "&:hover": { boxShadow: 6, opacity: 1 },
          opacity: item.details.quantity <= 0 ? 0.5 : 1,
        }}
        onClick={() => {
          setOpen(item.priceHistory !== null);
          console.log(item);
        }}
      >
        <CardContent sx={{}}>
          <Stack spacing={1}>
            {/* Icon + Title */}
            <Stack direction="column" alignItems="start">
              <Stack
                width={"100%"}
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent={"space-between"}
              >
                <Typography
                  textAlign={"right"}
                  variant="caption"
                  color="text.secondary"
                >
                  <LazyContent checkValue={sectorName}>
                    {sectorName}
                  </LazyContent>
                </Typography>
                {SectorIcon && (
                  <SectorIcon
                    fontSize="medium"
                    color={netProfit > 0 ? "info" : "error"}
                  />
                )}
                {!SectorIcon && (
                  <Skeleton
                    animation={false}
                    variant="circular"
                    width={24}
                    height={24}
                  />
                )}
              </Stack>
              <Stack
                width={"100%"}
                direction="row"
                spacing={1}
                alignItems="space-between"
                justifyContent={"space-between"}
              >
                <Typography variant="body1" component="h3" fontWeight={"bold"}>
                  {item.name}
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ mb: 1 }} />

            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Invested:
              </Typography>
              <ValueTypography variant="body2">
                {item.details.investment.totalValue.toFixed(2)} €
              </ValueTypography>
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Dividend Yield:
              </Typography>
              <ValueTypography variant="body2">
                {item.details.dividends.totalValue.toFixed(2)} €
              </ValueTypography>
            </Stack>

            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Realised Gains:
              </Typography>
              <ValueTypography variant="body2">
                {item.details.realized.totalValue.toFixed(2)} €
              </ValueTypography>
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Current Position:
              </Typography>
              <Stack direction="column" alignItems="end">
                <Typography
                  className="flex gap-2"
                  variant="body2"
                  color="text.secondary"
                >
                  <ValueTypography>
                    {item.details.quantity.toFixed(2)}
                  </ValueTypography>{" "}
                  x
                  <LazyContent width={20} checkValue={item.currentEuroPrice}>
                    {item?.currentEuroPrice?.toFixed(2)} €
                  </LazyContent>
                </Typography>
                <Typography variant="body2" color="text">
                  <LazyContent checkValue={currentValue}>
                    <ValueTypography>
                      {currentValue?.toFixed(2)} €
                    </ValueTypography>
                  </LazyContent>
                </Typography>
              </Stack>
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Net Profit:
              </Typography>
              <Stack direction="column" alignItems="end">
                <Typography variant="body2">
                  <LazyContent checkValue={netProfit}>
                    <ValueTypography>{netProfit?.toFixed(2)} €</ValueTypography>
                  </LazyContent>
                </Typography>
                <Typography
                  color={netProfit > 0 ? "info" : "error"}
                  variant="body1"
                  fontWeight="bold"
                >
                  <LazyContent checkValue={netProfit}>
                    {(
                      (netProfit / item.details.investment.totalValue) *
                      100
                    ).toFixed(2)}
                    %
                  </LazyContent>
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </>
  );
}
