"use strict";

document.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const printButton = event.target.closest("[data-print-receipt]");
  if (!(printButton instanceof HTMLButtonElement)) return;

  const selectedSale = printButton.closest(".sale-card");
  if (!(selectedSale instanceof HTMLDetailsElement)) {
    throw new Error("O recibo precisa estar dentro de um pedido.");
  }

  selectedSale.open = true;
  window.print();
});
