"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const {
  criarItemPedido,
  calcularSubtotalItem,
  calcularSubtotalPedido,
  calcularTotalPedido,
  itensExemploVenda42,
} = require("./item-pedido.js");

test("preserva o preco unitario e a quantidade do item", () => {
  const item = criarItemPedido({
    produtoId: "PROD-001",
    nomeProduto: "Racao premium",
    precoUnitario: 89.9,
    quantidade: 2,
  });

  assert.equal(item.precoUnitario, 89.9);
  assert.equal(item.quantidade, 2);
  assert.ok(Object.isFrozen(item));
});

test("calcula subtotal de um item", () => {
  const item = criarItemPedido({
    produtoId: "PROD-002",
    nomeProduto: "Petisco natural",
    precoUnitario: 19.05,
    quantidade: 2,
  });

  assert.equal(calcularSubtotalItem(item), 38.1);
});

test("calcula subtotal e total da venda 00042", () => {
  assert.equal(calcularSubtotalPedido(itensExemploVenda42), 128);
  assert.equal(calcularTotalPedido(itensExemploVenda42), 128);
  assert.equal(calcularTotalPedido(itensExemploVenda42, 12.5), 140.5);
});

test("rejeita quantidade invalida", () => {
  assert.throws(
    () =>
      criarItemPedido({
        produtoId: "PROD-003",
        nomeProduto: "Shampoo neutro",
        precoUnitario: 32.5,
        quantidade: 0,
      }),
    /quantidade/,
  );
});
