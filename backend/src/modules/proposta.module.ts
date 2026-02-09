import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProposalModel } from '../infrastructure/database/models/proposta.model';
import { TypeOrmProposalRepository } from '../infrastructure/database/repositories/typeorm-proposta.repository';
import { CreateProposalUseCase } from '../application/use-cases/create-proposta.use-case';
import { UpdateProposalUseCase } from '../application/use-cases/update-proposta.use-case';
import { ListProposalsUseCase } from '../application/use-cases/list-propostas.use-case';
import { GetProposalByIdUseCase } from '../application/use-cases/get-proposta-by-id.use-case';
import { UploadDocumentUseCase } from '../application/use-cases/upload-comprovante.use-case';
import { ProposalController } from '../presentation/controllers/proposta.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProposalModel])],
  controllers: [ProposalController],
  providers: [
    {
      provide: 'IProposalRepository',
      useClass: TypeOrmProposalRepository,
    },
    {
      provide: CreateProposalUseCase,
      useFactory: (repository: TypeOrmProposalRepository) => {
        return new CreateProposalUseCase(repository);
      },
      inject: [TypeOrmProposalRepository],
    },
    {
      provide: UpdateProposalUseCase,
      useFactory: (repository: TypeOrmProposalRepository) => {
        return new UpdateProposalUseCase(repository);
      },
      inject: [TypeOrmProposalRepository],
    },
    {
      provide: ListProposalsUseCase,
      useFactory: (repository: TypeOrmProposalRepository) => {
        return new ListProposalsUseCase(repository);
      },
      inject: [TypeOrmProposalRepository],
    },
    {
      provide: GetProposalByIdUseCase,
      useFactory: (repository: TypeOrmProposalRepository) => {
        return new GetProposalByIdUseCase(repository);
      },
      inject: [TypeOrmProposalRepository],
    },
    {
      provide: UploadDocumentUseCase,
      useFactory: (repository: TypeOrmProposalRepository) => {
        return new UploadDocumentUseCase(repository);
      },
      inject: [TypeOrmProposalRepository],
    },
    TypeOrmProposalRepository,
  ],
  exports: [TypeOrmProposalRepository],
})
export class ProposalModule {}
