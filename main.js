import { TransactionService } from "./services/transactionService.js";
import { accountServices } from "./services/accountService.js";
import { render } from "./utils/render.js";
import { myUtils } from "./utils/utils.js";

import { db } from "./db/database.js";

const datePlace = document.getElementById("dateNow");
const btnRefresh = document.getElementById("refresh-btn");
let isRefreshing = false;

const btnDownload = document.getElementById("download");

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
  const elAsset = document.getElementById("ttl-assets");
  const totalBalance = accList.reduce((acc, item) => {
    return acc + item.balance;
  }, 0);

  const money = myUtils.formatMoney(totalBalance);

  elAsset.textContent = `IDR ${money}`;

  await render.initAccCard(accList, containerAcc, false);
  await render.initTrcRow(dataTrc, containerTbl, false);

  btnDownload.addEventListener("click", async () => {
    const data = myUtils.exportData();

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "backup.json";
    link.click();

    URL.revokeObjectURL(url);
  });

  lucide.createIcons();
}

init();

particlesJS.load("particles-js", "./assets/particles.json", function () {});
