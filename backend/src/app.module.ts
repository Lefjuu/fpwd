import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { ExchangeModule } from 'src/exchange/exchange.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ExchangeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
