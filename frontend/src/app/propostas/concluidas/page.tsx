'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { propostaService } from '@/services/api';
import { Proposta } from '@/types/proposta';
import { formatCPF, formatDate, getStatusLabel, getStatusColor } from '@/utils/helpers';

export default function PropostasConcluidasPage() {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ nome: '', cpf: '' });

  useEffect(() => {
    loadPropostas();
  }, []);

  const loadPropostas = async () => {
    setLoading(true);
    try {
      const data = await propostaService.getAll({
        status: 'CONCLUIDA',
        ...filters,
      });
      setPropostas(data);
    } catch (error) {
      console.error('Erro ao carregar propostas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    loadPropostas();
  };

  const clearFilters = () => {
    setFilters({ nome: '', cpf: '' });
    setTimeout(() => loadPropostas(), 100);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Propostas Concluídas</h1>
        <p className="mt-2 text-sm text-gray-700">
          Propostas que já foram finalizadas com comprovantes
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow sm:rounded-lg mb-6 p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="filterNome" className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              id="filterNome"
              value={filters.nome}
              onChange={(e) => setFilters({ ...filters, nome: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
              placeholder="Filtrar por nome"
            />
          </div>
          <div>
            <label htmlFor="filterCpf" className="block text-sm font-medium text-gray-700">
              CPF
            </label>
            <input
              type="text"
              id="filterCpf"
              value={filters.cpf}
              onChange={(e) => setFilters({ ...filters, cpf: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border"
              placeholder="Filtrar por CPF"
            />
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={handleFilter}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
            >
              Filtrar
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Propostas */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : propostas.length === 0 ? (
        <div className="text-center py-12 bg-white shadow sm:rounded-lg">
          <p className="text-gray-500">Nenhuma proposta encontrada</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Nascimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {propostas.map((proposta) => (
                <tr key={proposta.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {proposta.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCPF(proposta.cpf)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(proposta.dataNascimento)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(proposta.status)}`}>
                      {getStatusLabel(proposta.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/propostas/${proposta.id}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Visualizar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
