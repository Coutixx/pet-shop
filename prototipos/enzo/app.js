"use strict";

const historyApi = window.PetShopHistorico;
if (!historyApi) throw new Error("O módulo de histórico não foi carregado.");
const emailApi = window.PetShopEmail;
if (!emailApi) throw new Error("O serviço de e-mail não foi carregado.");
const emailService = emailApi.criarServicoEmail();

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

document.addEventListener("click", async (event) => {
  if (!(event.target instanceof Element)) return;

  const sendButton = event.target.closest("[data-send-receipt]");
  if (!(sendButton instanceof HTMLButtonElement)) return;

  const selectedSale = sendButton.closest(".sale-card");
  const status = selectedSale?.querySelector("[data-email-status]");
  if (!(selectedSale instanceof HTMLDetailsElement) || !(status instanceof HTMLElement)) {
    throw new Error("O pedido não possui os controles de envio do recibo.");
  }

  const venda = Object.freeze({
    id: selectedSale.dataset.saleId,
    cliente: selectedSale.dataset.customer,
    email: selectedSale.dataset.email,
    totalCentavos: Number(selectedSale.dataset.totalCents),
    status: "confirmada",
  });
  sendButton.disabled = true;
  status.hidden = false;
  status.className = "email-status";
  status.textContent = "Processando envio em modo de teste...";

  try {
    const resultado = await emailApi.tentarEnviarReciboVenda(venda, emailService);
    if (resultado.enviado) {
      status.classList.add("success");
      status.textContent =
        `Recibo da venda #${venda.id} processado em modo mock. Nenhum e-mail real foi enviado.`;
    } else {
      status.classList.add("error");
      status.textContent =
        `A venda #${venda.id} continua confirmada. O recibo não foi enviado: ${resultado.erro.message} Tente novamente.`;
    }
  } finally {
    sendButton.disabled = false;
  }
});
