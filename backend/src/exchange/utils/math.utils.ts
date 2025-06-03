export class MathUtils {
  static roundToDecimalPlaces(value: number, places: number = 2): number {
    return Number(value.toFixed(places));
  }

  static calculateConversion(amount: number, rate: number): number {
    return this.roundToDecimalPlaces(amount * rate);
  }
}
