export class FreteService {

    calcular(distanciaKm: number): number {

        if (distanciaKm < 0) {
            throw new Error("A distância não pode ser negativa.");
        }

        if (distanciaKm <= 3) {
            return 5;
        }

        if (distanciaKm <= 8) {
            return 10;
        }

        if (distanciaKm <= 15) {
            return 15;
        }

        return 15 + (distanciaKm - 15);
    }

}