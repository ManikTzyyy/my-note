import { db } from "../db/database.js";

export const TransactionModel = {
  create(data) {
    return db.transactions.add(data);
  },

  getAll() {
    return db.transactions.toArray();
  },
};