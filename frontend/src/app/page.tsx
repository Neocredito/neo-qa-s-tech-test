'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { propostaService } from '@/services/api';
import { Proposta } from '@/types/proposta';

export default function Home() {
  const [stats, setStats] = useState({
    total: 0,
    pendentes: 0,
    concluidas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [pendentes, concluidas] = await Promise.all([
        propostaService.getAll({ status: 'AGUARDANDO_COMPROVANTE' }),
        propostaService.getAll({ status: 'CONCLUIDA' }),
      ]);

      setStats({
        total: pendentes.length + concluidas.length,
        pendentes: pendentes.length,
        concluidas: concluidas.length,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Sistema de Gerenciamento de Propostas de Crédito
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total de Propostas
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {stats.total}
                </dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Aguardando Comprovante
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-yellow-600">
                  {stats.pendentes}
                </dd>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Concluídas
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-green-600">
                  {stats.concluidas}
                </dd>
              </div>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Ações Rápidas
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Link
                  href="/propostas/nova"
                  className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  ➕ Nova Proposta
                </Link>
                <Link
                  href="/propostas/pendentes"
                  className="inline-flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200"
                >
                  📋 Ver Pendentes
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
