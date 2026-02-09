import { DataSource } from 'typeorm';
import { ProposalModel } from './models/proposta.model';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'sqlite',
        database: 'database.sqlite',
        entities: [ProposalModel],
        synchronize: true,
        logging: false,
      });

      return dataSource.initialize();
    },
  },
];
