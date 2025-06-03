import { IsNumber, IsPositive } from 'class-validator';

export class SimulateTransactionDto {
  @IsNumber()
  @IsPositive()
  eur: number;
}
