export class FreteService {
    calcular(distanciaKm: number): number {
        if (!Number.isFinite(distanciaKm) || distanciaKm < 0) {
            throw new Error("A distância deve ser um número válido e não pode ser negativa.");
        }

        if (distanciaKm <= 3) return 5;
        if (distanciaKm <= 8) return 10;
        if (distanciaKm <= 15) return 15;

        return Number((15 + (distanciaKm - 15)).toFixed(2));
    }
}
