export interface ExchangeRateApiResponse {
  exchange_rate: number;
}

export interface ExchangeApiConfig {
  url: string;
  apiKey: string;
}

export interface ExchangeTransaction {
  eur: number;
  pln: number;
  rate: number;
  timestamp: Date;
}
