export function mensagemErro(error) {
  const body = error?.response?.data;
  if (typeof body === 'string' && body.trim()) return body;
  if (body?.erro) return body.erro;
  if (body?.error) return body.error;
  if (body?.message) return body.message;
  if (error?.code === 'ECONNABORTED') return 'A requisição demorou demais. Tente novamente.';
  if (error?.message === 'A API não retornou um token JWT.') return error.message;
  if (!error?.response) return 'Não foi possível conectar à API. Confira sua internet.';
  return 'Ocorreu um erro. Tente novamente.';
}
export function precoBR(value) {
  return Number(value || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
export function dataBR(value) {
  if (!value) return 'Data não informada';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('pt-BR');
}
export function numeroDigitado(value) {
  return Number(String(value).trim().replace(',', '.'));
}
export function listaDados(value) {
  return Array.isArray(value) ? value : [];
}
