# Feature Specification: Pantalla de autenticación

**Feature Branch**: `002-login-auth`

**Created**: 2026-06-01

**Status**: Draft

**Input**: User description: "US-001 Pantalla de autenticación — formulario de inicio de sesión con usuario y contraseña, mecanismo de rutas protegidas, redirecciones y cierre de sesión para la demostración de banca web. Referencias: docs/user-stories/US-001-pantalla-autenticacion, contratos futuros api-token-login y api-settings."

**Constitution**: Features MUST comply with `.specify/memory/constitution.md`. Alineado con **US-001** (`docs/user-stories/US-001-pantalla-autenticacion/README.md`). Identificadores **BR-XX** y **SC-XX** de la user story se reflejan en requisitos y criterios de éxito.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Inicio de sesión con credenciales (Priority: P1)

Como visitante sin sesión válida, quiero ver una pantalla de inicio de sesión con campos de usuario y contraseña para identificarme y acceder al área autenticada de la demostración de banca web.

**Why this priority**: Sin autenticación no hay acceso al flujo protegido; es el punto de entrada obligatorio del producto.

**Independent Test**: Puede verificarse abriendo la pantalla de login, completando ambos campos obligatorios y confirmando que el sistema reconoce al usuario como autenticado y lo lleva al resumen (inicio autenticado).

**Acceptance Scenarios**:

1. **Given** un visitante sin sesión válida, **When** abre la pantalla de login, **Then** ve un formulario con campos de usuario y contraseña y una acción para enviar.
2. **Given** un visitante sin sesión válida en la pantalla de login, **When** intenta enviar el formulario con usuario o contraseña vacíos, **Then** el sistema no procesa el inicio de sesión y comunica que ambos campos son obligatorios.
3. **Given** un visitante sin sesión válida, **When** envía el formulario con usuario y contraseña no vacíos, **Then** el sistema lo reconoce como autenticado y lo redirige al resumen (**SC-02**).

---

### User Story 2 - Protección de rutas y redirección al login (Priority: P1)

Como visitante sin sesión, quiero que el sistema impida acceder a contenido reservado para usu autenticados y me lleve al login, para entender claramente qué partes del producto requieren identificación.

**Why this priority**: Garantiza el valor de negocio de la autenticación: el área protegida solo es usable tras iniciar sesión.

**Independent Test**: Puede verificarse solicitando una ruta marcada como protegida sin sesión y comprobando la redirección automática a la pantalla de login (**SC-01**).

**Acceptance Scenarios**:

1. **Given** un visitante sin sesión válida, **When** solicita una ruta que el producto haya definido como protegida, **Then** el sistema lo redirige a la pantalla de login (**SC-01**).
2. **Given** un usuario autenticado, **When** solicita una ruta protegida, **Then** el sistema le permite acceder al contenido sin redirigir al login.

---

### User Story 3 - Evitar login duplicado y cierre de sesión (Priority: P2)

Como usuario autenticado, quiero no volver a ver el formulario de login innecesariamente y poder cerrar sesión desde cualquier punto de la aplicación que lo ofrezca, volviendo siempre a la misma pantalla de login.

**Why this priority**: Mejora la experiencia tras el acceso inicial y cierra el ciclo de vida de la sesión de forma predecible.

**Independent Test**: Puede verificarse iniciando sesión, intentando abrir de nuevo la pantalla de login (debe redirigir al resumen) y ejecutando cierre de sesión desde cualquier flujo que lo exponga (debe invalidar la sesión y redirigir al login) (**SC-03**, **SC-04**).

**Acceptance Scenarios**:

1. **Given** un usuario autenticado, **When** solicita la pantalla de login, **Then** el sistema lo redirige al resumen (**SC-03**).
2. **Given** un usuario autenticado, **When** ejecuta una acción de cierre de sesión desde cualquier parte de la aplicación que la ofrezca, **Then** el sistema deja de considerarlo autenticado y lo redirige siempre a la misma pantalla de login, con independencia del punto desde el que cerró (**SC-04**).

---

### Edge Cases

- ¿Qué ocurre si el visitante envía credenciales no reconocidas por la simulación de sesión? El sistema debe informar de forma clara que el inicio de sesión no fue exitoso, sin revelar detalles que faciliten ataques en un entorno real (mensaje genérico orientado a usuario).
- ¿Qué ocurre si un usuario autenticado pierde la sesión simulada (p. ej. al recargar, según el comportamiento acordado para la demo)? Debe tratarse como no autenticado y aplicarse las reglas de rutas protegidas.
- ¿Qué ocurre si se intenta acceder directamente por URL al resumen sin sesión? Debe aplicarse la misma protección que en cualquier otra ruta protegida.
- ¿Qué ocurre tras cerrar sesión si el usuario usa el botón atrás del navegador? No debe recuperarse acceso al área autenticada sin volver a iniciar sesión.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: El sistema **DEBE** ofrecer una pantalla de inicio de sesión accesible como punto de entrada para visitantes no autenticados.
- **FR-002**: El formulario de login **DEBE** incluir campos de usuario y contraseña; ambos **DEBEN** ser obligatorios para enviar el formulario (**BR-01**).
- **FR-003**: Tras un inicio de sesión exitoso, el sistema **DEBE** tratar al usuario como autenticado y **DEBE** redirigirlo al resumen (inicio autenticado) (**BR-02**).
- **FR-004**: Si un usuario ya autenticado solicita la pantalla de login, el sistema **DEBE** redirigirlo al resumen en lugar de mostrar el formulario (**BR-03**).
- **FR-005**: El producto **DEBE** implementar un mecanismo para marcar rutas protegidas accesibles solo por usuarios autenticados (**BR-04**).
- **FR-006**: **DEBE** existir al menos una ruta protegida de demostración; un visitante sin sesión **NO DEBE** poder usar ese contenido y el sistema **DEBE** redirigirlo a la pantalla de login (**BR-04**, **SC-01**).
- **FR-007**: Toda acción explícita de cierre de sesión expuesta en la aplicación **DEBE** invalidar la sesión del usuario y **DEBE** redirigirlo siempre a la misma pantalla de login, sin variar el destino según el origen del cierre (**BR-05**, **SC-04**).
- **FR-008**: La verificación de sesión y el tratamiento de identidad en esta entrega **DEBEN** basarse en simulación (mocks), sin depender de backend ni proveedor de identidad real acordado (**BR-06**).
- **FR-009**: La pantalla de login **DEBE** alinearse visualmente con la referencia de diseño acordada en la user story (Figma: Pantallas taller SDD, nodo de referencia de la pantalla de autenticación).
- **FR-010**: El resumen (destino tras login exitoso) **DEBE** ser la pantalla de inicio autenticado del producto, coherente con el flujo de la demostración de banca web.

### Key Entities

- **Sesión de usuario (simulada)**: Representa el estado autenticado/no autenticado del visitante durante la demo. Atributos conceptuales: identificador de usuario reconocido tras login exitoso, indicador de validez de sesión.
- **Credenciales de acceso**: Par usuario/contraseña introducido en el formulario. En esta entrega se validan contra la simulación acordada, no contra un servicio real.
- **Ruta protegida**: Recurso o pantalla del producto marcada como accesible solo con sesión válida. El catálogo completo de rutas protegidas queda por definir con producto; esta entrega exige el mecanismo y al menos una ruta de demostración.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Un visitante puede completar el inicio de sesión (formulario visible → credenciales válidas → llegada al resumen) en menos de 1 minuto en condiciones normales de uso.
- **SC-002**: El 100 % de los intentos de acceso a la ruta protegida de demostración sin sesión válida resultan en redirección a la pantalla de login (**SC-01**).
- **SC-003**: El 100 % de los usuarios ya autenticados que solicitan la pantalla de login son redirigidos al resumen sin ver el formulario (**SC-03**).
- **SC-004**: El 100 % de las acciones de cierre de sesión expuestas en la aplicación dejan al usuario fuera del área autenticada y lo llevan a la misma pantalla de login (**SC-04**).
- **SC-005**: En pruebas de aceptación de la demo, los cinco escenarios de la user story (**SC-01** a **SC-04** más validación de campos obligatorios) pueden ejecutarse y verificarse de forma repetible sin backend real.

## Assumptions

- El alcance de esta especificación coincide con **US-001** en estado Ready; no incluye integración con backend real ni proveedor de identidad externo (**BR-06**).
- Los contratos documentados en `docs/technical-docs/api-token-login.md` (POST credenciales → token JWT) y `docs/technical-docs/api-settings.md` (GET perfil autenticado) describen el comportamiento objetivo para integraciones futuras; **no** forman parte del alcance funcional de esta entrega mock.
- El catálogo definitivo de rutas protegidas se decidirá con producto; para esta entrega basta el mecanismo y al menos una ruta de demostración (p. ej. resumen o equivalente acordado en planificación).
- La simulación de sesión puede aceptar credenciales de demo predefinidas acordadas en implementación; no se exige registro de usuarios ni recuperación de contraseña.
- Recuperación de contraseña, registro, autenticación multifactor, bloqueo por intentos fallidos y garantías de seguridad de producción quedan fuera de alcance.
- El resumen al que se redirige tras login es la pantalla de inicio autenticado prevista en la demostración (coherente con **US-002** u otra historia de landing cuando exista; si aún no está disponible, una pantalla placeholder de resumen cumple el criterio de redirección).
- La referencia visual en Figma es la guía de diseño; ajustes menores de implementación son negociables si preservan la intención de la pantalla de autenticación.
- Los visitantes disponen de conectividad estable típica de aplicación web en navegador.
