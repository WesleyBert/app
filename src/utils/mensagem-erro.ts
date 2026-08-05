const MENSAGENS_POR_CODIGO: Record<string, string> = {
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/invalid-login-credentials': 'E-mail ou senha incorretos.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'Não encontramos uma conta com esse e-mail.',
  'auth/invalid-email': 'E-mail inválido.',
  'auth/missing-password': 'Informe sua senha.',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
  'auth/weak-password': 'A senha precisa ter ao menos 6 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas seguidas. Aguarde um pouco e tente de novo.',
  'auth/network-request-failed': 'Falha de conexão. Verifique sua internet.',
  'permission-denied': 'Você não tem permissão para realizar essa ação.',
};

function codigoFirebase(erro: unknown): string | null {
  if (erro && typeof erro === 'object' && 'code' in erro && typeof (erro as { code: unknown }).code === 'string') {
    return (erro as { code: string }).code;
  }
  return null;
}

export function mensagemDeErro(erro: unknown): string {
  const codigo = codigoFirebase(erro);
  if (codigo && MENSAGENS_POR_CODIGO[codigo]) return MENSAGENS_POR_CODIGO[codigo];

  const texto = erro instanceof Error ? erro.message : String(erro);
  const chaveEncontrada = Object.keys(MENSAGENS_POR_CODIGO).find((chave) => texto.includes(chave));
  if (chaveEncontrada) return MENSAGENS_POR_CODIGO[chaveEncontrada];
  if (texto.includes('INVALID_LOGIN_CREDENTIALS')) return MENSAGENS_POR_CODIGO['auth/invalid-credential'];

  if (erro instanceof Error && erro.message) return erro.message;
  return 'Tente novamente em instantes.';
}
