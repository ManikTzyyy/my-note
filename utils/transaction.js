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
  let type;

  document.addEventListener("click", async (e) => {
    const btnInc = e.target.closest("#btn-inc");
    const btnExp = e.target.closest("#btn-expense");
    const btnTrc = e.target.closest("#btn-trf");

    const btnDltTrc = e.target.closest("#btn-delete-trc");

    if (btnInc) {
      type = "inc";
      await openTrcPopUp(type);
      isIncome = true;
    } else if (btnExp) {
      type = "exp";
      await openTrcPopUp(type);
      isIncome = false;
    } else if (btnTrc) {
      type = "trf";
      await openTrcPopUp(type);
    }

    if (btnDltTrc) {
      const idTrc = Number(btnDltTrc.dataset.trc);

      const data = await TransactionService.findById(idTrc);

      let idAccToEdit =
        data.status == "in" ? data.to_account_id : data.from_account_id;

      let type = data.status;

      Swal.fire({
        title: `Delete this Trancation?`,
        icon: "warning",
        confirmButtonText: "Yes!",
        showCancelButton: true,
      }).then(async (res) => {
        if (res.isConfirmed) {
          try {
            if (type !== "trf") {
              const isIncome = type === "in";

              await TransactionService.delete(
                idTrc,
                idAccToEdit,
                data.amount,
                isIncome
              );

              const acc = await accountServices.findById(idAccToEdit);
              if (acc) {
                myUtils.updateCardBalance(idAccToEdit, acc.balance);
              }
            } else {
              const accIDTo = data.to_account_id;
              const accIDfrom = data.from_account_id;

              await TransactionService.deleteTrfType(
                idTrc,
                data.amount,
                accIDfrom,
                accIDTo
              );

              const [updatedFrom, updatedTo] = await Promise.all([
                accountServices.findById(accIDfrom),
                accountServices.findById(accIDTo),
              ]);

              await Promise.all([
                myUtils.updateCardBalance(updatedFrom.id, updatedFrom.balance),
                myUtils.updateCardBalance(updatedTo.id, updatedTo.balance),
              ]);
            }
          } catch (error) {
            console.log(error);
          } finally {
            btnDltTrc.closest(".table-row")?.remove();
          }
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
      btnSaveTrc.disabled = true;
      if (type != "trf") {
        const acc = await accountServices.findById(
          isIncome ? accIDTo : accIDfrom
        );

        const res = await TransactionService.createTrc(
          dateTrcValue,
          descTrcValue,
          accIDfrom,
          accIDTo,
          amountTrcValue,
          isIncome ? null : acc.bg_clr,
          isIncome ? null : acc.ic_clr,
          isIncome ? acc.bg_clr : null,
          isIncome ? acc.ic_clr : null,
          isIncome
        );

        const createObj = await myUtils.getTrcWithAcc(res, acc, isIncome);

        render.initTrcRow(createObj, containerTbl, true);
      } else {
        const accFrom = await accountServices.findById(accIDfrom);
        const accTo = await accountServices.findById(accIDTo);

        if (accIDfrom == accIDTo) {
          Swal.fire({
            title: `Account cannot be same refrence!`,
            icon: "warning",
            confirmButtonText: "ok!",
          });

          return;
        } else {
          const res = await TransactionService.createTransfer(
            dateTrcValue,
            descTrcValue,
            accIDfrom,
            accIDTo,
            amountTrcValue,
            accFrom.bg_clr,
            accFrom.ic_clr,
            accTo.bg_clr,
            accTo.ic_clr,
            "trf"
          );

          const createObj = await myUtils.getTrcWithAccTrf(res, accFrom, accTo);

          console.log(createObj);
          render.initTrcRow(createObj, containerTbl, true);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (type != "trf") {
        const acc = await accountServices.findById(
          isIncome ? accIDTo : accIDfrom
        );
        myUtils.updateCardBalance(acc.id, acc.balance);
      } else {
        const accFrom = await accountServices.findById(accIDfrom);
        const accTo = await accountServices.findById(accIDTo);
        const [from, to] = await Promise.all([
          myUtils.updateCardBalance(accFrom.id, accFrom.balance),
          myUtils.updateCardBalance(accTo.id, accTo.balance),
        ]);
      }

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

  const openTrcPopUp = async (type) => {
    const accList = await accountServices.getAll();
    addTrcPop.classList.remove("hidden");
    myUtils.isBodyOverflow(true);
    stsPOP(type, statusPopup);
    inputTrc(type, boxTrc, accList);
    myUtils.resetInput(dateTrcInput, false);
    myUtils.resetInput(descTrcInput, false);
    myUtils.resetInput(amountTrcInput, true);
    return type;
  };
});

const stsPOP = (type, element) => {
  let txt;
  let icon;
  let bg;
  let clr;

  if (type == "inc") {
    txt = "Income";
    icon = "arrow-up";
    bg = "bg-green-100";
    clr = "text-green-800";
  } else if (type == "exp") {
    txt = "Expense";
    icon = "arrow-down";
    bg = "bg-red-100";
    clr = "text-red-800";
  } else if (type == "trf") {
    txt = "Transfer";
    icon = "arrow-right-left";
    bg = "bg-blue-100";
    clr = "text-blue-800";
  }

  element.innerHTML = "Add New Transaction";
  const html = `<span
              class="flex gap-1 text-xs justify-center items-center px-2 rounded-full  ${bg} ${clr}"
              >${txt}<i data-lucide="${icon}" class="w-3 h-3"></i>
            </span>`;

  element.insertAdjacentHTML("beforeend", html);
  lucide.createIcons();
};

const inputTrc = (type, element, data) => {
  const acc = data
    .map((i) => {
      return `<option value="${i.id}">${i.name}</option>`;
    })
    .join("");

  const html = ` <div class="text-xs flex flex-col mb-2">
          <label for="acc-ref-from">From Acc</label>
          <select
            name="acc-ref-from"
            id="acc-ref-from"
            class="border px-2 py-1 rounded-sm focus:outline-none text-sm select-acc" 
          >
            ${acc}
          </select>
        </div>

        <div class="text-xs flex flex-col mb-2">
          <label for="acc-ref-to">To Acc</label>
          <select
            name="acc-ref-to"
            id="acc-ref-to"
            class="border px-2 py-1 rounded-sm focus:outline-none text-sm select-acc"
          
          >
            ${acc}
          </select>
        </div>`;

  element.innerHTML = html;

  const accRefFrom = document.getElementById("acc-ref-from");
  const accRefTo = document.getElementById("acc-ref-to");

  if (type == "inc") {
    accRefFrom.disabled = true;
    accRefTo.disabled = false;
  } else if (type == "exp") {
    accRefFrom.disabled = false;
    accRefTo.disabled = true;
  } else if (type == "trf") {
    accRefFrom.disabled = false;
    accRefTo.disabled = false;
  }
};
