import { TransactionService } from "./services/transactionService.js";
import { accountServices } from "./services/accountService.js";
import { render } from "./utils/render.js";
import { myUtils } from "./utils/utils.js";

import { db } from "./db/database.js";

const datePlace = document.getElementById("dateNow");
const btnRefresh = document.getElementById("refresh-btn");
let isRefreshing = false;

async function init() {
  datePlace.innerHTML = new Date().toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(() => console.log("SW registered"))
      .catch((err) => console.log("SW error", err));
  }
  refresh();
  // await db.delete()
  // await db.open()
}

btnRefresh.addEventListener("click", async () => {
  await refresh();
});

async function refresh() {
  const containerAcc = document.getElementById("container-accounts");
  const containerTbl = document.getElementById("trc-body");

  if ($.fn.DataTable.isDataTable("#tableTrans")) {
    $("#tableTrans").DataTable().clear().destroy();
  }

  containerAcc.innerHTML = "";
  containerTbl.innerHTML = "";
  const [accList, trcList] = await Promise.all([
    accountServices.getAll(),
    TransactionService.getAll(),
  ]);


  const dataTrc = myUtils.getAllWithAcc(trcList, accList);



  await render.initAccCard(accList, containerAcc, false);
  await render.initTrcRow(dataTrc, containerTbl, false);

  lucide.createIcons();
}

init();


particlesJS.load('particles-js', './assets/particles.json', function() {
  console.log('callback - particles.js config loaded');
});