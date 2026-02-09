export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, '');
  if (cleaned.length !== 11) return cpf;
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR');
}

export function formatDateForInput(date: string): string {
  return date.split('T')[0];
}

export function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length !== 11 || /^(\d)\1{10}$/.test(cleaned)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleaned.substring(i - 1, i)) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleaned.substring(10, 11))) return false;

  return true;
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'AGUARDANDO_COMPROVANTE': 'Aguardando Comprovante',
    'CONCLUIDA': 'Concluída',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'AGUARDANDO_COMPROVANTE': 'bg-yellow-100 text-yellow-800',
    'CONCLUIDA': 'bg-green-100 text-green-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}
