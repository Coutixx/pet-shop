import { ItemCarrinho } from "../models/ItemCarrinho";

export class CarrinhoService {
    private itens: ItemCarrinho[] = [];

    adicionarItem(novoItem: ItemCarrinho): void {
        if (!Number.isInteger(novoItem.produtoId) || novoItem.produtoId <= 0) {
            throw new Error("ID do produto inválido.");
        }

        if (!novoItem.nome.trim()) {
            throw new Error("O nome do produto é obrigatório.");
        }

        if (!Number.isFinite(novoItem.precoUnitario) || novoItem.precoUnitario < 0) {
            throw new Error("O preço do produto é inválido.");
        }

        if (!Number.isInteger(novoItem.quantidade) || novoItem.quantidade <= 0) {
            throw new Error("A quantidade deve ser um número inteiro positivo.");
        }

        const itemExistente = this.itens.find(
            item => item.produtoId === novoItem.produtoId
        );

        if (itemExistente) {
            if (itemExistente.precoUnitario !== novoItem.precoUnitario) {
                throw new Error("O preço do produto mudou. Atualize o carrinho.");
            }

            itemExistente.quantidade += novoItem.quantidade;
        } else {
            this.itens.push({ ...novoItem });
        }
    }

    listarItens(): ItemCarrinho[] {
        return this.itens.map(item => ({ ...item }));
    }

    removerItem(produtoId: number): boolean {
        const indice = this.itens.findIndex(
            item => item.produtoId === produtoId
        );

        if (indice === -1) return false;

        this.itens.splice(indice, 1);
        return true;
    }

    calcularSubtotal(): number {
        const subtotal = this.itens.reduce(
            (total, item) => total + item.precoUnitario * item.quantidade,
            0
        );

        return Number(subtotal.toFixed(2));
    }

    limparCarrinho(): void {
        this.itens = [];
    }
}
