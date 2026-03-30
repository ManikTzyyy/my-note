import { TransactionService } from "./services/transactionService.js";
import { db } from "./db/database.js";

async function init() {
  // await db.delete();
  // await db.open();  


  // const cashId = await TransactionService.createAccount("Cash", 100000);

  // // test income
  // await TransactionService.addIncome({
  //   to_account_id: cashId,
  //   amount: 50000,
  //   desc: "Gaji",
  // });


  console.log("Accoung : ", await db.accounts.toArray());
  console.log("Transaction", await db.transactions.toArray());
}

init();
lucide.createIcons();