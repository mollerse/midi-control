export function normalize(min, max, v) {
  return (v - min) / (max - min);
}

export function clamp(min, max, v) {
  return v < min ? min : v > max ? max : v;
}
