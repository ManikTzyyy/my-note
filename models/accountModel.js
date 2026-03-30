import { db } from "../db/database.js";

export const AccountModel = {
  create(data) {
    return db.accounts.add(data);
  },

  getAll() {
    return db.accounts.toArray();
  },

  update(id, data) {
    return db.accounts.update(id, data);
  },

  findById(id) {
    return db.accounts.get(id);
  },
};