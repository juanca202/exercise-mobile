import Image from "next/image";

import { AUTH_LOGO, AuthIcon } from "@/components/ui/AuthIcon";

import { LoginForm } from "./LoginForm";

export function LoginScreen() {
  return (
    <main className="relative flex min-h-full flex-1 flex-col bg-gradient-to-b from-surface-muted from-[49%] to-primary-tint px-6 pb-10 pt-login-top">
      <div
        className="relative mx-auto shrink-0 overflow-hidden"
        style={{ width: AUTH_LOGO.width, height: AUTH_LOGO.height }}
      >
        <Image
          alt="Logo banca"
          className="size-full object-contain"
          height={AUTH_LOGO.height}
          priority
          src={AUTH_LOGO.src}
          width={AUTH_LOGO.width}
        />
      </div>

      <h1 className="mx-auto mt-8 max-w-welcome text-center text-h3 font-medium text-card-dark-to">
        Bienvenido a
        <br />
        tu banca móvil
      </h1>

      <p className="mx-auto mt-6 text-center text-h3 text-tertiary">
        Ingresa con usuario y contraseña
      </p>

      <div className="mx-auto mt-6 w-full max-w-form">
        <LoginForm />
      </div>

      <p className="mx-auto mt-8 text-center text-body font-semibold text-primary">
        Crear usuario
      </p>

      <div className="mx-auto mt-6 w-full max-w-form rounded-card bg-white px-3 py-2">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-card bg-surface-accent">
              <AuthIcon name="products" />
            </div>
            <span className="text-caption text-ink">Solicitar productos</span>
          </div>
          <AuthIcon name="chevron" rotate={180} />
        </div>
      </div>

      <p className="mx-auto mt-8 text-center text-caption font-bold text-primary underline">
        ¿Necesitas ayuda?
      </p>

      <p className="absolute right-6 bottom-8 text-caption text-secondary">
        Versión 1.02v
      </p>
    </main>
  );
}
