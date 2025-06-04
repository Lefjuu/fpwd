export interface ConfigurationValues {
  exchangeApiUrl: string;
  exchangeApiKey: string;
}

export class ConfigurationError extends Error {
  constructor(message: string) {
    super(`Configuration Error: ${message}`);
    this.name = 'ConfigurationError';
  }
}
