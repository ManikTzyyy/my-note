import { myUtils } from "./utils.js";
import { accountServices } from "../services/accountService.js";
import { render } from "./render.js";

document.addEventListener("DOMContentLoaded", () => {
  const addAccPopUp = document.querySelector("#acc-popup");
  const btnAddAcc = document.querySelector("#btn-add-acc");
  const btnClose = document.querySelector("#close-pop-up");
  const accNameInput = document.querySelector("#acc-name");
  const accStartBlncInput = document.querySelector("#acc-start");

  const container = document.getElementById("container-accounts");

  const btnSave = document.getElementById("btn-save-acc");

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

    if (errorName) {
      return;
    }
    const accName = accNameInput.value;
    const accStart = accStartBlncInput.value || 0;
    try {
      btnSave.disabled = true;
      const newAcc = await accountServices.createAccount(
        accName,
        accStart,
        "landmark"
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
      }
    });
  });

  myUtils.removeErrorInput(accNameInput);
  myUtils.removeErrorInput(accStartBlncInput);
});
