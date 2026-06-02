"use client";

import { Menu } from "@base-ui/react/menu";

import { useLogout } from "@/features/auth/hooks/use-logout";

export function LandingUserMenu() {
  const handleLogout = useLogout();

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Menú de usuario"
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary outline-none focus-visible:ring-2 focus-visible:ring-white/80"
        type="button"
      >
        <UserIcon />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner align="start" className="z-20" side="bottom" sideOffset={8}>
          <Menu.Popup className="min-w-44 origin-top-left rounded-modal border border-border bg-white py-1 shadow-[0_4px_8px_rgba(0,0,0,0.1)] outline-none">
            <Menu.Item
              className="cursor-pointer px-4 py-3 text-body text-charcoal outline-none data-[highlighted]:bg-primary-subtle"
              label="Cerrar sesión"
              onClick={handleLogout}
            >
              Cerrar sesión
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}

function UserIcon() {
  return (
    <svg aria-hidden className="size-4" fill="none" viewBox="0 0 16 16">
      <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M3.5 13c.7-2 2.4-3 4.5-3s3.8 1 4.5 3"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
