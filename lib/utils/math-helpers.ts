export class MathHelpers {
  static clamp(value: number, min: number, max: number): number {
    if (min > max) {
      throw new Error(
        "Minimum value must be less than or equal to maximum value",
      );
    }
    return Math.max(min, Math.min(max, value));
  }

  static roundToNearest(value: number, step: number): number {
    return Math.round(value / step) * step;
  }

  static strip(value: number): number {
    // rounds off floating point errors
    return Number(value.toPrecision(12));
  }
}
