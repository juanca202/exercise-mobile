"use client";

import Image from "next/image";
import type { ComponentProps } from "react";

/** Dimensiones nativas (viewBox) exportadas desde Figma */
export const AUTH_ICON_SPECS = {
  logo: { src: "/auth/logo.svg", width: 71.5, height: 74.371 },
  eye: { src: "/auth/eye.svg", width: 15, height: 11.667 },
  loginArrow: { src: "/auth/login-arrow.svg", width: 15, height: 13.125 },
  product: { src: "/auth/product-icon.svg", width: 15, height: 15 },
  chevron: { src: "/auth/chevron.svg", width: 36, height: 30.92 },
} as const;

export type AuthIconName = keyof typeof AUTH_ICON_SPECS;

type AuthIconProps = {
  name: AuthIconName;
  /** Ancho de referencia en px; la altura se calcula manteniendo el aspect ratio */
  size?: number;
  className?: string;
} & Omit<ComponentProps<typeof Image>, "src" | "alt" | "width" | "height">;

function getDisplaySize(
  spec: (typeof AUTH_ICON_SPECS)[AuthIconName],
  size: number,
) {
  const scale = size / spec.width;
  return {
    width: Math.round(spec.width * scale * 100) / 100,
    height: Math.round(spec.height * scale * 100) / 100,
  };
}

export function AuthIcon({
  name,
  size = 20,
  className = "",
  ...props
}: AuthIconProps) {
  const spec = AUTH_ICON_SPECS[name];
  const { width, height } = getDisplaySize(spec, size);

  return (
    <Image
      src={spec.src}
      alt=""
      width={width}
      height={height}
      aria-hidden
      className={`block shrink-0 object-contain ${className}`}
      style={{ width, height }}
      {...props}
    />
  );
}
