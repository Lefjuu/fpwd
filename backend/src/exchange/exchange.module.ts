import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { ExchangeController } from './exchange.controller';
import { ExchangeService } from './exchange.service';
import { ExchangeConfigurationService } from './services/configuration.service';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({
      ttl: 60, // 60 seconds
    }),
    ConfigModule,
  ],
  controllers: [ExchangeController],
  providers: [ExchangeService, ExchangeConfigurationService],
  exports: [ExchangeService],
})
export class ExchangeModule {}
