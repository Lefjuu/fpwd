import { Logger } from '@nestjs/common';
import { AxiosError } from 'axios';

export interface ErrorDetails {
  message: string;
  status?: number;
  statusText?: string;
  data?: unknown;
}

export class ErrorHandler {
  constructor(private readonly logger: Logger) {}

  extractErrorDetails(error: unknown): ErrorDetails {
    if (error instanceof AxiosError) {
      return {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
      };
    }

    return {
      message: 'Unknown error occurred',
      data: error,
    };
  }

  logError(error: unknown): void {
    const details = this.extractErrorDetails(error);

    if (details.status) {
      this.logger.error(
        `API Error: ${details.status} ${details.statusText || ''} - ${details.message}`,
        JSON.stringify(details.data),
      );
    } else {
      this.logger.error(
        `Error: ${details.message}`,
        error instanceof Error ? error.stack : undefined,
      );
    }
  }
}
