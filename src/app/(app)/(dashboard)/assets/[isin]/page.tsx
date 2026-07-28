"use client";

import AssetHistoryItem from "@/features/dashboard/components/asset-history";
import { useDepot } from "@/features/dashboard/hooks/use-depot";
import { useParams } from "next/navigation";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import { PreserveSearchParamsLink } from "@/components/preserve-search-params-link";

export default function AssetPage() {
  const params = useParams();
  const isin = params.isin as string;
  const { assets } = useDepot();
  if (!assets) return null;
  const asset = assets.find((a) => a.isin === isin);
  if (!asset) return null;

  return (
    <Box sx={{ p: 2, width: "100%" }}>
      <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
        <PreserveSearchParamsLink href="/assets" passHref>
          <Typography color="inherit" sx={{ textDecoration: "none" }}>
            Assets
          </Typography>
        </PreserveSearchParamsLink>
        <Typography color="text.primary">
          {asset.name || asset.isin}
        </Typography>
      </Breadcrumbs>
      <AssetHistoryItem item={asset} />
    </Box>
  );
}
