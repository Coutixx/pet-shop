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
        const total = subtotal + frete;

        return {
            subtotal,
            frete,
            total
        };
    }

    criarPedido(
        clienteId: number,
        entregadorId: number,
        distanciaKm: number
    ): PedidoRascunho {

        const itens = this.carrinhoService.listarItens();

        if (itens.length === 0) {
            throw new Error("O carrinho está vazio.");
        }

        const valores = this.calcularTotal(distanciaKm);

        return {
            clienteId,
            entregadorId,
            itens,
            subtotal: valores.subtotal,
            distanciaKm,
            frete: valores.frete,
            total: valores.total,
            dataCriacao: new Date()
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