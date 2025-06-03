import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiConfig } from '../interfaces/exchange.interface';
import {
  ConfigurationValues,
  ConfigurationError,
} from '../types/configuration.types';

@Injectable()
export class ExchangeConfigurationService {
  constructor(private readonly configService: ConfigService) {}

  getConfiguration(): ApiConfig {
    const values = this.extractConfigurationValues();
    this.validateConfiguration(values);

    return {
      url: values.exchangeApiUrl,
      apiKey: values.exchangeApiKey,
    };
  }

  private extractConfigurationValues(): ConfigurationValues {
    return {
      exchangeApiUrl: this.configService.get<string>('EXCHANGE_API_URL') ?? '',
      exchangeApiKey: this.configService.get<string>('EXCHANGE_API_KEY') ?? '',
    };
  }

  private validateConfiguration(values: ConfigurationValues): void {
    if (!values.exchangeApiUrl) {
      throw new ConfigurationError('EXCHANGE_API_URL is not configured');
    }
    if (!values.exchangeApiKey) {
      throw new ConfigurationError('EXCHANGE_API_KEY is not configured');
    }
  }
}
