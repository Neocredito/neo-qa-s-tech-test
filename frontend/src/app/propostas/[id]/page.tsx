'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { propostaService } from '@/services/api';
import { Proposta, UpdatePropostaDto } from '@/types/proposta';
import { formatCPF, formatDateForInput, validateCPF, getStatusLabel } from '@/utils/helpers';

export default function EditarPropostaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [proposta, setProposta] = useState<Proposta | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<UpdatePropostaDto>({
    nome: '',
    dataNascimento: '',
    status: '',
    observacoes: '',
  });

  useEffect(() => {
    if (id) {
      loadProposta();
    }
  }, [id]);

  const loadProposta = async () => {
    try {
      const data = await propostaService.getById(id);
      setProposta(data);
      setFormData({
        nome: data.nome,
        dataNascimento: formatDateForInput(data.dataNascimento),
        status: data.status,
        observacoes: data.observacoes,
      });
    } catch (error) {
      console.error('Erro ao carregar proposta:', error);
      setError('Erro ao carregar proposta');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (proposta?.status === 'CONCLUIDA') {
      setError('Não é possível editar uma proposta concluída');
      return;
    }

    setSaving(true);

    try {
      await propostaService.update(id, formData);
      router.push('/propostas/pendentes');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar proposta');
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Selecione um arquivo');
      return;
    }

    if (proposta?.status === 'CONCLUIDA') {
      setError('Proposta já concluída');
      return;
    }

    setUploading(true);
    setError('');

    try {
      await propostaService.uploadComprovante(id, selectedFile);
      alert('Comprovante enviado com sucesso! Proposta concluída.');
      router.push('/propostas/concluidas');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao enviar comprovante');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!proposta) {
    return (
      <div className="px-4 py-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Proposta não encontrada</p>
        </div>
      </div>
    );
  }

  const isConcluida = proposta.status === 'CONCLUIDA';

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          {isConcluida ? 'Visualizar' : 'Editar'} Proposta
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Status: <span className="font-semibold">{getStatusLabel(proposta.status)}</span>
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
              <label className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                disabled={isConcluida}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                CPF
              </label>
              <input
                type="text"
                value={formatCPF(proposta.cpf)}
                disabled
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm px-4 py-2 border bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Data de Nascimento
              </label>
              <input
                type="date"
                value={formData.dataNascimento}
                onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                disabled={isConcluida}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Observações
              </label>
              <textarea
                rows={4}
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                disabled={isConcluida}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm px-4 py-2 border disabled:bg-gray-100"
              />
            </div>

            {!isConcluida && (
              <>
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Importar Comprovante
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        PDF, JPG, JPEG ou PNG (máx. 10MB)
                      </p>
                    </div>
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={handleUpload}
                        disabled={uploading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
                      >
                        {uploading ? 'Enviando...' : 'Enviar Comprovante'}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 border-t pt-6">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400"
                  >
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </>
            )}

            {isConcluida && (
              <div className="flex justify-end border-t pt-6">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Voltar
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
