const containerIcon = document.getElementById("container-icon");
const btnSelectIcon = document.getElementById("select-icon");
document.addEventListener("DOMContentLoaded", () => {
  const searchIcon = document.getElementById("icon-search");

  const iconBox = document.getElementById("icon-box");

  searchIcon.addEventListener("input", () => {
    renderIcons(searchIcon.value);
  });

  btnSelectIcon.addEventListener("click", () => {
    iconBox.classList.remove("hidden");
    renderIcons();
  });

  containerIcon.addEventListener("click", (e) => {
    const iconSelected = e.target.closest(".icon-data");
    if (!iconSelected) return;
    const iconName = iconSelected.dataset.lucide;

    btnSelectIcon.innerHTML = `<i data-lucide="${iconName}" class="cursor-pointer icon-data"></i>`;
    btnSelectIcon.dataset.icon = iconName;
    lucide.createIcons();
    iconBox.classList.add("hidden");
  });
});

function renderIcons(filter = "") {
  const iconsList = Object.keys(lucide.icons);

  containerIcon.innerHTML = "";
  const filtered = iconsList
    .filter((i) => i.toLowerCase().includes(filter.toLowerCase()))
    .slice(0, 50);

  filtered.forEach((item) => {
    containerIcon.innerHTML += `<i data-lucide="${item}" class="cursor-pointer icon-data"></i>`;
  });

  lucide.createIcons();
}

const colors = [
  "red",
  "green",
  "blue",
  "yellow",
  "purple",
  "pink",
  "indigo",
  "gray",
];

const bgPicker = document.getElementById("bgPicker");
const textPicker = document.getElementById("textPicker");

colors.forEach((color) => {
  const bgItem = document.createElement("div");
  bgItem.className = `w-6 h-6 rounded-md cursor-pointer bg-${color}-100 select-bg-icon`;
  bgItem.dataset.color = color; 

  const textItem = document.createElement("div");
  textItem.className = `w-6 h-6 rounded-md cursor-pointer bg-${color}-900 select-clr-icon`;
  textItem.dataset.color = color;

  bgPicker.appendChild(bgItem);
  textPicker.appendChild(textItem);
});

document.addEventListener("click", (e) => {
  const bgSelected = e.target.closest(".select-bg-icon");
  const clrSelected = e.target.closest(".select-clr-icon");

  if (bgSelected) {
    const color = bgSelected.dataset.color;

    [...btnSelectIcon.classList]
      .filter((cls) => cls.startsWith("bg-"))
      .forEach((cls) => btnSelectIcon.classList.remove(cls));

    btnSelectIcon.classList.add(`bg-${color}-100`);

    btnSelectIcon.dataset.bgclr = color;
  }

  if (clrSelected) {
    const color = clrSelected.dataset.color;

    // remove semua text-*
    [...btnSelectIcon.classList]
      .filter((cls) => cls.startsWith("text-"))
      .forEach((cls) => btnSelectIcon.classList.remove(cls));

    btnSelectIcon.classList.add(`text-${color}-900`);

    btnSelectIcon.dataset.txtclr = color;
  }
});
