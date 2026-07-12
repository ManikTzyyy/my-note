import { myUtils } from "./utils.js";

function cardTemplate(data) {
  return `
    <div class="card flex h-full w-full flex-col overflow-hidden rounded-lg border border-white/70 bg-white/80 shadow-xs shadow-slate-200/70 backdrop-blur-sm">
      <div class="flex items-center justify-between gap-2 bg-${data.bg_clr}-50 px-1 py-1 text-xs">
        <div class="flex min-w-0 items-center gap-2">
          <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-${data.bg_clr}-100 text-${data.ic_clr}-900">
            <i data-lucide="${data.icon}" class="h-4 w-4"></i>
          </div>
          <p class="min-w-0 break-words whitespace-normal text-xs leading-4 text-slate-700">${data.name}</p>
        </div>
        <button data-acc="${data.id}" class="btn-dlt-acc shrink-0 text-slate-500 transition hover:text-red-500">
          <i data-lucide="trash" class="h-4 w-4"></i>
        </button>
      </div>
      <div class="flex flex-1 flex-col gap-1 p-2">
       <span id="balance-${data.id}" class="text-sm leading-5 text-slate-900">${myUtils.formatMoney(data.balance)}</span>
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
  <tr class="table-row align-top text-sm sm:text-xs">
    <td class="whitespace-nowrap py-3">${data.date}</td>
    <td class="whitespace-normal break-words py-3">${data.desc}</td>
    <td>
      <div class="w-7 h-7 flex justify-center items-center rounded-full bg-${ic_bg}-100 text-${ic_clr}-900">
        <i data-lucide="${statusIcon}" class="w-4 h-4"></i>
      </div>
    </td>
    <td>
    ${data.status == "trf"
      ? `<div class="flex bg-${data.bg_from}-100 text-${data.clr_from
      }-900 px-3 py-1 gap-1 rounded-full items-center w-fit">
        <i data-lucide="${data.acc_from?.icon || ""}" class="w-4 h-4"></i>
        <p>${data.acc_from?.name}</p>
      </div>`
      : data.status == "ex"
        ? `<div class="flex bg-${data.bg_from}-100 text-${data.clr_from
        }-900 px-3 py-1 gap-1 rounded-full items-center w-fit">
        <i data-lucide="${data.acc_from?.icon || ""}" class="w-4 h-4"></i>
        <p>${data.acc_from?.name}</p>
      </div>`
        : "-"
    }
    </td>
    <td>
   ${data.status == "trf"
      ? `<div class="flex bg-${data.bg_to}-100 text-${data.clr_to
      }-900 px-3 py-1 gap-1 rounded-full items-center w-fit">
        <i data-lucide="${data.acc_to?.icon || ""}" class="w-4 h-4"></i>
        <p>${data.acc_to?.name}</p>
      </div>`
      : data.status == "in"
        ? `<div class="flex bg-${data.bg_to}-100 text-${data.clr_to
        }-900 px-3 py-1 gap-1 rounded-full items-center w-fit">
        <i data-lucide="${data.acc_to?.icon || ""}" class="w-4 h-4"></i>
        <p>${data.acc_to?.name}</p>
      </div>`
        : "-"
    }
    </td>
    <td class="whitespace-nowrap py-3">IDR ${myUtils.formatMoney(data.amount)}</td>
    <td>
      <div class="flex gap-3 py-3">
        
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
      lengthMenu: [
        [10, 25, 50, 100],
        [10, 25, 50, 100],
      ],
      paging: true,
      searching: true,
      ordering: true,
      scrollX: true,
      scrollCollapse: true,
      autoWidth: false,
      dom: '<"trc-toolbar"<"trc-length"l><"trc-search"f>>rt<"trc-footer"ip>',
      language: {
        lengthMenu: "_MENU_",
        search: "",
        searchPlaceholder: "Search",
      },
      order: [[0, "desc"]],
    });

    table.on("draw", function () {
      lucide.createIcons();
    });

    lucide.createIcons();
  },
};
