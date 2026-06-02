export type TransferIconName =
  | "wallet"
  | "arrows-retweet"
  | "users"
  | "circle-check"
  | "user-vneck"
  | "share-nodes"
  | "arrow-left"
  | "arrow-right"
  | "arrow-right-button"
  | "arrow-up"
  | "angles-down";

const ICON_SRC: Record<TransferIconName, string> = {
  wallet: "/images/transfer/icon-wallet.svg",
  "arrows-retweet": "/images/transfer/icon-arrows-retweet.svg",
  users: "/images/transfer/icon-users.svg",
  "circle-check": "/images/transfer/icon-circle-check.svg",
  "user-vneck": "/images/transfer/icon-user-vneck.svg",
  "share-nodes": "/images/transfer/icon-share-nodes.svg",
  "arrow-left": "/images/transfer/icon-arrow-left.svg",
  "arrow-right": "/images/transfer/icon-arrow-right.svg",
  "arrow-right-button": "/images/transfer/icon-arrow-right-button.svg",
  "arrow-up": "/images/transfer/icon-arrow-up.svg",
  "angles-down": "/images/transfer/icon-angles-down.svg",
};

/** Tamaño del frame según Figma (px). */
const ICON_FRAME: Record<TransferIconName, number> = {
  wallet: 16,
  "arrows-retweet": 24,
  users: 24,
  "circle-check": 26,
  "user-vneck": 16,
  "share-nodes": 20,
  "arrow-left": 20,
  "arrow-right": 16,
  "arrow-right-button": 20,
  "arrow-up": 16,
  "angles-down": 24,
};

type TransferIconProps = {
  name: TransferIconName;
  className?: string;
  size?: number;
  rotate?: number;
};

export const TRANSFER_LOGO_WORDMARK = {
  src: "/images/transfer/logo-wordmark.png",
  width: 118,
  height: 17,
} as const;

export function TransferIcon({
  name,
  className = "",
  size,
  rotate = 0,
}: TransferIconProps) {
  const frame = size ?? ICON_FRAME[name];

  return (
    <span
      aria-hidden
      className={`relative inline-block shrink-0 overflow-hidden ${className}`}
      style={{ width: frame, height: frame }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        className="block size-full max-w-none object-contain"
        src={ICON_SRC[name]}
        style={{
          transform: rotate ? `rotate(${rotate}deg)` : undefined,
        }}
      />
    </span>
  );
}
