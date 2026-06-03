import { TransactionService } from "./services/transactionService.js";
import { accountServices } from "./services/accountService.js";
import { render } from "./utils/render.js";
import { myUtils } from "./utils/utils.js";



import { db } from "./db/database.js";

const datePlace = document.getElementById("dateNow");
const btnRefresh = document.getElementById("refresh-btn");
let isRefreshing = false;

const btnImport = document.getElementById("btn-import");
const fileInput = document.getElementById("import-file");

const btnDownload = document.getElementById("download");

async function init() {
  datePlace.innerHTML = new Date().toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

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



  lucide.createIcons();
}

btnDownload.addEventListener("click", async () => {
  const data = await myUtils.exportData();
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

init();

particlesJS.load("particles-js", "./assets/particles.json", function () { });


btnImport.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];

  if (!file) return;

  Swal.fire({
    title: "Import file?",
    text: "Semua data saat ini akan dihapus dan diganti dengan data dari backup.",
    icon: "warning",
    confirmButtonText: "Yes!",
    showCancelButton: true,
    cancelButtonText: "Cancel",
  }).then(async (res) => {
    if (!res.isConfirmed) return;

    try {
      Swal.fire({
        title: "Importing...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const text = await file.text();
      const data = JSON.parse(text);

      await db.transaction(
        "rw",
        db.accounts,
        db.transactions,
        async () => {
          await db.accounts.clear();
          await db.transactions.clear();

          await db.accounts.bulkPut(data.acc);
          await db.transactions.bulkPut(data.trc);
        }
      );

      await Swal.fire({
        title: "Success",
        text: "Backup berhasil diimport",
        icon: "success",
      });

      location.reload();
    } catch (err) {
      console.error(err);

      Swal.fire({
        title: "Failed",
        text: "File backup tidak valid",
        icon: "error",
      });
    }
  });
});

async function importBackup(file) {
  const text = await file.text();
  const data = JSON.parse(text);

  // validasi sederhana
  if (!data.acc || !data.trc) {
    throw new Error("Format backup tidak valid");
  }

  await db.transaction(
    "rw",
    db.accounts,
    db.transactions,
    async () => {
      // hapus data lama
      await db.accounts.clear();
      await db.transactions.clear();

      // restore data baru
      await db.accounts.bulkPut(data.acc);
      await db.transactions.bulkPut(data.trc);
    }
  );
}