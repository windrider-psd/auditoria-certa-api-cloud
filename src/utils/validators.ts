export function validateCNPJ(cnpj: string): boolean {
    // Verifica se contém somente números
    if (!/^\d+$/.test(cnpj)) return false;

    if (cnpj.length !== 14) return false;

    // Elimina CNPJs com todos os dígitos iguais
    if (/^(\d)\1+$/.test(cnpj)) return false;

    const calcularDigito = (base: number[], pesos: number[]): number => {
        let soma = 0;
        for (let i = 0; i < pesos.length; i++) {
            soma += base[i] * pesos[i];
        }
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    const base: number[] = cnpj.slice(0, 12).split('').map(Number);
    const digitosVerificadores: number[] = cnpj.slice(12).split('').map(Number);

    const primeiroPeso: number[] = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const segundoPeso: number[] = [6, ...primeiroPeso];

    const primeiroDigito = calcularDigito(base, primeiroPeso);
    const segundoDigito = calcularDigito([...base, primeiroDigito], segundoPeso);

    return primeiroDigito === digitosVerificadores[0] &&
           segundoDigito === digitosVerificadores[1];
}