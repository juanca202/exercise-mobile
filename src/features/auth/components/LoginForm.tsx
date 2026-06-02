"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { AuthIcon } from "@/components/ui/AuthIcon";
import { Button, LoginSubmitIcon } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { HOME_PATH } from "@/shared/routes";

import { useAuthStore } from "../store/auth-store";

const INVALID_CREDENTIALS_MESSAGE = "Usuario o contraseña incorrectos";

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUsernameError("");
    setPasswordError("");
    setFormError("");

    let hasValidationError = false;

    if (!username.trim()) {
      setUsernameError("El usuario es obligatorio");
      hasValidationError = true;
    }

    if (!password) {
      setPasswordError("La contraseña es obligatoria");
      hasValidationError = true;
    }

    if (hasValidationError) {
      return;
    }

    const result = login({ username, password });

    if (result.success) {
      router.push(HOME_PATH);
      return;
    }

    if (result.error === "INVALID_CREDENTIALS") {
      setFormError(INVALID_CREDENTIALS_MESSAGE);
    }
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Input
            autoComplete="username"
            name="username"
            onValueChange={setUsername}
            placeholder="Alias o usuario"
            value={username}
            variant="login"
          />
          {usernameError ? (
            <p className="text-right text-caption text-red-600" role="alert">
              {usernameError}
            </p>
          ) : (
            <p className="text-right text-caption text-tertiary">
              ¿Olvidaste tu usuario?
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Input
            autoComplete="current-password"
            endAdornment={
              <button
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
                aria-pressed={showPassword}
                className="inline-flex shrink-0 items-center justify-center"
                onClick={() => setShowPassword((current) => !current)}
                type="button"
              >
                <AuthIcon name="eye" />
              </button>
            }
            name="password"
            onValueChange={setPassword}
            placeholder="Contraseña"
            type={showPassword ? "text" : "password"}
            value={password}
            variant="login"
          />
          {passwordError ? (
            <p className="text-right text-caption text-red-600" role="alert">
              {passwordError}
            </p>
          ) : (
            <p className="text-right text-caption text-tertiary">
              ¿Olvidaste tu contraseña?
            </p>
          )}
        </div>
      </div>

      {formError ? (
        <p className="text-center text-body text-red-600" role="alert">
          {formError}
        </p>
      ) : null}

      <Button
        className="h-button-login w-full"
        endIcon={<LoginSubmitIcon />}
        type="submit"
      >
        Iniciar sesión
      </Button>
    </form>
  );
}
