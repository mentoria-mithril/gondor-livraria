'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type SubmitEvent } from 'react';
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { registerUser, ErroDaApi, type PublicUser } from '@/services/api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const campoClassName =
  'h-11 rounded-xl border-[#e7ddcd] bg-white pl-10 text-sm text-[#2b241d] focus-visible:border-[#A60321] focus-visible:ring-[#A60321]/20';

export default function PaginaCadastro() {
  const router = useRouter();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function aoEnviar(evento: SubmitEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    try {
      const usuario: PublicUser = await registerUser({ nome, email, senha });
      router.push('/login');
    } catch (e: unknown) {
      if (e instanceof ErroDaApi) {
        setErro(e.mensagemParaTela());
      } else {
        setErro('Não foi possível cadastrar. Tente novamente.');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f1e6] px-4 py-12">
      <Card className="w-full max-w-lg rounded-3xl border-white bg-white shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-normal tracking-tight text-[#2b241d]">
            Crie sua conta
          </CardTitle>
        </CardHeader>

        <CardContent>
          {erro && (
            <Alert variant="destructive" className="mb-5 border-red-200 bg-red-50 text-red-700">
              <AlertDescription className="text-red-700">{erro}</AlertDescription>
            </Alert>
          )}

          <form className="flex flex-col gap-5" onSubmit={aoEnviar}>
            <div className="grid gap-2">
              <Label htmlFor="nome" className="font-semibold text-[#2b241d]">
                Nome
              </Label>
              <div className="relative flex items-center">
                <User
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 size-4 text-[#a39a8d]"
                />
                <Input
                  id="nome"
                  name="nome"
                  type="text"
                  autoComplete="name"
                  placeholder="Seu nome"
                  required
                  value={nome}
                  onChange={(evento) => setNome(evento.target.value)}
                  className={campoClassName}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email" className="font-semibold text-[#2b241d]">
                Email
              </Label>
              <div className="relative flex items-center">
                <Mail
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 size-4 text-[#a39a8d]"
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  required
                  value={email}
                  onChange={(evento) => setEmail(evento.target.value)}
                  className={campoClassName}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="senha" className="font-semibold text-[#2b241d]">
                Senha
              </Label>
              <div className="relative flex items-center">
                <Lock
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 size-4 text-[#a39a8d]"
                />
                <Input
                  id="senha"
                  name="senha"
                  type={mostrarSenha ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={senha}
                  onChange={(evento) => setSenha(evento.target.value)}
                  className={`${campoClassName} pr-11`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setMostrarSenha((atual) => !atual)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-1.5 cursor-pointer text-[#a39a8d] hover:bg-transparent hover:text-[#2b241d]"
                >
                  {mostrarSenha ? (
                    <EyeOff aria-hidden="true" className="size-4" />
                  ) : (
                    <Eye aria-hidden="true" className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={enviando}
              className="h-12 w-full cursor-pointer rounded-full bg-[#A60321] text-sm font-semibold text-white hover:bg-[#75182a]"
            >
              {enviando ? 'Cadastrando...' : 'Criar conta'}
              {!enviando && <ArrowRight aria-hidden="true" className="size-4" />}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-[#e7ddcd] bg-transparent text-sm text-[#8a8177]">
          Já possui uma conta?{' '}
          <Link
            href="/login"
            className={buttonVariants({
              variant: 'link',
              className: 'h-auto px-1 text-[#A60321]',
            })}
          >
            Entrar
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
