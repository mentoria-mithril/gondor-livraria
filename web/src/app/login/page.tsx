'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, type SubmitEvent } from 'react'
import { autenticarUsuario, ErroDaApi } from '@/services/api'

export default function PaginaLogin() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    async function aoEnviar(evento: SubmitEvent<HTMLFormElement>) {
        evento.preventDefault();
        setErro(null);
        setEnviando(true);

        try {
            await autenticarUsuario({ email, senha });
            router.push('/');
        } catch (e) {
            if (e instanceof ErroDaApi) {
                setErro(e.message);
            } else {
                setErro('Não foi possivel fazer login. Tente novamente.')
            } 
        } finally {
            setEnviando(false);
        }
    }

    return (
        <main className="mx-auto flex min-h-screen max-w-md flex-col gap-6 px-6 py-16">
          <header>
            <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200">
              ← Voltar
            </Link>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">Entrar na conta</h1>
          </header>
          {erro && (
            <div
              role="alert"
              className="rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
            >
              {erro}
            </div>
          )}
          <form onSubmit={aoEnviar} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Email</span>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Senha</span>
              <input
                type="password"
                autoComplete="current-password"
                required
                minLength={6}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="rounded-md border border-zinc-300 bg-white px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
              />
            </label>
            <button
              type="submit"
              disabled={enviando}
              className="mt-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {enviando ? 'Entrando…' : 'Entrar'}
            </button>

          </form>
             <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Não tem conta?{' '}
            <Link href="/cadastro" className="font-medium underline underline-offset-2">
              Criar conta
            </Link>
          </p>
        </main>
      )
}
