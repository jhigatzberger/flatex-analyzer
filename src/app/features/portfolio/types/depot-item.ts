import { ParsedAccountTransaction } from "./account-transaction";
import { ParsedDepotTransaction } from "./depot-transaction";

export interface DepotItem {
  isin: string;
  name: string;
  relatedIsins: string[];
  depotTransactions: ParsedDepotTransaction[];
  accountTransactions: ParsedAccountTransaction[];
}
