const body = document.querySelector("#body");
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
};
