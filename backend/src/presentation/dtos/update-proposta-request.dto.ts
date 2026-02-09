import { IsString, IsOptional, MinLength, IsEnum, IsDateString } from 'class-validator';

export class UpdateProposalRequestDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  nome?: string;

  @IsDateString({}, { message: 'Data de nascimento deve ser uma data válida' })
  @IsOptional()
  dataNascimento?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  observacoes?: string;
}
