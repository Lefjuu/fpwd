export class DateUtils {
  static getCurrentTimestamp(): Date {
    return new Date();
  }

  static getCurrentISOString(): string {
    return new Date().toISOString();
  }

  static formatTimestamp(date: Date): string {
    return date.toISOString();
  }
}
