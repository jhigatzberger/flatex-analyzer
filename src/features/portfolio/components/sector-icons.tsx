import MemoryIcon from "@mui/icons-material/Memory";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import FactoryIcon from "@mui/icons-material/Factory";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import RouterIcon from '@mui/icons-material/Router';
import ShieldIcon from '@mui/icons-material/Shield';
import BarChartIcon from '@mui/icons-material/BarChart';
import ForestIcon from '@mui/icons-material/Forest';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { Masks, SvgIconComponent } from "@mui/icons-material";

export const sectorIcons: Record<string, SvgIconComponent> = {
  "all-sectors": AllInclusiveIcon,
  technology: MemoryIcon,
  "financial-services": AccountBalanceIcon,
  "consumer-cyclical": ShoppingBasketIcon,
  healthcare: Masks,
  "communication-services": RouterIcon,
  industrials: FactoryIcon,
  "consumer-defensive": ShieldIcon,
  energy: LocalGasStationIcon,
  "basic-materials": ForestIcon,
  "real-estate": HomeWorkIcon,
  utilities: ElectricalServicesIcon,
  "ETF": BarChartIcon,
  "EQUITY": ShowChartIcon,
};
