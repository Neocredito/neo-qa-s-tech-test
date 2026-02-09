import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('proposals')
export class ProposalModel {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 11 })
  cpf: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column({ type: 'varchar', length: 50 })
  status: string;

  @Column({ type: 'text' })
  observations: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  documentUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
