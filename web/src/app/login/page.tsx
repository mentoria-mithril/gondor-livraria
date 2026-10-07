"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { authenticateUser, ApiError } from '@/services/api';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const campoClassName =
  'h-11 rounded-xl border-[#e7ddcd] bg-white pl-10 text-sm text-[#2b241d] focus-visible:border-[#A60321] focus-visible:ring-[#A60321]/20';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [entering, setEntering] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);
    setEntering(true);

    try {
      await authenticateUser({ email, password });
      router.push('/');
    } catch (caught: unknown) {
      if (caught instanceof ApiError) {
        setErro(caught.message);
      } else {
        setErro("Could not log in. Please try again.");
      }
    } finally {
      setEntering(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f1e6] px-4 py-12">
      <Card className="w-full max-w-lg rounded-3xl border-white bg-white shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-normal tracking-tight text-[#2b241d]">
            Enter your account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit}>
            {erro && (
              <Alert variant="destructive" className="mb-5 border-red-200 bg-red-50 text-red-700">
                <AlertDescription className="text-red-700">{erro}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-3 mb-5">
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
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={campoClassName}
                />
              </div>
            </div>

            <div className="grid gap-2 mb-5">
              <Label htmlFor="senha" className="font-semibold text-[#2b241d]">
                Password
              </Label>
              <div className="relative flex items-center">
                <Lock
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3.5 size-4 text-[#a39a8d]"
                />
                <Input
                  id="senha"
                  name="senha"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={`${campoClassName} pr-11`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword((atual) => !atual)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-1.5 cursor-pointer text-[#a39a8d] hover:bg-transparent hover:text-[#2b241d]"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="size-4" />
                  ) : (
                    <Eye aria-hidden="true" className="size-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={entering}
              className="h-12 w-full cursor-pointer rounded-full bg-[#A60321] text-sm font-semibold text-white hover:bg-[#75182a]"
            >
              {entering ? 'Entering...' : 'Enter'}
              {!entering && <ArrowRight aria-hidden="true" className="size-4" />}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-[#e7ddcd] bg-transparent text-sm text-[#8a8177]">
          Dont have an account?{' '}
          <Link
            href="/register"
            className={buttonVariants({
              variant: 'link',
              className: 'h-auto px-1 text-[#A60321]',
            })}
          >
            Create account
          </Link>
        </CardFooter>
      </Card>
    </main>
  )
}
