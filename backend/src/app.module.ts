import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalModule } from './modules/proposta.module';
import { ProposalModel } from './infrastructure/database/models/proposta.model';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [ProposalModel],
      synchronize: true,
      logging: false,
    }),
    ProposalModule,
  ],
})
export class AppModule {}
