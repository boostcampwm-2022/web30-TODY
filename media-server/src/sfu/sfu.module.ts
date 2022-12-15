import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SfuGateway } from './sfu.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
  ],
  providers: [SfuGateway],
})
export class SfuModule {}
