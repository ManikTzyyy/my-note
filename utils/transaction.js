import { myUtils } from "./utils.js";
import { TransactionService } from "../services/transactionService.js";
import { render } from "./render.js";
import { accountServices } from "../services/accountService.js";

document.addEventListener("DOMContentLoaded", () => {
  const statusPopup = document.getElementById("statusPopup");
  const addTrcPop = document.getElementById("trc-popup");
  const btnClsTrc = document.getElementById("close-pop-up-trc");
  const boxTrc = document.getElementById("acc-ref-inp");
  const dateTrcInput = document.getElementById("trnc-date");
  const amountTrcInput = document.getElementById("trc-value");
  const descTrcInput = document.getElementById("trnc-desc");
  const containerTbl = document.getElementById("trc-body");

  const btnSaveTrc = document.getElementById("btn-save-trc");

  const valuetrcIn = document.getElementById("trc-value");
  myUtils.formatedValue(valuetrcIn);

  let isIncome = null;

  document.addEventListener("click", async (e) => {
    const btnInc = e.target.closest("#btn-inc");
    const btnExp = e.target.closest("#btn-expense");

    const btnDltTrc = e.target.closest("#btn-delete-trc");

    if (btnInc) {
      isIncome = await openTrcPopUp(true);
    } else if (btnExp) {
      isIncome = await openTrcPopUp(false);
    }

    if (btnDltTrc) {
      const idTrc = Number(btnDltTrc.dataset.trc);

      const data = await TransactionService.findById(idTrc);

      let idAccToEdit =
        data.status == "in" ? data.to_account_id : data.from_account_id;

      let type = data.status == "in" ? true : false;

      Swal.fire({
        title: `Delete this Trancation?`,
        icon: "warning",
        confirmButtonText: "Yes!",
        showCancelButton: true,
      }).then(async (res) => {
        if (res.isConfirmed) {
          await TransactionService.delete(
            idTrc,
            idAccToEdit,
            data.amount,
            type
          );

          const acc = await accountServices.findById(idAccToEdit);
          if (acc) {
            myUtils.updateCardBalance(idAccToEdit, acc.balance);
          }
          btnDltTrc.closest(".table-row")?.remove();
        }
      });
    }
  });

  btnSaveTrc.addEventListener("click", async () => {
    const amountTrcRaw = amountTrcInput.value;
    const dateTrcValue = dateTrcInput.value;
    const amountTrcValue = Number(amountTrcRaw.replace(/\./g, ""));
    const descTrcValue = descTrcInput.value;
    const accIdInputTo = document.getElementById("acc-ref-to");
    const accIdInputfrom = document.getElementById("acc-ref-from");
    const accIDTo = Number(accIdInputTo.value);
    const accIDfrom = Number(accIdInputfrom.value);
    const errorDesc = myUtils.inputValidator(descTrcInput);
    const errorDate = myUtils.inputValidator(dateTrcInput);
    const errorAccTo = myUtils.inputValidator(accIdInputTo);
    const errorAccFrom = myUtils.inputValidator(accIdInputfrom);
    if (errorDesc || errorDate || errorAccFrom || errorAccTo) {
      return;
    }

    try {
      const acc = await accountServices.findById(
        isIncome ? accIDTo : accIDfrom
      );

      const res = await TransactionService.createTrc(
        dateTrcValue,
        descTrcValue,
        accIDfrom,
        accIDTo,
        amountTrcValue,
        acc.bg_clr,
        acc.ic_clr,
        isIncome
      );

      const createObj = await myUtils.getTrcWithAcc(res, acc, isIncome);
      btnSaveTrc.disabled = true;

      render.initTrcRow(createObj, containerTbl, true);
    } catch (error) {
      console.log(error);
    } finally {
      const acc = await accountServices.findById(
        isIncome ? accIDTo : accIDfrom
      );

      myUtils.updateCardBalance(acc.id, acc.balance);
      btnSaveTrc.disabled = false;
      myUtils.isBodyOverflow(false);
      myUtils.resetInput(dateTrcInput, false);
      myUtils.resetInput(descTrcInput, false);
      myUtils.resetInput(amountTrcInput, true);
      addTrcPop.classList.add("hidden");
    }
  });

  btnClsTrc.addEventListener("click", () => {
    addTrcPop.classList.add("hidden");
    myUtils.isBodyOverflow(false);
  });

  myUtils.removeErrorInput(dateTrcInput);
  myUtils.removeErrorInput(descTrcInput);

  const openTrcPopUp = async (isIncome) => {
    const accList = await accountServices.getAll();
    addTrcPop.classList.remove("hidden");
    myUtils.isBodyOverflow(true);
    stsPOP(isIncome, statusPopup);
    inputTrc(isIncome, boxTrc, accList);
    myUtils.resetInput(dateTrcInput, false);
    myUtils.resetInput(descTrcInput, false);
    myUtils.resetInput(amountTrcInput, true);
    return isIncome;
  };
});

const stsPOP = (isIncome, element) => {
  const txt = isIncome ? "income" : "Expense";
  const icon = isIncome ? "arrow-up" : "arrow-down";
  const bgclr = isIncome ? "bg-green-100" : "bg-red-100";
  const clr = isIncome ? "text-green-800" : "text-red-800";

  element.innerHTML = "Add New Transaction";
  const html = `<span
              class="flex gap-1 text-xs justify-center items-center px-2 rounded-full  ${bgclr} ${clr}"
              >${txt}<i data-lucide="${icon}" class="w-3 h-3"></i>
            </span>`;

  element.insertAdjacentHTML("beforeend", html);
  lucide.createIcons();
};

const inputTrc = (isIncome, element, data) => {
  const acc = data
    .map((i) => {
      return `<option value="${i.id}">${i.name}</option>`;
    })
    .join("");

  const html = ` <div class="text-xs flex flex-col mb-2 ${
    isIncome ? "text-gray-200" : ""
  }">
          <label for="acc-ref-from">From Acc</label>
          <select
            name="acc-ref-from"
            id="acc-ref-from"
            class="border px-2 py-1 rounded-sm focus:outline-none text-sm" ${
              isIncome ? "disabled" : ""
            }
          >
            ${acc}
          </select>
        </div>

        <div class="text-xs flex flex-col mb-2 ${
          !isIncome ? "text-gray-200" : ""
        }">
          <label for="acc-ref-to">To Acc</label>
          <select
            name="acc-ref-to"
            id="acc-ref-to"
            class="border px-2 py-1 rounded-sm focus:outline-none text-sm"
            ${!isIncome ? "disabled" : ""}
          >
            ${acc}
          </select>
        </div>`;

  element.innerHTML = html;
};
