import type { CSSProperties } from "react";

type AuthIconName = "eye" | "login" | "products" | "chevron";

const ICON_SRC: Record<AuthIconName, string> = {
  eye: "/images/auth/icon-eye.svg",
  login: "/images/auth/icon-login.svg",
  products: "/images/auth/icon-products.svg",
  chevron: "/images/auth/icon-chevron.svg",
};

/** Insets del glifo dentro del frame, según export Figma (node 36:1533). */
const ICON_INSETS: Record<AuthIconName, CSSProperties> = {
  eye: {
    top: "20.83%",
    right: "12.5%",
    bottom: "20.83%",
    left: "12.5%",
  },
  login: {
    top: "17.19%",
    right: "12.5%",
    bottom: "17.19%",
    left: "12.5%",
  },
  products: {
    top: "12.5%",
    right: "12.5%",
    bottom: "12.5%",
    left: "12.5%",
  },
  chevron: {
    top: "17.79%",
    right: "12.5%",
    bottom: "17.79%",
    left: "12.5%",
  },
};

const ICON_FRAME: Record<AuthIconName, number> = {
  eye: 20,
  login: 20,
  products: 20,
  chevron: 16,
};

interface AuthIconProps {
  name: AuthIconName;
  className?: string;
  rotate?: number;
}

export function AuthIcon({ name, className = "", rotate = 0 }: AuthIconProps) {
  const size = ICON_FRAME[name];

  return (
    <span
      aria-hidden
      className={`relative inline-block shrink-0 overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <span className="absolute" style={ICON_INSETS[name]}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt=""
          className="block size-full"
          src={ICON_SRC[name]}
          style={{
            transform: rotate ? `rotate(${rotate}deg)` : undefined,
          }}
        />
      </span>
    </span>
  );
}

export const AUTH_LOGO = {
  src: "/images/auth/logo.svg",
  width: 71.5,
  height: 74.371,
} as const;
