import { AccountModel } from "../models/accountModel.js";

export const accountServices = {
  async createAccount(name, balance = 0, icon = "") {
    return AccountModel.create({
      name,
      balance,
      icon,
      created_at: new Date(),
    });
  },

  async delete(id) {
    return AccountModel.delete(id);
  },
};
