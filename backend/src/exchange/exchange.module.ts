import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { ConfigurationService } from 'src/config/config';
import { ExchangeController } from 'src/exchange/exchange.controller';
import { ExchangeService } from 'src/exchange/exchange.service';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({
      ttl: 60, // 60 seconds
    }),
    ConfigModule,
  ],
  controllers: [ExchangeController],
  providers: [ExchangeService, ConfigurationService],
  exports: [ExchangeService],
})
export class ExchangeModule {}
