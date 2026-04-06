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
  return `
  <tr class="table-row text-xs">
    <td class="whitespace-nowrap">${data.date}</td>
    <td class="whitespace-nowrap">${data.desc}</td>
    <td>
      <div class="w-6 h-6 flex justify-center items-center rounded-full ${
        data.status != "in"
          ? "bg-red-100 text-red-900"
          : "bg-green-100 text-green-900"
      }">
        <i data-lucide="${
          data.status != "in" ? "arrow-up" : "arrow-down"
        }" class="w-4 h-4"></i>
      </div>
    </td>
    <td>
    ${
      data.status == "ex"
        ? `<div class="flex bg-${data.bg_clr}-100 text-${
            data.ic_clr
          }-900 px-3 py-1 gap-1 rounded-full items-center w-fit">
        <i data-lucide="${data.acc_from?.icon || ""}" class="w-4 h-4"></i>
        <p>${data.acc_from?.name}</p>
      </div>`
        : "-"
    }
    </td>
    <td>
   ${
     data.status == "in"
       ? `<div class="flex bg-${data.bg_clr}-100 text-${
           data.ic_clr
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
