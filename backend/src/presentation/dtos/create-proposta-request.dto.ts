import { IsString, IsNotEmpty, MinLength, Matches, IsDateString } from 'class-validator';

export class CreateProposalRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @MinLength(3, { message: 'Nome deve ter pelo menos 3 caracteres' })
  nome: string;

  @IsString()
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/, {
    message: 'CPF deve estar no formato válido (000.000.000-00 ou 00000000000)',
  })
  cpf: string;

  @IsDateString({}, { message: 'Data de nascimento deve ser uma data válida' })
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória' })
  dataNascimento: string;

  @IsString()
  @IsNotEmpty({ message: 'Observações são obrigatórias' })
  observacoes: string;
}
