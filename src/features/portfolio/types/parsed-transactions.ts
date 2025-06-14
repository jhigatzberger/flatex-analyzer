import { ParsedAccountTransaction } from "./account-transaction";
import { ParsedDepotTransaction } from "./depot-transaction";

export interface ParsedTransactions {
    depotTransactions: ParsedDepotTransaction[];
    accountTransactions: ParsedAccountTransaction[];
}