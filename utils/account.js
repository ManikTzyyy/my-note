import { myUtils } from "./utils.js";
import { accountServices } from "../services/accountService.js";
import { render } from "./render.js";
import { TransactionService } from "../services/transactionService.js";

document.addEventListener("DOMContentLoaded", () => {
  const addAccPopUp = document.querySelector("#acc-popup");
  const btnAddAcc = document.querySelector("#btn-add-acc");
  const btnClose = document.querySelector("#close-pop-up");
  const accNameInput = document.querySelector("#acc-name");
  const accStartBlncInput = document.querySelector("#acc-start");

  const container = document.getElementById("container-accounts");

  const btnSave = document.getElementById("btn-save-acc");
  myUtils.formatedValue(accStartBlncInput);

  btnAddAcc.addEventListener("click", () => {
    addAccPopUp.classList.remove("hidden");
    myUtils.isBodyOverflow(true);
  });

  btnClose.addEventListener("click", () => {
    addAccPopUp.classList.add("hidden");
    myUtils.isBodyOverflow(false);
  });

  btnSave.addEventListener("click", async () => {
    const errorName = myUtils.inputValidator(accNameInput);
    const selectedIcon = document.getElementById("select-icon");

    if (errorName) {
      return;
    }
    const accName = accNameInput.value;
    const accStartInputValue = accStartBlncInput.value || 0;
    const accStartValue = Number(accStartInputValue.replace(/\./g, ""));

    try {
      btnSave.disabled = true;
      const newAcc = await accountServices.createAccount(
        accName,
        accStartValue,
        selectedIcon.dataset.icon,
        selectedIcon.dataset.bgclr,
        selectedIcon.dataset.txtclr
      );

      render.initAccCard(newAcc, container, true);
    } catch (error) {
      console.log(error);
    } finally {
      accNameInput.value = "";
      accStartBlncInput.value = 0;
      btnSave.disabled = false;
      myUtils.isBodyOverflow(false);
      addAccPopUp.classList.add("hidden");
    }
  });

  document.addEventListener("click", async (e) => {
    const btnDeleteAcc = e.target.closest(".btn-dlt-acc");
    const containerTbl = document.getElementById("trc-body");
    if (!btnDeleteAcc) return;
    const idAcc = Number(btnDeleteAcc.dataset.acc);
    Swal.fire({
      title: "Delete this Account?",
      icon: "warning",
      confirmButtonText: "Yes!",
      showCancelButton: true,
    }).then(async (res) => {
      if (res.isConfirmed) {
        await accountServices.delete(idAcc);
        btnDeleteAcc.closest(".card")?.remove();

        const accList = await accountServices.getAll();
        const trcList = await TransactionService.getAll();
        const dataTrc = myUtils.getAllWithAcc(trcList, accList);
        render.initTrcRow(dataTrc, containerTbl, false);
      }
    });
  });

  myUtils.removeErrorInput(accNameInput);
  myUtils.removeErrorInput(accStartBlncInput);
});
