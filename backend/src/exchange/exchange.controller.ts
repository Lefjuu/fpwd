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
import { ExchangeService } from './exchange.service';
import { Transaction } from './interfaces/transaction.interface';
import { SimulateTransactionDto } from './dto/simulate-transaction.dto';
import { DateUtils } from './utils/date.utils';

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
  ): Promise<Transaction> {
    return this.exchangeService.simulateTransaction(simulateDto.eur);
  }

  @Get('transactions')
  getTransactions(): {
    transactions: readonly Transaction[];
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
