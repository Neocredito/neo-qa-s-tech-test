'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { propostaService } from '@/services/api';
import { CreatePropostaDto } from '@/types/proposta';
import { formatCPF, validateCPF } from '@/utils/helpers';

export default function NovaPropostaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreatePropostaDto>({
    nome: '',
    cpf: '',
    dataNascimento: '',
    observacoes: '',
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.nome || formData.nome.length < 3) {
      setError('Nome deve ter pelo menos 3 caracteres');
      return;
    }

    if (!validateCPF(formData.cpf)) {
      setError('CPF inválido');
      return;
    }

    const birthDate = new Date(formData.dataNascimento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      setError('Deve ser maior de 18 anos');
      return;
    }

    if (!formData.observacoes || formData.observacoes.trim().length === 0) {
      setError('Observações são obrigatórias');
      return;
    }

    setLoading(true);

    try {
      await propostaService.create(formData);
      router.push('/propostas/pendentes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar proposta');
    } finally {
      setLoading(false);
    }
  };

  const handleCpfChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    setFormData({ ...formData, cpf: cleaned });
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nova Proposta</h1>
        <p className="mt-2 text-sm text-gray-700">
          Preencha os dados para cadastrar uma nova proposta
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome Completo *
              </label>
              <input
                type="text"
                id="nome"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                placeholder="Digite o nome completo"
              />
            </div>

            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
                CPF *
              </label>
              <input
                type="text"
                id="cpf"
                required
                value={formatCPF(formData.cpf)}
                onChange={(e) => handleCpfChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                placeholder="000.000.000-00"
                maxLength={14}
              />
            </div>

            <div>
              <label htmlFor="dataNascimento" className="block text-sm font-medium text-gray-700">
                Data de Nascimento *
              </label>
              <input
                type="date"
                id="dataNascimento"
                required
                value={formData.dataNascimento}
                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
              />
            </div>

            <div>
              <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">
                Observações *
              </label>
              <textarea
                id="observacoes"
                required
                rows={4}
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
                placeholder="Digite as observações sobre a proposta"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400"
              >
                {loading ? 'Salvando...' : 'Criar Proposta'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
