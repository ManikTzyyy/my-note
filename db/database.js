import Dexie from "../lib/dexie.mjs";

export const db = new Dexie("FinanceDB");

db.version(1).stores({
  accounts: "++id, name, balance, icon, created_at",
  transactions:
    "++id, date, desc, status, from_account_id, to_account_id, amount, created_at",
});