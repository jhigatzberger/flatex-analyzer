
import { Stats } from "../components/stats";
import { DepotProvider } from "../hooks/use-depot";
import depotData from "../../../data/dummy_depotumsaetze.json"
import accountData from "../../../data/dummy_kontoumsaetze.json";
import { handleParseDepotTransactionData } from "../types/depot-transaction";
import { handleParseAccountTransactionData } from "../types/account-transaction";

export default function DemoPage() {
    const parsedDepotTransactions = handleParseDepotTransactionData(depotData);
    const parsedAccountTransactions = handleParseAccountTransactionData(accountData);
    console.log("Parsed Depot Transactions:", parsedDepotTransactions);
    console.log("Parsed Account Transactions:", parsedAccountTransactions);
    return (
        <DepotProvider
            accountTransactions={parsedAccountTransactions}
            depotTransactions={parsedDepotTransactions}
        >
            <Stats />
        </DepotProvider>
    );
}