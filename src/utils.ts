export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function getRandomFromList<T>(list: Array<T>): T {
  return list[getRandomNumber(0, list.length - 1)];
}
