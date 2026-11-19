
import { Entregador } from "../models/Entregador";
import { entregadoresMock } from "../mocks/entregadoresMock";

export class EntregadorService {

    private entregadores: Entregador[];

    constructor() {
        this.entregadores = [...entregadoresMock];
    }

    listar(): Entregador[] {
        return [...this.entregadores];
    }

    buscarPorId(id: number): Entregador | undefined {
        return this.entregadores.find(
            entregador => entregador.id === id
        );
    }

    adicionar(entregador: Entregador): Entregador {
        const existe = this.buscarPorId(entregador.id);

        if (existe) {
            throw new Error("J\u00e1 existe um entregador com esse ID.");
        }

        this.entregadores.push(entregador);

        return entregador;
    }

    atualizar(
        id: number,
        dadosAtualizados: Entregador
    ): Entregador | undefined {

        const indice = this.entregadores.findIndex(
            entregador => entregador.id === id
        );

        if (indice === -1) {
            return undefined;
        }

        this.entregadores[indice] = {
            ...dadosAtualizados,
            id
        };

        return this.entregadores[indice];
    }

    remover(id: number): boolean {
        const indice = this.entregadores.findIndex(
            entregador => entregador.id === id
        );

        if (indice === -1) {
            return false;
        }

        this.entregadores.splice(indice, 1);

        return true;
    }
}
