# Research: Pantalla de autenticación (001-login-auth)

**Date**: 2026-06-01  
**Spec**: [spec.md](./spec.md)

## R1 — Mecanismo de rutas protegidas en Next.js 16

**Decision**: Usar `proxy.ts` en la raíz del proyecto con `export function proxy()` y `export const config.matcher`, según [ADR-008](../../docs/adr/ADR-008-proxy-instead-of-middleware.md) y el skill `next-best-practices/file-conventions.md`.

**Rationale**: Next.js 16 depreca `middleware.ts`. El proxy intercepta peticiones antes del enrutamiento y puede redirigir visitantes sin sesión a `/login` (**SC-01**, **FR-006**), incluyendo acceso directo por URL.

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| Solo guards en Client Components | No protege navegación directa ni refresh sin sesión en servidor |
| `middleware.ts` legacy | Obsoleto en Next 16; genera warnings de build |
| Layouts anidados con redirect en RSC | No cubre todas las rutas sin duplicar lógica; el proxy centraliza el matcher |

## R2 — Persistencia de sesión mock

**Decision**: Combinar **Zustand** (estado reactivo en UI) con **cookie de demo** (`auth-demo-session`) que el proxy pueda leer vía `request.cookies`.

**Rationale**: Zustand no es visible en el edge/proxy. La cookie permite que `proxy.ts` evalúe autenticación en cada navegación. El store se hidrata al montar la app leyendo la cookie existente.

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| Solo Zustand + localStorage | Proxy no accede; falla **SC-01** en URL directa |
| Solo cookie sin store | UI requeriría re-leer cookie en cada componente; peor DX y testabilidad |
| JWT real en cookie | Fuera de alcance mock (**FR-008**); sobre-ingeniería para demo |

## R3 — Rutas y catálogo protegido

**Decision**:

| Ruta | Tipo | Comportamiento |
| ---- | ---- | -------------- |
| `/login` | Pública | Muestra formulario; si hay sesión válida → redirect `/` |
| `/` | Protegida (demo) | Resumen placeholder; sin sesión → redirect `/login` |

Centralizar listas en `src/features/auth/lib/protected-routes.ts` para extender cuando producto defina más rutas (**BR-04**).

**Rationale**: US-001 exige mecanismo + al menos una ruta demo. US-002 asume `/` como resumen autenticado. Un placeholder mínimo en `/` desbloquea **FR-010** sin implementar US-002 completa.

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| `/dashboard` como única protegida | Desalineado con US-002 (resumen en inicio) |
| Proteger todas las rutas excepto login | Demasiado restrictivo antes de que producto defina catálogo |

## R4 — Validación de credenciales mock

**Decision**: Servicio `mock-auth-service.ts` con credenciales demo fijas (p. ej. `demo.user` / `demo1234`). Login exitoso si ambos campos coinciden; fallo con mensaje genérico en español («Usuario o contraseña incorrectos»).

**Rationale**: Cumple **FR-008** y edge case de credenciales inválidas sin simular backend. Facilita tests deterministas con Object Mother.

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| Aceptar cualquier credencial no vacía | Debilita demostración de error y no refleja flujo real |
| Route Handler `/api/token` mock | Añade capa HTTP innecesaria para alcance actual |

## R5 — UI y componentes

**Decision**: Pantalla login como Client Component componiendo primitivas Base UI (`Field`, `Input`, `Button`) estilizadas con Tailwind según `DESIGN.md`. Referencia visual: [Figma nodo 36-1533](https://www.figma.com/design/7pt2W7JSic4ZoAVcgvQ5qD/Pantallas-taller-SDD?node-id=36-1533&m=dev).

**Rationale**: ADR-006 prioriza Base UI; ADR-002 + DESIGN.md fijan tokens (Primary Teal `#008392`, Lexend, etc.).

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| HTML nativo sin Base UI | Incumple ADR-006 para formularios interactivos |
| Librería de formularios externa (react-hook-form) | YAGNI; validación mínima (required + mock check) |

## R6 — Cierre de sesión

**Decision**: Acción `logout()` en store que (1) borra cookie, (2) resetea Zustand, (3) `router.replace('/login')`. `LogoutButton` reutilizable en resumen placeholder.

**Rationale**: Cumple **FR-007**, **SC-04**: destino único `/login` independiente del origen. `replace` evita re-entrada al área autenticada con botón atrás (edge case spec).

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| Redirect variable según origen | Viola **BR-05** |
| Solo limpiar store sin cookie | Proxy seguiría considerando autenticado |

## R7 — Integración API futura

**Decision**: No implementar `/api/token` ni `/api/settings` en esta feature. Documentar shapes de referencia en `contracts/` alineados con `docs/technical-docs/` para migración posterior.

**Rationale**: Spec _Assumptions_ y **FR-008** excluyen backend real. El mock-auth-service puede evolucionar a cliente HTTP sin cambiar la UI.

**Alternatives considered**:

| Alternativa | Descartada porque |
| ----------- | ----------------- |
| Implementar Route Handlers mock ahora | Scope creep; duplica contratos ya documentados en technical-docs |
