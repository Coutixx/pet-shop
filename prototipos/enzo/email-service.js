(function (globalScope) {
  "use strict";

  function validarRecibo(recibo) {
    if (!recibo || typeof recibo !== "object") {
      throw new TypeError("Os dados do recibo são obrigatórios.");
    }

    if (
      typeof recibo.destinatario !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recibo.destinatario)
    ) {
      throw new TypeError("O e-mail do destinatário é inválido.");
    }

    if (!recibo.vendaId || !recibo.cliente) {
      throw new TypeError("A venda e o cliente são obrigatórios.");
    }

    if (!Number.isSafeInteger(recibo.totalCentavos) || recibo.totalCentavos < 0) {
      throw new TypeError("O total da venda deve ser informado em centavos.");
    }
  }

  async function transporteSimulado(mensagem) {
    return Object.freeze({
      modo: "mock",
      destinatario: mensagem.destinatario,
      vendaId: mensagem.vendaId,
    });
  }

  function criarServicoEmail(transporte) {
    const enviar = transporte ?? transporteSimulado;
    if (typeof enviar !== "function") {
      throw new TypeError("O transporte de e-mail deve ser uma função.");
    }

    return Object.freeze({
      async enviarRecibo(recibo) {
        validarRecibo(recibo);
        const totalFormatado = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(recibo.totalCentavos / 100);
        const mensagem = Object.freeze({
          destinatario: recibo.destinatario.trim(),
          assunto: `Recibo da venda #${recibo.vendaId}`,
          corpo: [
            `Olá, ${recibo.cliente}.`,
            `O total da venda #${recibo.vendaId} foi ${totalFormatado}.`,
            "Este envio é uma simulação de teste.",
          ].join("\n"),
          vendaId: String(recibo.vendaId),
          totalCentavos: recibo.totalCentavos,
        });

        return enviar(mensagem);
      },
    });
  }

  const api = Object.freeze({ criarServicoEmail });
  globalScope.PetShopEmail = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
