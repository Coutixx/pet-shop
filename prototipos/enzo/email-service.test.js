"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { criarServicoEmail, tentarEnviarReciboVenda } = require("./email-service.js");

const reciboExemplo = {
  destinatario: "maria@example.test",
  vendaId: "00042",
  cliente: "Mariana Oliveira",
  totalCentavos: 12800,
};

test("envia recibo usando modo mock por padrão", async () => {
  const servico = criarServicoEmail();
  const resultado = await servico.enviarRecibo(reciboExemplo);

  assert.deepEqual(resultado, {
    modo: "mock",
    destinatario: "maria@example.test",
    vendaId: "00042",
  });
});

test("permite injetar transporte e envia somente dados do recibo", async () => {
  let mensagemEnviada;
  const servico = criarServicoEmail(async (mensagem) => {
    mensagemEnviada = mensagem;
    return { modo: "teste" };
  });

  assert.deepEqual(await servico.enviarRecibo(reciboExemplo), { modo: "teste" });
  assert.equal(mensagemEnviada.destinatario, reciboExemplo.destinatario);
  assert.equal(mensagemEnviada.assunto, "Recibo da venda #00042");
  assert.match(mensagemEnviada.corpo, /128,00/);
});

test("rejeita destinatário e total inválidos", async () => {
  const servico = criarServicoEmail();

  await assert.rejects(
    servico.enviarRecibo({ ...reciboExemplo, destinatario: "invalido" }),
    /e-mail/,
  );
  await assert.rejects(
    servico.enviarRecibo({ ...reciboExemplo, totalCentavos: 12.5 }),
    /centavos/,
  );
});

test("propaga falhas do transporte para o fluxo chamador", async () => {
  const servico = criarServicoEmail(async () => {
    throw new Error("Transporte indisponível.");
  });

  await assert.rejects(servico.enviarRecibo(reciboExemplo), /Transporte indisponível/);
});

test("mantém a venda confirmada quando o envio do recibo falha", async () => {
  const vendaConfirmada = Object.freeze({
    id: "00042",
    cliente: "Mariana Oliveira",
    email: "maria@example.test",
    totalCentavos: 12800,
    status: "confirmada",
  });
  const estadoAntes = { ...vendaConfirmada };
  const servico = criarServicoEmail(async () => {
    throw new Error("Transporte indisponível.");
  });

  const resultado = await tentarEnviarReciboVenda(vendaConfirmada, servico);

  assert.equal(resultado.enviado, false);
  assert.match(resultado.erro.message, /Transporte indisponível/);
  assert.deepEqual(vendaConfirmada, estadoAntes);
});
