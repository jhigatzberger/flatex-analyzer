import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Avatar,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { green, red, blue } from "@mui/material/colors";
import {
  NorthWest,
  SouthEast,
} from "@mui/icons-material";
import PriceHistoryChart from "./price-history-chart";
import dayjs from "dayjs";
import { Asset } from "../types/asset";

type RowType = {
  type: "buy" | "sell" | "dividend";
  date: Date;
  rate?: number;
  quantity?: number;
  value: number;
};

function AssetHistoryItem({ item }: { item: Asset }) {
  const buys: RowType[] = item.details.investment.transactions.map((tx) => ({
    type: "buy",
    date: new Date(tx.date),
    rate: tx.rate,
    quantity: tx.quantity,
    value: tx.rate * tx.quantity,
  }));

  const sells: RowType[] = item.details.realized.transactions.map((tx) => ({
    type: "sell",
    date: new Date(tx.date),
    rate: tx.rate,
    quantity: tx.quantity,
    value: tx.rate * tx.quantity,
  }));

  const dividends: RowType[] = item.details.dividends.dividends.map((div) => ({
    type: "dividend",
    date: new Date(div.date),
    value: div.value,
  }));

  const allRows: RowType[] = [...buys, ...sells, ...dividends].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );

  const renderTypeIcon = (type: RowType["type"]) => {
    const iconSize = 12;
    const avatarSize = 16;

    switch (type) {
      case "buy":
        return (
          <Avatar
            sx={{ bgcolor: green[500], width: avatarSize, height: avatarSize }}
          >
            <SouthEast
              sx={{ color: "white", width: iconSize, height: iconSize }}
            />
          </Avatar>
        );
      case "sell":
        return (
          <Avatar
            sx={{ bgcolor: red[500], width: avatarSize, height: avatarSize }}
          >
            <NorthWest
              sx={{ color: "white", width: iconSize, height: iconSize }}
            />
          </Avatar>
        );
      case "dividend":
        return (
          <Avatar
            sx={{ bgcolor: blue[500], width: avatarSize, height: avatarSize }}
          >
            <AttachMoneyIcon
              sx={{ color: "white", width: iconSize, height: iconSize }}
            />
          </Avatar>
        );
      default:
        return null;
    }
  };

  const investmentEvents = item.details.investment.transactions.map((t) => ({
    date: t.date,
    price: t.rate,
    type: "Buy",
  }));

  const realizedEvents = item.details.realized.transactions.map((t) => ({
    date: t.date,
    price: t.rate,
    type: "Sell",
  }));

  const dividendEvents = item.details.dividends.dividends.map((d) => ({
    date: d.date,
    type: "Dividend",
  }));

  return (
    <Box>
      <PriceHistoryChart
        priceHistory={item.priceHistory}
        keyEvents={[...investmentEvents, ...realizedEvents, ...dividendEvents]}
        colors={{
          Buy: green[500],
          Sell: red[500],
          Dividend: blue[500],
        }}
      />
      <TableContainer
        sx={{ maxHeight: 400, overflowY: "auto" }}
        component={Paper}
      >
        <Table stickyHeader aria-label="asset history table">
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Rate (EUR)</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Value (EUR)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    {renderTypeIcon(row.type)}
                    <Typography variant="caption" color="gray" component="span">
                      {row.type.charAt(0).toUpperCase() + row.type.slice(1)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{dayjs(row.date).format("DD.MM.YYYY")}</TableCell>
                <TableCell align="right">
                  {row.rate !== undefined ? row.rate.toFixed(2) : "-"}
                </TableCell>
                <TableCell align="right">
                  {row.quantity !== undefined ? row.quantity.toFixed(2) : "-"}
                </TableCell>
                <TableCell align="right">{row.value.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default AssetHistoryItem;
