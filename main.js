import { TransactionService } from "./services/transactionService.js";
import { db } from "./db/database.js";

async function init() {
  // await db.delete();
  // await db.open();  
  console.log("Accoung : ", await db.accounts.toArray());
  console.log("Transaction", await db.transactions.toArray());
}

init();
