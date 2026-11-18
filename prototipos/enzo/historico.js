(function (globalScope) {
  "use strict";

  function normalizarTexto(texto) {
    return String(texto ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("pt-BR")
      .trim();
  }

  function filtrarVendas(vendas, consulta) {
    if (!Array.isArray(vendas)) {
      throw new TypeError("As vendas devem ser fornecidas em uma lista.");
    }

    const termo = normalizarTexto(consulta);
    if (!termo) return vendas.slice();

    return vendas.filter((venda) => {
      const textoVenda = normalizarTexto(`${venda.id} ${venda.cliente}`);
      return textoVenda.includes(termo);
    });
  }

  function calcularResumoVendas(vendas) {
    if (!Array.isArray(vendas)) {
      throw new TypeError("As vendas devem ser fornecidas em uma lista.");
    }

    const totalCentavos = vendas.reduce((total, venda) => {
      if (!Number.isSafeInteger(venda.totalCentavos) || venda.totalCentavos < 0) {
        throw new TypeError("O total da venda deve ser informado em centavos.");
      }

      return total + venda.totalCentavos;
    }, 0);

    return Object.freeze({
      quantidade: vendas.length,
      totalCentavos,
      ticketMedioCentavos: vendas.length ? Math.round(totalCentavos / vendas.length) : 0,
    });
  }

  const api = Object.freeze({ filtrarVendas, calcularResumoVendas });
  globalScope.PetShopHistorico = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
