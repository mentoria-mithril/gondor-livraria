import bcrypt from 'bcrypt';

export const RODADAS_BCRYPT = 10;

export async function hashSenha(senhaEmTexto: string): Promise<string> {
    return bcrypt.hash(senhaEmTexto, RODADAS_BCRYPT);
}

export async function compararSenha(senhaEmTexto: string, senhaHash: string): Promise<boolean> {
    return bcrypt.compare(senhaEmTexto, senhaHash);
}