/**
 * O ÚNICO lugar do front que chama a API. Tela não faz `fetch` — tela chama uma
 * função daqui. É isto que impede a URL da API de aparecer espalhada em 15
 * componentes no dia em que ela mudar.
 *
 * Cada fatia acrescenta as suas funções neste arquivo (ou num irmão dele):
 *   listarLivros(), obterCarrinho(), fecharPedido()...
 */

const URL_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333/api';

export type CampoInvalido = {
  campo: string;
  mensagem: string;
};

/** Erro que a API devolveu com uma mensagem — dá para mostrar na tela. */
export class ErroDaApi extends Error {
  readonly status: number;
  readonly campos: CampoInvalido[];

  constructor(mensagem: string, status: number, campos: CampoInvalido[] = []) {
    super(mensagem);
    this.name = 'ErroDaApi';
    this.status = status;
    this.campos = campos;
  }

  mensagemParaTela(): string {
    const detalhes = this.campos.map((campo) => campo.mensagem);
    return detalhes.length > 0 ? detalhes.join(' ') : this.message;
  }
}

function lerCampos(corpo: { campos?: unknown } | null): CampoInvalido[] {
  if (!Array.isArray(corpo?.campos)) {
    return [];
  }

  return corpo.campos.flatMap((item: unknown) => {
    if (typeof item !== 'object' || item === null) {
      return [];
    }

    if (!('campo' in item) || !('mensagem' in item)) {
      return [];
    }

    const { campo, mensagem } = item;
    if (typeof campo !== 'string' || typeof mensagem !== 'string') {
      return [];
    }

    return [{ campo, mensagem }];
  });
}

export async function request<T>(caminho: string, opcoes: RequestInit = {}): Promise<T> {
  const resposta = await fetch(`${URL_BASE}${caminho}`, {
    ...opcoes,
    headers: { 'Content-Type': 'application/json', ...opcoes.headers },
    cache: 'no-store',
  });

  const corpo = await resposta.json().catch(() => null);

  if (!resposta.ok) {
   
    throw new ErroDaApi(
      corpo?.erro ?? 'Não foi possível falar com a API.',
      resposta.status,
      lerCampos(corpo),
    );
  }

  return corpo as T;
}

export type Saude = {
  status: 'ok' | 'degradado';
  api: 'ok';
  banco: 'conectado' | 'inacessivel';
};

export function obterSaude(): Promise<Saude> {
  return request<Saude>('/saude');
}

export type PublicUser = {
  id: string;
  nome: string;
  email: string;
  dtCriacao: string;
};

export type RegisterUserInput = {
  nome: string;
  email: string;
  senha: string;
};

export function registerUser(data: RegisterUserInput): Promise<PublicUser> {
  return request<PublicUser>('/usuarios', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
