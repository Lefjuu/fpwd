export class DateUtils {
  static getCurrentTimestamp(): Date {
    return new Date();
  }

  static getCurrentISOString(): string {
    return new Date().toISOString();
  }
}
