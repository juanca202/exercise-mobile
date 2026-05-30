preferred language: es

## Tailwind CSS — tokens del theme

Al escribir clases de Tailwind con colores, espaciados, tamaños u otras medidas específicas, **preferir variables** definidas en `src/theme/index.css` (p. ej. `bg-primary`, `text-foreground`, `gap-*` mapeados al theme) en lugar de valores fijos (`#008292`, `px-[17px]`, etc.).

- **No agregar** variables nuevas al theme solo para cubrir un caso puntual.
- Si **no existe** una variable/token equivalente en `src/theme/index.css`, **dejar la clase tal como está** (valor literal permitido).
