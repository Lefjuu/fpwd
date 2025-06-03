export class ValidationUtils {
  static isValidRate(rate: unknown): rate is number {
    return typeof rate === 'number' && !isNaN(rate) && rate > 0;
  }

  static isValidAmount(amount: unknown): amount is number {
    return this.isValidRate(amount);
  }

  static isValidApiResponse(data: unknown): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      'rate' in data &&
      typeof (data as { rate: unknown }).rate === 'number'
    );
  }
}
