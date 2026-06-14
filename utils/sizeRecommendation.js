const SIZE_TABLE = [
  { size: 'XS', chest: [0, 81], waist: [0, 62], hips: [0, 87] },
  { size: 'S', chest: [82, 88], waist: [63, 68], hips: [88, 93] },
  { size: 'M', chest: [89, 94], waist: [69, 74], hips: [94, 99] },
  { size: 'L', chest: [95, 102], waist: [75, 82], hips: [100, 107] },
  { size: 'XL', chest: [103, 110], waist: [83, 90], hips: [108, 115] },
  { size: 'XXL', chest: [111, Infinity], waist: [91, Infinity], hips: [116, Infinity] },
];

function getSizeForMeasurement(value, rangeKey) {
  for (let i = 0; i < SIZE_TABLE.length; i++) {
    const [min, max] = SIZE_TABLE[i][rangeKey];
    if (value >= min && value <= max) return i;
  }
  return SIZE_TABLE.length - 1;
}

export function getSizeRecommendation(chest, waist, hips) {
  const chestIdx = getSizeForMeasurement(chest, 'chest');
  const waistIdx = getSizeForMeasurement(waist, 'waist');
  const hipsIdx = getSizeForMeasurement(hips, 'hips');
  const maxIdx = Math.max(chestIdx, waistIdx, hipsIdx);
  return SIZE_TABLE[maxIdx].size;
}
