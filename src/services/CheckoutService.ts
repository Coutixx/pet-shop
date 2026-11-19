import { CarrinhoService } from "./CarrinhoService";
import { FreteService } from "./FreteService";
import { PedidoRascunho } from "../models/PedidoRascunho";

export class CheckoutService {
    private carrinhoService: CarrinhoService;
    private freteService: FreteService;

    constructor() {
        this.carrinhoService = new CarrinhoService();
        this.freteService = new FreteService();
    }

    adicionarProduto(
        produtoId: number,
        nome: string,
        precoUnitario: number,
        quantidade: number
    ): void {
        this.carrinhoService.adicionarItem({
            produtoId,
            nome,
            precoUnitario,
            quantidade
        });
    }

    calcularSubtotal(): number {
        return this.carrinhoService.calcularSubtotal();
    }

    calcularTotal(distanciaKm: number): {
        subtotal: number;
        frete: number;
        total: number;
    } {
        const subtotal = this.calcularSubtotal();
        const frete = this.freteService.calcular(distanciaKm);

        return {
            subtotal,
            frete,
            total: Number((subtotal + frete).toFixed(2))
        };
    }

    criarPedido(
        clienteId: number,
        entregadorId: number | null,
        distanciaKm: number
    ): PedidoRascunho {
        if (!Number.isInteger(clienteId) || clienteId <= 0) {
            throw new Error("Cliente inválido.");
        }

        if (
            entregadorId !== null &&
            (!Number.isInteger(entregadorId) || entregadorId <= 0)
        ) {
            throw new Error("Entregador inválido.");
        }

        const itens = this.carrinhoService.listarItens();

        if (itens.length === 0) {
            throw new Error("O carrinho está vazio.");
        }

        const valores = this.calcularTotal(distanciaKm);

        return {
            clienteId,
            entregadorId,
            itens: itens.map(item => ({
                produtoId: item.produtoId,
                quantidade: item.quantidade
            })),
            frete: valores.frete,
            criadoEm: new Date().toISOString(),
            previsaoEntrega: null
        };
    }

    removerProduto(produtoId: number): boolean {
        return this.carrinhoService.removerItem(produtoId);
    }

    listarItens() {
        return this.carrinhoService.listarItens();
    }

    limparCarrinho(): void {
        this.carrinhoService.limparCarrinho();
    }
}
