import {
  Injectable,
  Inject,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  ExchangeApiConfig,
  ExchangeRateApiResponse,
  ExchangeTransaction,
} from 'src/exchange/types';
import { ConfigurationService } from 'src/config/config';
import { ErrorHandler } from 'src/exchange/utils/error.handler';
import { ValidationUtils } from 'src/exchange/utils/validation.utils';
import { CacheUtils } from 'src/exchange/utils/cache.utils';
import { MathUtils } from 'src/exchange/utils/math.utils';
import { DateUtils } from 'src/exchange/utils/date.utils';

@Injectable()
export class ExchangeService {
  private readonly logger = new Logger(ExchangeService.name);
  private readonly errorHandler = new ErrorHandler(this.logger);
  private readonly CACHE_KEY = 'EUR_PLN_RATE';
  private readonly CACHE_TTL = 60 * 1000;
  private readonly transactions: ExchangeTransaction[] = [];
  private readonly apiConfig: ExchangeApiConfig;

  constructor(
    private readonly configurationService: ConfigurationService,
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    this.apiConfig = this.configurationService.getConfig();
  }

  async getExchangeRate(): Promise<number> {
    try {
      const cachedRate = await this.getCachedRate();
      if (cachedRate !== null) {
        return cachedRate;
      }

      const freshRate = await this.fetchFreshRate();
      await this.cacheRate(freshRate);
      return freshRate;
    } catch (error: unknown) {
      return this.handleRateError(error);
    }
  }

  private async getCachedRate(): Promise<number | null> {
    const cachedRate = await CacheUtils.safeGet<number>(
      this.cacheManager,
      this.CACHE_KEY,
      this.logger,
    );
    return ValidationUtils.isValidRate(cachedRate) ? cachedRate : null;
  }

  private async fetchFreshRate(): Promise<number> {
    const response = await firstValueFrom(
      this.httpService.get<ExchangeRateApiResponse>(this.apiConfig.url, {
        headers: { 'x-api-key': this.apiConfig.apiKey },
        timeout: 5000,
      }),
    );

    const rate = response.data?.exchange_rate;
    if (!ValidationUtils.isValidRate(rate)) {
      throw new InternalServerErrorException(
        `Invalid rate received from API: ${String(rate)}`,
      );
    }

    return rate;
  }

  private async cacheRate(rate: number): Promise<void> {
    await CacheUtils.safeSet(
      this.cacheManager,
      this.CACHE_KEY,
      rate,
      this.CACHE_TTL,
      this.logger,
    );
  }

  private async handleRateError(error: unknown): Promise<number> {
    this.errorHandler.logError(error);
    return this.getFallbackRate();
  }

  private async getFallbackRate(): Promise<number> {
    const fallbackRate = await this.getCachedRate();

    if (fallbackRate !== null) {
      this.logger.warn('Using stale cached rate as fallback');
      return fallbackRate;
    }

    throw new InternalServerErrorException(
      'Exchange rate unavailable - no cached data available',
    );
  }

  async simulateTransaction(eur: number): Promise<ExchangeTransaction> {
    this.validateEurAmount(eur);

    const rate = await this.getExchangeRate();
    const transaction = this.createTransaction(eur, rate);

    this.transactions.push(transaction);
    this.logger.debug(
      `Transaction simulated: ${eur} EUR -> ${transaction.pln} PLN`,
    );

    return transaction;
  }

  private validateEurAmount(eur: number): void {
    if (!ValidationUtils.isValidAmount(eur)) {
      throw new InternalServerErrorException('Invalid EUR amount provided');
    }
  }

  private createTransaction(eur: number, rate: number): ExchangeTransaction {
    return {
      eur,
      pln: MathUtils.calculateConversion(eur, rate),
      rate,
      timestamp: DateUtils.getCurrentTimestamp(),
    };
  }

  getTransactions(): readonly ExchangeTransaction[] {
    return Object.freeze([...this.transactions]);
  }

  getTransactionCount(): number {
    return this.transactions.length;
  }

  clearTransactions(): void {
    this.transactions.length = 0;
    this.logger.debug('Transaction history cleared');
  }
}
