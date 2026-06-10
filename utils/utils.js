import { AccountModel } from "../models/accountModel.js";
import { TransactionModel } from "../models/transactionModel.js";
const body = document.querySelector("#body");

const menuBtn = document.getElementById("menu-btn") || null
const menuDiv = document.getElementById("menu-div") || null

if (menuBtn == null || menuDiv == null) {

} else {
  menuBtn.addEventListener("click", () => {
    menuDiv.classList.remove("hidden")
  })

  document.addEventListener("click", (e) => {
    if (
      !menuDiv.contains(e.target) &&
      !menuBtn.contains(e.target)

    ) {

      menuDiv.classList.add("hidden");
    }
  });
}



export const myUtils = {
  inputValidator(input) {
    if (!input.value) {
      input.classList.add("border-red-500");
      return true;
    } else {
      return false;
    }
  },
  removeErrorInput(input) {
    input.addEventListener("input", () => {
      input.classList.remove("border-red-500");
    });
  },

  isBodyOverflow() {
    body.classList.toggle("overflow-hidden");
  },

  formatedValue(input) {
    input.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      const formatted = new Intl.NumberFormat("id-ID").format(value);
      e.target.value = formatted;
    });
  },

  resetInput(input, number) {
    if (number) {
      input.value = 0;
    } else {
      input.value = "";
    }
  },

  updateCardBalance(id, newBalance) {
    const el = document.getElementById(`balance-${id}`);
    if (!el) return;
    el.textContent = this.formatMoney(newBalance);
  },

  formatDate(date) {
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  },

  formatMoney(value) {
    return new Intl.NumberFormat("id-ID").format(value);
  },

  getAllWithAcc(trcData, accData) {
    const accMap = Object.fromEntries(accData.map((a) => [a.id, a]));
    return trcData.map((trx) => ({
      ...trx,
      acc_from: accMap[trx.from_account_id],
      acc_to: accMap[trx.to_account_id],
    }));
  },

  getTrcWithAcc(trc, acc, isIncome) {
    return {
      ...trc,
      acc_from: !isIncome ? acc : null,
      acc_to: isIncome ? acc : null,
    };
  },

  getTrcWithAccTrf(trc, accfrom, accto) {
    return {
      ...trc,
      acc_from: accfrom,
      acc_to: accto,
    };
  },

  async exportData() {
    // const dataToExp = {
    //   acc: (await AccountModel.getAll()).map(
    //     ({ bg_clr, ic_clr, ...acc }) => acc
    //   ),

    //   trc: (await TransactionModel.getAll()).map(
    //     ({ bg_from, clr_from, bg_to, clr_to, ...trc }) => trc
    //   ),
    // };
    // export full
    const dataToExp = {
      acc: await AccountModel.getAll(),
      trc: await TransactionModel.getAll()
    };

    return dataToExp;
  },

  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  },

  extractDataToChart(array) {
    const grouped = {}
    array.forEach((trc) => {
      if (!["in", "ex"].includes(trc.status)) return;

      if (!grouped[trc.date]) {
        grouped[trc.date] = {
          date: trc.date,
          income: 0,
          expense: 0,
        };
      }

      if (trc.status === "in") {
        grouped[trc.date].income += trc.amount;
      }

      if (trc.status === "ex") {
        grouped[trc.date].expense += trc.amount;
      }
    });

    const chartData = Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    return chartData
  },

  extractCashFlow(array) {
    let balance = 0
    return array.map(item => {
      balance += item.income;
      balance -= item.expense;

      return {
        date: item.date,
        balance,
      };
    });
  }

};
