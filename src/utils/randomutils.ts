import { DateTime } from "luxon";

export function uuidv4():string{
    return crypto.randomUUID();
    
}

export function randomPhone(): string {
  return `+55 ${Math.floor(Math.random() * 90 + 10)} 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
}

export function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function randomBoolean(){
  return Math.random() < 0.5
}

export function generateCNPJ(): string {
  const numbers: number[] = [];
  for (let i = 0; i < 12; i++) {
    numbers.push(randomInt(0, 9));
  }

  const calcDigit = (nums: number[], weights: number[]) => {
    const sum = nums.reduce((acc, num, idx) => acc + num * weights[idx], 0);
    const mod = sum % 11;
    return mod < 2 ? 0 : 11 - mod;
  };

  const firstWeights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const secondWeights = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  numbers.push(calcDigit(numbers, firstWeights));
  numbers.push(calcDigit(numbers, secondWeights));

  return numbers.join('');
}


export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function generateCPF(): string {
  const numbers: number[] = [];
  for (let i = 0; i < 9; i++) {
    numbers.push(randomInt(0, 9));
  }

  // Calculate first check digit
  let sum = numbers.reduce((acc, num, idx) => acc + num * (10 - idx), 0);
  let firstDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  numbers.push(firstDigit);

  // Calculate second check digit
  sum = numbers.reduce((acc, num, idx) => acc + num * (11 - idx), 0);
  let secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  numbers.push(secondDigit);

  return numbers.join('');
}

export function randomIndexes<T>(arr: T[], n: number): T[] {
    if (n > arr.length) {
        throw new Error("Cannot pick more elements than the array length");
    }

    const result: T[] = [];
    const usedIndexes = new Set<number>();

    while (result.length < n) {
        const randomIndex = Math.floor(Math.random() * arr.length);
        if (!usedIndexes.has(randomIndex)) {
            usedIndexes.add(randomIndex);
            result.push(arr[randomIndex]);
        }
    }

    return result;
}



export function randomDateAroundNowSP(daysRange = 14) {
  const now = DateTime.now().setZone('America/Sao_Paulo');

  // Random day offset between -10 and +10
  const randomDays = (Math.random() * 2 - 1) * daysRange;

  // Random time offset in milliseconds (full 24h)
  const randomMsInDay = Math.floor(Math.random() * 24 * 60 * 60 * 1000);

  // Combine both
  const randomDate = now
    .plus({ days: randomDays })
    .startOf('day')
    .plus({ milliseconds: randomMsInDay });

  return randomDate.toJSDate(); // JS Date
}
