import { ItemCarrinho } from "../models/ItemCarrinho";

export class CarrinhoService {

    private itens: ItemCarrinho[] = [];

    adicionarItem(novoItem: ItemCarrinho): void {
        const itemExistente = this.itens.find(
            item => item.produtoId === novoItem.produtoId
        );

        if (itemExistente) {
            itemExistente.quantidade += novoItem.quantidade;
        } else {
            this.itens.push(novoItem);
        }
    }

    listarItens(): ItemCarrinho[] {
        return this.itens;
    }

    removerItem(produtoId: number): boolean {
        const indice = this.itens.findIndex(
            item => item.produtoId === produtoId
        );

        if (indice === -1) {
            return false;
        }

        this.itens.splice(indice, 1);

        return true;
    }

    calcularSubtotal(): number {
        return this.itens.reduce(
            (subtotal, item) =>
                subtotal + (item.precoUnitario * item.quantidade),
            0
        );
    }

    limparCarrinho(): void {
        this.itens = [];
    }

}