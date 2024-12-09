export function getPrizeIndex(degrees, slices) {
  let prizeDegree = 0;
  for (let i = slices.length - 1; i >= 0; i--) {
    prizeDegree += slices[i].degrees;
    if (prizeDegree > degrees) {
      return i;
    }
  }
  return 0; // fallback
}
