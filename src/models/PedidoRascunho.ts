import { ItemCarrinho } from "./ItemCarrinho";

export interface PedidoRascunho {
    clienteId: number;
    entregadorId?: number;

    itens: ItemCarrinho[];

    subtotal: number;
    distanciaKm: number;
    frete: number;
    total: number;

    dataCriacao: Date;
    dataEntrega?: Date;
}