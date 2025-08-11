export function truncateString(string: string, maxLength: number) {
  if (string.length <= maxLength) {
    return string;
  } else {
    return string.slice(0, maxLength) + "...";
  }
}

export function closestNumber(target: number, num1: number, num2: number) {
  const diff1 = Math.abs(num1 - target);
  const diff2 = Math.abs(num2 - target);
  if (diff1 < diff2) {
    return num1;
  } else {
    return num2;
  }
}
