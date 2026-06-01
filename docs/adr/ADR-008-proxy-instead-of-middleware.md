# ADR-008: Interceptación de peticiones con `proxy.ts` (no `middleware.ts`)

- Estado: Accepted
- Fecha de creación: 2026-06-01
- Última actualización: 2026-06-01
- Decisores: Tech lead
- Etiquetas: nextjs, proxy, edge, seguridad, routing

## Contexto

El proyecto usa **Next.js 16** (`next@16.2.6`) con App Router (ver [ADR-001](ADR-001-app-router-only.md)). En versiones anteriores (14–15), la interceptación de peticiones antes del enrutamiento se implementaba con el archivo raíz `middleware.ts` y la exportación nombrada `middleware()`.

A partir de Next.js 16, esa convención está **obsoleta**: el framework emite el aviso *"The middleware file convention is deprecated. Please use proxy instead"* y documenta la migración en [middleware-to-proxy](https://nextjs.org/docs/messages/middleware-to-proxy). La capacidad es la misma (redirecciones, reescrituras, cabeceras, comprobaciones de auth, `matcher`, etc.); cambian solo el nombre del archivo, la función exportada y la terminología alineada con el rol real del módulo (capa de proxy frente al manejador de rutas).

## Decision

Para toda lógica de interceptación de peticiones a nivel de aplicación en este proyecto:

1. Usar el archivo **`proxy.ts`** en la raíz del proyecto (junto a `app/`), no `middleware.ts`.
2. Exportar la función nombrada **`proxy(request: NextRequest)`**, no `middleware()`.
3. Mantener **`export const config`** con `matcher` (u otras opciones documentadas) cuando aplique filtrado por ruta.
4. Implementar la lógica con las APIs de **`next/server`** (`NextResponse`, `NextRequest`, etc.), igual que en la convención anterior.

Queda **prohibido** introducir o restaurar `middleware.ts` / `middleware()` en código nuevo; el código existente que aún use la convención antigua debe migrarse (p. ej. `npx @next/codemod@latest upgrade` o renombrado manual según la guía oficial).

Este ADR no prescribe casos de uso concretos (auth global, i18n, rate limiting); solo la convención de archivo y exportación compatible con Next.js 16+.

## Consecuencias

### Positivas

- Alineación con Next.js 16 y ausencia de avisos de obsolescencia en build/dev.
- Coherencia con el skill interno `/next-best-practices` y con [ADR-001](ADR-001-app-router-only.md) (stack App Router actual).
- Un solo nombre mental para el equipo (`proxy`) y documentación oficial vigente.

### Negativas / trade-offs

- Tutoriales, plantillas y ejemplos de la comunidad que aún mencionan `middleware.ts` requieren adaptación al leer o copiar código.
- Búsquedas en el repo o en issues por "middleware" pueden confundirse con el término histórico de Next.js (no con middleware de Zustand u otras librerías).

## Referencias

- [Next.js — Mensaje: middleware-to-proxy](https://nextjs.org/docs/messages/middleware-to-proxy)
- [ADR-001: Enrutamiento exclusivo con App Router](ADR-001-app-router-only.md)
- `.agents/skills/next-best-practices/file-conventions.md` — tabla de convenciones v14–15 vs v16+
- `AGENTS.md` — atender avisos de obsolescencia de Next.js
