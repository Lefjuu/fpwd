import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SimulateTransactionDto } from 'src/exchange/dto/simulate-transaction.dto';
import { DateUtils } from 'src/exchange/utils/date.utils';
import { ExchangeTransaction } from 'src/exchange/types';
import { ExchangeService } from 'src/exchange/exchange.service';

@Controller('exchange')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ExchangeController {
  constructor(private readonly exchangeService: ExchangeService) {}

  @Get('rate')
  async getExchangeRate(): Promise<{ rate: number; timestamp: string }> {
    const rate = await this.exchangeService.getExchangeRate();
    return {
      rate,
      timestamp: DateUtils.getCurrentISOString(),
    };
  }

  @Post('simulate')
  @HttpCode(HttpStatus.CREATED)
  async simulateTransaction(
    @Body() simulateDto: SimulateTransactionDto,
  ): Promise<ExchangeTransaction> {
    return this.exchangeService.simulateTransaction(simulateDto.eur);
  }

  @Get('transactions')
  getTransactions(): {
    transactions: readonly ExchangeTransaction[];
    count: number;
  } {
    const transactions = this.exchangeService.getTransactions();
    return {
      transactions,
      count: transactions.length,
    };
  }

  @Delete('transactions')
  @HttpCode(HttpStatus.NO_CONTENT)
  clearTransactions(): void {
    this.exchangeService.clearTransactions();
  }
}
