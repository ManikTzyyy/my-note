import { TransactionService } from "./services/transactionService.js";
import { db } from "./db/database.js";
import { render } from "./utils/render.js";

async function init() {
  const containerAcc = document.getElementById("container-accounts");
  // await db.delete();
  // await db.open();

  // const cashId = await TransactionService.createAccount("Cash", 100000);

  // // test income
  // await TransactionService.addIncome({
  //   to_account_id: cashId,
  //   amount: 50000,
  //   desc: "Gaji",
  // });

  render.initAccCard(await db.accounts.toArray(), containerAcc, false);
  lucide.createIcons();

  console.log("Account : ", await db.accounts.toArray());
  console.log("Transaction", await db.transactions.toArray());
}

init();
