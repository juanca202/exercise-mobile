preferred language: es

## UI / Tailwind CSS

Al escribir clases de Tailwind con colores, tipografía, espaciado, radios u otras escalas:

1. **Preferir** tokens definidos en `src/app/globals.css` (`:root` + `@theme inline`), alineados con `DESIGN.md` (paleta §2, tipografía §3, espaciado y radios §5).
2. **Tipografía:** `text-h2`, `text-h3`, `text-body`, `text-body-bold`, `text-button`, `text-button-sm`, `text-input`, `text-caption` (no `text-sm`/`text-xs` genéricos salvo utilidades de Tailwind que coincidan con el token).
3. **Espaciado:** escala `1`–`10`, `12`, `13` (múltiplos de 4px); tokens de layout (`pt-login-top`, `pb-nav-clearance`, `max-w-form`, etc.) cuando apliquen.
4. **Radios:** `rounded-input`, `rounded-container-sm`, `rounded-modal`, `rounded-card`, `rounded-pill`.
5. Si no existe un token que encaje, revisar si corresponde añadirlo desde `DESIGN.md` antes de usar un literal arbitrario.
6. Colores: tokens semánticos (`text-primary`, `bg-surface-muted`, etc.), no hex en clases.

Rationale: consistencia con el sistema de diseño del repo y una sola fuente de verdad en `globals.css`.
