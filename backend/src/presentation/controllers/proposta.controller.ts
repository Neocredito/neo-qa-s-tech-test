import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateProposalUseCase } from '../../application/use-cases/create-proposta.use-case';
import { UpdateProposalUseCase } from '../../application/use-cases/update-proposta.use-case';
import { ListProposalsUseCase } from '../../application/use-cases/list-propostas.use-case';
import { GetProposalByIdUseCase } from '../../application/use-cases/get-proposta-by-id.use-case';
import { UploadDocumentUseCase } from '../../application/use-cases/upload-comprovante.use-case';
import { CreateProposalRequestDto } from '../dtos/create-proposta-request.dto';
import { UpdateProposalRequestDto } from '../dtos/update-proposta-request.dto';
import { ProposalStatus } from '../../domain/value-objects/proposta-status.vo';
import { ProposalTranslationMapper } from '../mappers/proposal-translation.mapper';

@Controller('propostas')
export class ProposalController {
  constructor(
    private readonly createProposalUseCase: CreateProposalUseCase,
    private readonly updateProposalUseCase: UpdateProposalUseCase,
    private readonly listProposalsUseCase: ListProposalsUseCase,
    private readonly getProposalByIdUseCase: GetProposalByIdUseCase,
    private readonly uploadDocumentUseCase: UploadDocumentUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateProposalRequestDto) {
    try {
      // Converter de PT (request) para EN (domain)
      const internalDto = ProposalTranslationMapper.requestToInternal(dto);
      const proposal = await this.createProposalUseCase.execute(internalDto);
      
      // Converter de EN (domain) para PT (response)
      const response = ProposalTranslationMapper.internalToResponse(proposal.toJSON());
      
      return {
        success: true,
        data: response,
        message: 'Proposta criada com sucesso',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get()
  async list(
    @Query('status') status?: string,
    @Query('nome') nome?: string,
    @Query('cpf') cpf?: string,
  ) {
    try {
      const filters: any = {};

      // Converter status de PT para EN
      if (status) {
        const statusMap: Record<string, string> = {
          'AGUARDANDO_COMPROVANTE': ProposalStatus.PENDING_DOCUMENT,
          'CONCLUIDA': ProposalStatus.COMPLETED,
        };
        filters.status = statusMap[status] || status;
      }

      if (nome) {
        filters.name = nome;
      }

      if (cpf) {
        filters.cpf = cpf;
      }

      const proposals = await this.listProposalsUseCase.execute(filters);
      
      // Converter responses de EN para PT
      const responses = proposals.map((p) => 
        ProposalTranslationMapper.internalToResponse(p.toJSON())
      );

      return {
        success: true,
        data: responses,
        count: responses.length,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    try {
      const proposal = await this.getProposalByIdUseCase.execute(id);
      const response = ProposalTranslationMapper.internalToResponse(proposal.toJSON());
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateProposalRequestDto) {
    try {
      // Converter de PT para EN
      const internalDto = ProposalTranslationMapper.requestToInternal(dto);
      const proposal = await this.updateProposalUseCase.execute(id, internalDto);
      
      // Converter de EN para PT
      const response = ProposalTranslationMapper.internalToResponse(proposal.toJSON());
      
      return {
        success: true,
        data: response,
        message: 'Proposta atualizada com sucesso',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post(':id/comprovante')
  @UseInterceptors(FileInterceptor('file'))
  async uploadComprovante(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Arquivo não fornecido');
    }

    try {
      const proposal = await this.uploadDocumentUseCase.execute(id, file);
      const response = ProposalTranslationMapper.internalToResponse(proposal.toJSON());
      
      return {
        success: true,
        data: response,
        message: 'Comprovante anexado com sucesso. Proposta concluída!',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
