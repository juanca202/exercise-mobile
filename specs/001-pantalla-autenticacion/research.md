# Research: Pantalla de autenticación (US-001)

**Date**: 2026-05-30  
**Branch**: `002-pantalla-autenticacion`

## R1 — Mecanismo de rutas protegidas

**Decision**: Combinar **`proxy.ts`** en la raíz del repo (convención Next.js 16 según skill `next-best-practices`) con un **catálogo declarativo** de rutas protegidas en `src/features/auth/lib/protected-routes.ts`, más **cookie de sesión demo** legible por el proxy.

**Rationale**:

- **SC-01** exige redirección al login antes de servir contenido protegido en navegación directa por URL; un guard solo en Client Component no cubre el primer request sin sesión.
- Zustand vive en cliente y no es accesible en el proxy; la cookie (`demo-auth-session`) se sincroniza en login/logout desde el store.
- El catálogo en módulo TypeScript permite ampliar rutas sin tocar lógica de redirección (**BR-04**).

**Alternatives considered**:

| Alternativa                                  | Descartada porque                                                        |
| -------------------------------------------- | ------------------------------------------------------------------------ |
| Solo layout Client Component con `useEffect` | Flash de contenido y fallo en acceso directo sin hidratación previa      |
| Middleware clásico `middleware.ts`           | Next 16 documenta migración a `proxy.ts`; alinear con skill del proyecto |
| JWT real en cookie                           | Fuera de alcance (**FR-006**); añade complejidad sin valor en demo mock  |

## R2 — Estado de sesión (mock)

**Decision**: Store **Zustand** en `src/features/auth/` con middleware **`persist`** hacia `localStorage` (clave `auth:demo:v1`), acciones `login`, `logout` e `isAuthenticated`.

**Rationale**: ADR-003 fija Zustand para estado cliente compartido; persistencia mejora la demo entre recargas sin backend. La cookie es complemento para el proxy, no fuente única de verdad en cliente.

**Alternatives considered**:

| Alternativa           | Descartada porque                                             |
| --------------------- | ------------------------------------------------------------- |
| Solo cookie sin store | Dificulta pruebas unitarias y consumo desde componentes React |
| Context API           | ADR-003 desaconseja Context como store global de dominio      |
| sessionStorage        | No sobrevive recarga de pestaña; peor UX en demo              |

## R3 — Validación mock de credenciales

**Decision**: Aceptar **cualquier par usuario + contraseña no vacíos** (trim aplicado). Opcionalmente documentar credenciales demo sugeridas (`demo.user` / cualquier contraseña) en `quickstart.md` sin rechazar otros pares.

**Rationale**: Alineado con _Assumptions_ de `spec.md`. **BR-01** ya exige campos obligatorios; no hay regla de credenciales fijas en US-001.

**Alternatives considered**:

| Alternativa                           | Descartada porque                                   |
| ------------------------------------- | --------------------------------------------------- |
| Usuario/contraseña fijos hardcodeados | Restringe demos sin requisito de producto           |
| Simular error 401 aleatorio           | Confunde escenarios de aceptación sin aportar valor |

## R4 — Rutas y redirecciones

**Decision**:

| Ruta     | Rol                                                            |
| -------- | -------------------------------------------------------------- |
| `/login` | Pública — formulario de inicio de sesión (Figma nodo `1-3167`) |
| `/`      | Protegida — destino post-login (stub de resumen hasta US-002)  |

Redirecciones: login exitoso → `/`; usuario autenticado en `/login` → `/`; sin sesión en ruta protegida → `/login`; logout → `/login` (destino único **BR-05**).

**Rationale**: US-002 asume resumen en ruta de inicio autenticado; minimiza rutas nuevas. Una ruta protegida (`/`) cumple **BR-04** mínimo.

**Alternatives considered**:

| Alternativa                | Descartada porque                                |
| -------------------------- | ------------------------------------------------ |
| `/resumen` separado de `/` | Duplica destino; US-002 no fija path alternativo |
| Proteger `/login`          | Invertiría el flujo público de autenticación     |

## R5 — UI y accesibilidad

**Decision**: Formulario con primitivas **Base UI** (ADR-006) envueltas en `src/components/ui/`, estilos **Tailwind v4** según `DESIGN.md` (Lexend, teal `#008392`, inputs con borde `#CED4DA`). Textos en **español** (constitución).

**Rationale**: Stack obligatorio por ADRs; Figma define estructura (usuario, contraseña, CTA); DESIGN.md aporta tokens cuando Figma no detalle medidas.

**Alternatives considered**:

| Alternativa             | Descartada porque                                      |
| ----------------------- | ------------------------------------------------------ |
| HTML nativo sin Base UI | Incumple ADR-006 y gates de accesibilidad del proyecto |
| CSS modules             | Incumple ADR-002                                       |

## R6 — Integración API real

**Decision**: **No implementar** `POST /api/token` ni `GET /api/settings` en esta feature. Definir contratos en `contracts/` como referencia y stub de servicio mock en la feature.

**Rationale**: **FR-006** / **BR-06** limitan alcance a mocks; contratos en `docs/technical-docs/` orientan historias futuras sin violar YAGNI (Principio V).

**Alternatives considered**:

| Alternativa                       | Descartada porque                                            |
| --------------------------------- | ------------------------------------------------------------ |
| Route handlers mock en `app/api/` | Añade capa HTTP innecesaria si el cliente no consume API aún |
| Integrar JWT de inmediato         | Contradice spec y constitución de simplicidad                |

## R7 — Cierre de sesión (SC-04)

**Decision**: Exponer acción de logout en **layout de zona autenticada** (`src/app/(authenticated)/layout.tsx` o equivalente) y, si hace falta segundo punto, botón en stub de resumen — mínimo **dos puntos** para **MO-003**.

**Rationale**: **BR-05** exige destino único al login; no prescribe ubicación del control. Layout + contenido cubren verificación de MO-003.

**Alternatives considered**:

| Alternativa                               | Descartada porque               |
| ----------------------------------------- | ------------------------------- |
| Solo un botón logout                      | No cumple MO-003 (dos orígenes) |
| Logout solo por borrar cookie manualmente | No es acción explícita en UI    |
