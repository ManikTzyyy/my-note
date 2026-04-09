import { myUtils } from "./utils.js";

function cardTemplate(data) {
  return `
    <div class="card bg-${data.bg_clr}-50 bg-opacity-25 rounded-lg w-full">
      <div class="h-10 bg-${
        data.bg_clr
      }-50 px-2 py-1 text-xs flex justify-between items-center">
        <div class="bg-${
          data.bg_clr
        }-100 w-6 h-6 flex justify-center items-center rounded-full text-${
    data.ic_clr
  }-900">
          <i data-lucide="${data.icon}" class="w-4 h-4"></i>
        </div>
        <div>
          <button data-acc="${
            data.id
          }" class="btn-dlt-acc"><i data-lucide="trash" class="w-4 h-4"></i></button>
        </div>
      </div>
      <div class="p-2">
        <p class="text-xs">${data.name}</p>
        <div class="flex gap-1 items-center"><span class="text-xs">IDR</span><span id="balance-${
          data.id
        }">${myUtils.formatMoney(data.balance)}</span></div>
      </div>
    </div>
  `;
}

function tableRowTemplate(data) {
  let statusIcon;
  let ic_clr;
  let ic_bg;
  if (data.status == "in") {
    statusIcon = "arrow-up";
    ic_clr = "green";
    ic_bg = "green";
  } else if (data.status == "ex") {
    statusIcon = "arrow-down";
    ic_clr = "red";
    ic_bg = "red";
  } else if (data.status == "trf") {
    statusIcon = "arrow-right-left";
    ic_clr = "blue";
    ic_bg = "blue";
  }

  return `
  <tr class="table-row text-xs">
    <td class="whitespace-nowrap">${data.date}</td>
    <td class="whitespace-nowrap">${data.desc}</td>
    <td>
      <div class="w-6 h-6 flex justify-center items-center rounded-full bg-${ic_bg}-100 text-${ic_clr}-900">
        <i data-lucide="${statusIcon}" class="w-4 h-4"></i>
      </div>
    </td>
    <td>
    ${
      data.status == "trf"
        ? `<div class="flex bg-${data.bg_from}-100 text-${
            data.clr_from
          }-900 px-3 py-1 gap-1 rounded-full items-center w-fit">
        <i data-lucide="${data.acc_from?.icon || ""}" class="w-4 h-4"></i>
        <p>${data.acc_from?.name}</p>
      </div>`
        : data.status == "ex"
        ? `<div class="flex bg-${data.bg_from}-100 text-${
            data.clr_from
          }-900 px-3 py-1 gap-1 rounded-full items-center w-fit">
        <i data-lucide="${data.acc_from?.icon || ""}" class="w-4 h-4"></i>
        <p>${data.acc_from?.name}</p>
      </div>`
        : "-"
    }
    </td>
    <td>
   ${
     data.status == "trf"
       ? `<div class="flex bg-${data.bg_to}-100 text-${
           data.clr_to
         }-900 px-3 py-1 gap-1 rounded-full items-center w-fit">
        <i data-lucide="${data.acc_to?.icon || ""}" class="w-4 h-4"></i>
        <p>${data.acc_to?.name}</p>
      </div>`
       : data.status == "in"
       ? `<div class="flex bg-${data.bg_to}-100 text-${
           data.clr_to
         }-900 px-3 py-1 gap-1 rounded-full items-center w-fit">
        <i data-lucide="${data.acc_to?.icon || ""}" class="w-4 h-4"></i>
        <p>${data.acc_to?.name}</p>
      </div>`
       : "-"
   }
    </td>
    <td class="whitespace-nowrap">IDR ${myUtils.formatMoney(data.amount)}</td>
    <td>
      <div class="flex gap-3">
        
        <button id="btn-delete-trc" data-trc="${data.id}">
          <i data-lucide="trash" class="w-4 h-4"></i>
        </button>
      </div>
    </td>
  </tr>
  `;
}

export const render = {
  initAccCard(data, container, isSingle) {
    if (isSingle) {
      container.insertAdjacentHTML("beforeend", cardTemplate(data));
    } else {
      container.innerHTML = "";
      data.forEach((acc) => {
        container.insertAdjacentHTML("beforeend", cardTemplate(acc));
      });
    }

    lucide.createIcons();
  },

  async initTrcRow(data, container, isSingle) {
    if ($.fn.DataTable.isDataTable("#tableTrans")) {
      $("#tableTrans").DataTable().destroy();
    }

    if (isSingle) {
      container.insertAdjacentHTML("beforeend", tableRowTemplate(data));
    } else {
      container.innerHTML = "";
      data.forEach((item) => {
        container.insertAdjacentHTML("beforeend", tableRowTemplate(item));
      });
    }

    const table = $("#tableTrans").DataTable({
      pageLength: 10,
      paging: true,
      searching: true,
      ordering: true,
      scrollX: true,
    });

    table.on("draw", function () {
      lucide.createIcons();
    });

    lucide.createIcons();
  },
};
