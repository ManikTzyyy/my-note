import {AccountModel} from "../models/accountModel.js"
import { TransactionModel } from "../models/transactionModel.js";

export const TransactionService = {
  async createAccount(name, balance = 0, icon = "") {
    return AccountModel.create({
      name,
      balance,
      icon,
      created_at: new Date(),
    });
  },

  async addIncome({ to_account_id, amount, desc }) {
    await TransactionModel.create({
      date: new Date(),
      desc,
      status: "income",
      from_account_id: null,
      to_account_id,
      amount,
      created_at: new Date(),
    });

    const acc = await db.accounts.get(to_account_id);

    await db.accounts.update(to_account_id, {
      balance: acc.balance + amount,
    });
  },

  async addExpense({ from_account_id, amount, desc }) {
    await TransactionModel.create({
      date: new Date(),
      desc,
      status: "expense",
      from_account_id,
      to_account_id: null,
      amount,
      created_at: new Date(),
    });

    const acc = await db.accounts.get(from_account_id);

    await db.accounts.update(from_account_id, {
      balance: acc.balance - amount,
    });
  },

  async transfer({ from_account_id, to_account_id, amount, desc }) {
    await TransactionModel.create({
      date: new Date(),
      desc,
      status: "transfer",
      from_account_id,
      to_account_id,
      amount,
      created_at: new Date(),
    });

    const fromAcc = await db.accounts.get(from_account_id);
    const toAcc = await db.accounts.get(to_account_id);

    await db.accounts.update(from_account_id, {
      balance: fromAcc.balance - amount,
    });

    await db.accounts.update(to_account_id, {
      balance: toAcc.balance + amount,
    });
  },
};