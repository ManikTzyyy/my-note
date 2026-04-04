const body = document.querySelector("#body");
export const myUtils = {
  inputValidator(input) {
    if (!input.value) {
      input.classList.add("border-red-500");
      return true;
    } else {
      return false;
    }
  },
  removeErrorInput(input) {
    input.addEventListener("input", () => {
      input.classList.remove("border-red-500");
    });
  },

  isBodyOverflow() {
    body.classList.toggle("overflow-hidden");
  },
};
