import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ExchangeApiConfig } from 'src/exchange/types';
import { ConfigurationValues, ConfigurationError } from 'src/config/types';

@Injectable()
export class ConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  getConfig(): ExchangeApiConfig {
    const values = this.extractConfigValues();
    this.validateConfig(values);

    return {
      url: values.exchangeApiUrl,
      apiKey: values.exchangeApiKey,
    };
  }

  private extractConfigValues(): ConfigurationValues {
    return {
      exchangeApiUrl: this.configService.get<string>('EXCHANGE_API_URL') ?? '',
      exchangeApiKey: this.configService.get<string>('EXCHANGE_API_KEY') ?? '',
    };
  }

  private validateConfig(values: ConfigurationValues): void {
    if (!values.exchangeApiUrl) {
      throw new ConfigurationError('EXCHANGE_API_URL is not configured');
    }
    if (!values.exchangeApiKey) {
      throw new ConfigurationError('EXCHANGE_API_KEY is not configured');
    }
  }
}
