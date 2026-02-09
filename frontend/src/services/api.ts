import axios from 'axios';
import { Proposta, CreatePropostaDto, UpdatePropostaDto, ApiResponse } from '@/types/proposta';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const propostaService = {
  async getAll(filters?: { status?: string; nome?: string; cpf?: string }): Promise<Proposta[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.nome) params.append('nome', filters.nome);
    if (filters?.cpf) params.append('cpf', filters.cpf);

    const response = await api.get<ApiResponse<Proposta[]>>(`/propostas?${params.toString()}`);
    return response.data.data;
  },

  async getById(id: string): Promise<Proposta> {
    const response = await api.get<ApiResponse<Proposta>>(`/propostas/${id}`);
    return response.data.data;
  },

  async create(data: CreatePropostaDto): Promise<Proposta> {
    const response = await api.post<ApiResponse<Proposta>>('/propostas', data);
    return response.data.data;
  },

  async update(id: string, data: UpdatePropostaDto): Promise<Proposta> {
    const response = await api.put<ApiResponse<Proposta>>(`/propostas/${id}`, data);
    return response.data.data;
  },

  async uploadComprovante(id: string, file: File): Promise<Proposta> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post<ApiResponse<Proposta>>(
      `/propostas/${id}/comprovante`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data;
  },
};
