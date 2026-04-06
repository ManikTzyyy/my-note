import { db } from "../db/database.js";
import { TransactionModel } from "../models/transactionModel.js";

export const TransactionService = {
  async createTrc(
    date,
    desc,
    from_account_id,
    to_account_id,
    amount,
    bg_clr,
    ic_clr,
    isIncome
  ) {
    let status = isIncome ? "in" : "ex";
    let id = isIncome ? to_account_id : from_account_id;

    const acc = await db.accounts.get(id);

    if (isIncome) {
      await db.accounts.update(id, {
        balance: acc.balance + amount,
      });
    } else {
      await db.accounts.update(id, {
        balance: acc.balance - amount,
      });
    }

    return await TransactionModel.create({
      date: date,
      desc: desc,
      status: status,
      from_account_id: isIncome ? null : from_account_id,
      to_account_id: isIncome ? to_account_id : null,
      amount: amount,
      bg_clr: bg_clr,
      ic_clr: ic_clr,
      created_at: new Date(),
    });
  },

  async getAll() {
    return await TransactionModel.getAll();
  },

  async delete(id, acc_id, amount, isIncome) {
    const acc = await db.accounts.get(acc_id);
    if (!acc) {
      return await TransactionModel.delete(id);
    }

    if (isIncome) {
      await db.accounts.update(acc_id, {
        balance: acc.balance - amount,
      });
    } else {
      await db.accounts.update(acc_id, {
        balance: acc.balance + amount,
      });
    }
    return await TransactionModel.delete(id);
  },

  async findById(id) {
    return await TransactionModel.findById(id);
  },
};
