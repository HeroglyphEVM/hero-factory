const compactNumberFormatter = new Intl.NumberFormat("en-US", {
  notation: "standard",
  maximumFractionDigits: 4,
});

export const formatDecimals = (num: string | number) => {
  if (num === 0) return num.toFixed(5);

  const magnitude = Math.floor(Math.log10(Math.abs(Number(num))));
  let precision;

  if (magnitude >= 0) {
    precision = 3;
  } else {
    // precision = Math.min(-magnitude + 2, 100);
    precision = Math.min(Math.max(2 - magnitude, 0), 100);
  }

  return compactNumberFormatter.format(parseFloat(Number(num).toFixed(precision)));
};
