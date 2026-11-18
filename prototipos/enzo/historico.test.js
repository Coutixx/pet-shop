"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { filtrarVendas, calcularResumoVendas } = require("./historico.js");

const vendas = [
  { id: "00042", cliente: "Mariana Oliveira", totalCentavos: 12800 },
  { id: "00041", cliente: "Rafael Santos", totalCentavos: 7450 },
  { id: "00040", cliente: "Camila Ferreira", totalCentavos: 21980 },
];

test("filtra pedidos por número e cliente ignorando acentos e caixa", () => {
  assert.deepEqual(filtrarVendas(vendas, "00042"), [vendas[0]]);
  assert.deepEqual(filtrarVendas(vendas, "camíla"), [vendas[2]]);
  assert.deepEqual(filtrarVendas(vendas, "MARIANA"), [vendas[0]]);
});

test("calcula resumo para vendas filtradas e lista vazia", () => {
  assert.deepEqual(calcularResumoVendas([vendas[0], vendas[1]]), {
    quantidade: 2,
    totalCentavos: 20250,
    ticketMedioCentavos: 10125,
  });
  assert.deepEqual(calcularResumoVendas([]), {
    quantidade: 0,
    totalCentavos: 0,
    ticketMedioCentavos: 0,
  });
});

test("rejeita total de venda inválido", () => {
  assert.throws(
    () => calcularResumoVendas([{ totalCentavos: 12.5 }]),
    /centavos/,
  );
});
