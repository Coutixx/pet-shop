(function (globalScope) {
  "use strict";

  /**
   * @typedef {Object} ItemPedido
   * @property {string} produtoId
   * @property {string} nomeProduto
   * @property {number} precoUnitario Preco unitario da venda em reais.
   * @property {number} quantidade Quantidade vendida.
   */

  function paraCentavos(valor) {
    if (!Number.isFinite(valor) || valor < 0) {
      throw new TypeError("O valor monetario deve ser um numero nao negativo.");
    }

    return Math.round(valor * 100);
  }

  function deCentavos(valorCentavos) {
    return valorCentavos / 100;
  }

  /**
   * Cria um item imutavel, preservando o preco unitario usado na venda.
   * @param {ItemPedido} dados
   * @returns {Readonly<ItemPedido>}
   */
  function criarItemPedido(dados) {
    if (!dados.produtoId || !dados.nomeProduto) {
      throw new TypeError("produtoId e nomeProduto sao obrigatorios.");
    }

    if (!Number.isInteger(dados.quantidade) || dados.quantidade <= 0) {
      throw new TypeError("A quantidade deve ser um numero inteiro positivo.");
    }

    paraCentavos(dados.precoUnitario);

    return Object.freeze({
      produtoId: dados.produtoId,
      nomeProduto: dados.nomeProduto,
      precoUnitario: dados.precoUnitario,
      quantidade: dados.quantidade,
    });
  }

  /**
   * @param {Readonly<ItemPedido>} item
   * @returns {number}
   */
  function calcularSubtotalItem(item) {
    return deCentavos(
      paraCentavos(item.precoUnitario) * item.quantidade,
    );
  }

  /**
   * @param {ReadonlyArray<Readonly<ItemPedido>>} itens
   * @returns {number}
   */
  function calcularSubtotalPedido(itens) {
    if (!Array.isArray(itens) || itens.length === 0) {
      throw new TypeError("O pedido deve conter pelo menos um item.");
    }

    const subtotalCentavos = itens.reduce(
      (total, item) =>
        total +
        paraCentavos(item.precoUnitario) * item.quantidade,
      0,
    );

    return deCentavos(subtotalCentavos);
  }

  /**
   * @param {ReadonlyArray<Readonly<ItemPedido>>} itens
   * @param {number} [frete=0]
   * @returns {number}
   */
  function calcularTotalPedido(itens, frete = 0) {
    const subtotalCentavos = paraCentavos(calcularSubtotalPedido(itens));
    const totalCentavos = subtotalCentavos + paraCentavos(frete);
    return deCentavos(totalCentavos);
  }

  /** @type {ReadonlyArray<Readonly<ItemPedido>>} */
  const itensExemploVenda42 = Object.freeze([
    criarItemPedido({
      produtoId: "PROD-001",
      nomeProduto: "Racao premium para caes",
      precoUnitario: 89.9,
      quantidade: 1,
    }),
    criarItemPedido({
      produtoId: "PROD-002",
      nomeProduto: "Petisco natural",
      precoUnitario: 19.05,
      quantidade: 2,
    }),
  ]);

  const api = Object.freeze({
    criarItemPedido,
    calcularSubtotalItem,
    calcularSubtotalPedido,
    calcularTotalPedido,
    itensExemploVenda42,
  });

  globalScope.PetShopItemPedido = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
