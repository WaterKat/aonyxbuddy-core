export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function lerp(delta: number, min: number, max: number) {
  return min + (max - min) * delta;
}

export function inverseLerp(value: number, min: number, max: number) {
  if (min === max) {
    return 0; // Avoid division by zero
  }
  return (value - min) / (max - min);
}

export function lerpedSin(input: number, min: number, max: number) {
  return lerp((Math.sin(input) + 1) / 2, min, max);
}

export function randomBetween(min: number, max: number) {
  return lerp(Math.random(), min, max);
}

export function randomPlusOrMinus(average: number, plusOrMinus: number) {
  return lerp(Math.random(), average - plusOrMinus, average + plusOrMinus);
}
