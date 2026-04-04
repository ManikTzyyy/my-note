function formatDate(date) {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatMoney(value) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function cardTemplate(data) {
  return `
    <div class="card bg-blue-50 bg-opacity-25 rounded-lg w-full">
      <div class="h-10 bg-blue-50 px-2 py-1 text-xs flex justify-between items-center">
        <div class="bg-blue-100 w-6 h-6 flex justify-center items-center rounded-full text-blue-900">
          <i data-lucide="${data.icon}" class="w-4 h-4"></i>
        </div>
        <div>
          <button data-acc="${data.id}" class="btn-dlt-acc"><i data-lucide="trash" class="w-4 h-4"></i></button>
        </div>
      </div>
      <div class="p-2">
        <p class="text-xs">${data.name}</p>
        <p><span class="text-xs">IDR</span> ${formatMoney(data.balance)}</p>
      </div>
    </div>
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
};
