import { AuthIcon } from "@/components/ui/auth-icon";

import { LoginForm } from "./LoginForm";

export function LoginPage() {
  return (
    <main className="relative flex min-h-full w-full flex-1 flex-col bg-gradient-to-b from-login-gradient-from from-[49%] to-login-gradient-to">
      <div className="mx-auto flex w-full max-w-[360px] flex-1 flex-col px-6 pb-8">
        <div className="flex flex-col items-center pt-[59px]">
          <AuthIcon name="logo" size={71.5} priority />

          <h1 className="mt-6 max-w-[264px] text-center text-xl leading-[30px] font-normal text-foreground">
            Bienvenido a
            <br />
            tu banca móvil
          </h1>

          <p className="mt-2 text-center text-base leading-6 text-tertiary-text">
            Ingresa con usuario y contraseña
          </p>
        </div>

        <div className="mt-8 w-full">
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm leading-[22px] font-semibold text-primary">
          Crear usuario
        </p>

        <div className="mt-6 flex w-full items-center gap-4 rounded-lg bg-background px-3 py-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-muted">
            <AuthIcon name="product" size={20} />
          </div>
          <span className="flex-1 text-xs leading-5 text-[#181c1e]">
            Solicitar productos
          </span>
          <AuthIcon name="chevron" size={16} className="rotate-180" />
        </div>

        <p className="mt-8 text-center text-xs leading-4 font-bold text-primary underline">
          ¿Necesitas ayuda?
        </p>

        <p className="mt-auto pt-6 text-right text-[8px] leading-5 text-secondary-text">
          Versión 1.02v
        </p>
      </div>
    </main>
  );
}
