"use client";

import { useRouter } from "next/navigation";
import { type SubmitEvent, useState } from "react";

import { AuthIcon } from "@/components/ui/AuthIcon";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HOME_PATH } from "@/shared/constants/routes";

import { useAuthStore } from "../lib/auth-store";

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const result = login({ username, password });

    if (!result.ok) {
      setErrorMessage(result.message ?? "No se pudo iniciar sesión.");
      return;
    }

    router.push(HOME_PATH);
  }

  return (
    <form
      className="flex w-full flex-col gap-6"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Input
            id="username"
            name="username"
            autoComplete="username"
            required
            placeholder="Alias o usuario"
            aria-label="Alias o usuario"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <p className="text-right text-xs leading-5 text-tertiary-text">
            ¿Olvidaste tu usuario?
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="Contraseña"
              aria-label="Contraseña"
              className="pr-12"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-4 flex w-5 cursor-pointer items-center justify-center"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
              onClick={() => setShowPassword((value) => !value)}
            >
              <AuthIcon name="eye" />
            </button>
          </div>
          <p className="text-right text-xs leading-5 text-tertiary-text">
            ¿Olvidaste tu contraseña?
          </p>
        </div>
      </div>

      {errorMessage ? (
        <p className="text-sm text-red-600" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <Button
        type="submit"
        endIcon={<AuthIcon name="login" />}
      >
        Iniciar sesión
      </Button>
    </form>
  );
}
