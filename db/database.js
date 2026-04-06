import Dexie from "../lib/dexie.mjs";

export const db = new Dexie("FinanceDB");

db.version(1).stores({
  accounts: "++id, name, balance, icon, created_at, update_at, bg_clr, ic_clr",
  transactions:
    "++id, date, desc, status, from_account_id, to_account_id, amount,bg_clr, ic_clr, created_at, update_at",
});
