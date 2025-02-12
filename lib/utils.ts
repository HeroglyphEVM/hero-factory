import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLargeNumber(num: number | string): string {
  const parsedNum = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(parsedNum)) {
    return 'Invalid number';
  }

  if (parsedNum >= 1e12) {
    return (parsedNum / 1e12).toFixed(2).replace(/\.00$/, '') + ' T';
  } else if (parsedNum >= 1e9) {
    return (parsedNum / 1e9).toFixed(2).replace(/\.00$/, '') + ' B';
  } else if (parsedNum >= 1e3) {
    return parsedNum.toLocaleString('en-US', { maximumFractionDigits: 2 });
  } else {
    return parsedNum.toString();
  }
}

