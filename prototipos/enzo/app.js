"use strict";

const historyApi = window.PetShopHistorico;
if (!historyApi) throw new Error("O módulo de histórico não foi carregado.");

const sales = Array.from(document.querySelectorAll(".sale-card")).map((card) => ({
  id: card.dataset.saleId,
  cliente: card.dataset.customer,
  totalCentavos: Number(card.dataset.totalCents),
  element: card,
}));

const searchInput = document.querySelector("#sales-search");
const emptyMessage = document.querySelector("#sales-empty");
const salesCount = document.querySelector("#sales-count");
const salesTotal = document.querySelector("#sales-total");
const salesAverage = document.querySelector("#sales-average");
const resultCount = document.querySelector("#sales-result-count");
if (
  !(searchInput instanceof HTMLInputElement) ||
  !(emptyMessage instanceof HTMLElement) ||
  !(salesCount instanceof HTMLElement) ||
  !(salesTotal instanceof HTMLElement) ||
  !(salesAverage instanceof HTMLElement) ||
  !(resultCount instanceof HTMLElement)
) {
  throw new Error("Os controles do histórico de vendas não foram encontrados.");
}

const moneyFormat = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function renderSales(consulta) {
  const filtradas = historyApi.filtrarVendas(sales, consulta);
  const resumo = historyApi.calcularResumoVendas(filtradas);
  const idsVisiveis = new Set(filtradas.map((venda) => venda.id));

  for (const venda of sales) {
    venda.element.hidden = !idsVisiveis.has(venda.id);
  }

  salesCount.textContent = String(resumo.quantidade);
  salesTotal.textContent = moneyFormat.format(resumo.totalCentavos / 100);
  salesAverage.textContent = moneyFormat.format(resumo.ticketMedioCentavos / 100);
  resultCount.textContent = `${resumo.quantidade} ${
    resumo.quantidade === 1 ? "venda" : "vendas"
  }`;
  emptyMessage.hidden = resumo.quantidade !== 0;
}

searchInput.addEventListener("input", () => renderSales(searchInput.value));
renderSales("");

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
