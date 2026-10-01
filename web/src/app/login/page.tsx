"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";

import { autenticarUsuario, ErroDaApi } from "@/services/api";

export default function PaginaLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function aoEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      await autenticarUsuario({ email, senha });
      router.push("/");
    } catch (e: unknown) {
      if (e instanceof ErroDaApi) {
        setErro(e.message);
      } else {
        setErro("Não foi possível fazer login. Tente novamente.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f1e6] px-4 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-white bg-white p-6 shadow-xl sm:p-9">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-normal tracking-tight text-[#2b241d]">
            Bem-vindo de volta
          </h1>
          <p className="mt-2 text-[#8a8177]">
            Entre com sua conta para continuar sua leitura
          </p>
        </header>

        {erro && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
          >
            {erro}
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={aoEnviar}>
          <div className="grid gap-2">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-[#2b241d]"
            >
              Email
            </label>

            <div className="relative flex items-center">
              <Mail
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 size-4 text-[#a39a8d]"
              />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                className="h-11 w-full rounded-xl border border-[#e7ddcd] bg-white pl-10 pr-4 text-sm text-[#2b241d] outline-none focus:ring-2 focus:ring-[#8b1e2f]/20"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <label
              htmlFor="senha"
              className="text-sm font-semibold text-[#2b241d]"
            >
              Senha
            </label>

            <div className="relative flex items-center">
              <Lock
                aria-hidden="true"
                className="pointer-events-none absolute left-3.5 size-4 text-[#a39a8d]"
              />
              <input
                id="senha"
                name="senha"
                type={mostrarSenha ? "text" : "password"}
                autoComplete="current-password"
                required
                minLength={6}
                value={senha}
                onChange={(evento) => setSenha(evento.target.value)}
                className="h-11 w-full rounded-xl border border-[#e7ddcd] bg-white pl-10 pr-11 text-sm text-[#2b241d] outline-none focus:ring-2 focus:ring-[#8b1e2f]/20"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha((atual) => !atual)}
                aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-3.5 text-[#a39a8d] hover:text-[#2b241d]"
              >
                {mostrarSenha ? (
                  <EyeOff aria-hidden="true" className="size-4" />
                ) : (
                  <Eye aria-hidden="true" className="size-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#A60321] text-sm font-semibold text-white hover:bg-[#75182a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? "Entrando..." : "Entrar"}
            {!enviando && <ArrowRight aria-hidden="true" className="size-4" />}
          </button>
        </form>

        <footer className="mt-8 border-t border-[#e7ddcd] pt-5 text-center text-sm text-[#8a8177]">
          Novo por aqui?{" "}
          <Link
            href="/cadastro"
            className="font-medium text-[#A60321] hover:underline"
          >
            Crie sua conta gratuitamente
          </Link>
        </footer>
      </section>
    </main>
  );
}