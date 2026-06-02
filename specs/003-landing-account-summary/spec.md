# Feature Specification: Landing — resumen de cuentas y atajos

**Feature Branch**: `003-landing-account-summary`

**Created**: 2026-06-01

**Status**: Draft

**Input**: User description: "US-002 Landing — resumen de cuentas y atajos: pantalla de inicio autenticada con resumen de cuentas, últimos movimientos y atajos a operaciones frecuentes. Referencias: docs/user-stories/US-002-landing-resumen-cuentas, contratos de datos api-accounts y api-activity."

**Constitution**: Features MUST comply with `.specify/memory/constitution.md`. Alineado con **US-002** (`docs/user-stories/US-002-landing-resumen-cuentas/README.md`). Identificadores **BR-XX** y **SC-XX** de la user story se reflejan en requisitos y escenarios de aceptación.

## Clarifications

### Session 2026-06-01

- Q: ¿Qué debe ocurrir al pulsar atajos secundarios («Servicios», «Pagos QR») sin ruta implementada? → A: Pantalla dedicada placeholder en español indicando que la funcionalidad no está disponible en la demo.
- Q: ¿Qué regla de enmascaramiento aplica al número de cuenta en UI? → A: Mostrar solo los últimos 4 dígitos; el resto se oculta (p. ej. `****7890`).
- Q: ¿Qué formato de presentación aplican los importes monetarios en UI? → A: Formato anglosajón con símbolo $ (p. ej. `1,250.50` o `$1,250.50`).
- Q: ¿Qué ocurre con el atajo de transferencias si la ruta aún no existe? → A: Misma pantalla placeholder en español que otros atajos sin ruta.
- Q: ¿Qué debe ver el usuario si falla la carga de cuentas o movimientos? → A: Mensaje en español en la sección afectada con acción «Reintentar».
- Q: ¿Cómo debe presentarse el listado de cuentas en la landing? → A: Mediante el componente dedicado **AccountsCarousel** (carrusel horizontal de tarjetas por cuenta), alineado con la maqueta Figma.
- Q: ¿Los chips de filtro (Todos, Cuentas, Tarjetas, Inversiones) están en alcance y filtran? → A: Sí; chips visibles que filtran cuentas por tipo según la maqueta.
- Q: ¿Cómo debe implementarse la barra de navegación inferior de la landing? → A: Mediante el componente dedicado **`Navbar`** con ítems Inicio, Transferir, Retirar, Pagos y Otros según Figma.
- Q: ¿Nombres de componentes para movimientos y atajos en contenido? → A: **`MovementsList`** (`MovementsList.tsx`) y **`Shortcuts`** (`Shortcuts.tsx`).
- Q: ¿Dónde vive el estado de error por sección y qué API expone? → A: Componente compartido **`Error`** en `src/components/ui/`; recibe `message` (string) y callback `onRetry`; el padre (p. ej. `AccountsCarousel`, `MovementsList`) provee mensaje y reintento.
- Q: ¿Nombre del componente de error compartido? → A: **`Error`** (`Error.tsx`); antes `SectionError`.
- Q: ¿Dónde vive `Navbar`? → A: Componente compartido en `src/components/ui/Navbar.tsx` (no bajo `features/landing`).

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Resumen de cuentas autenticado (Priority: P1)

Como usuario autenticado, quiero ver en la pantalla de inicio un **carrusel horizontal de cuentas** (`AccountsCarousel`) con nombre (cuando exista), identificador enmascarado y saldo o consumo en cada tarjeta, para tener contexto financiero inmediato al entrar al producto.

**Why this priority**: Es el núcleo de valor de la landing; sin cuentas visibles la pantalla no cumple su propósito principal.

**Independent Test**: Puede verificarse accediendo al resumen con sesión válida y comprobando que `AccountsCarousel` muestra al menos dos tarjetas de cuenta con desplazamiento horizontal, número enmascarado y monto legible (**SC-01**).

**Acceptance Scenarios**:

1. **Given** un usuario autenticado, **When** accede al resumen (ruta de inicio autenticada), **Then** ve el componente `AccountsCarousel` con al menos dos tarjetas de cuenta, cada una con número enmascarado y saldo o consumo visible (**SC-01**).
2. **Given** un usuario autenticado en el resumen con más de una cuenta en el carrusel, **When** desplaza horizontalmente el carrusel, **Then** puede ver cada tarjeta de cuenta adicional sin salir de la pantalla de inicio.
3. **Given** un usuario autenticado en el resumen, **When** una cuenta incluye nombre para mostrar, **Then** la tarjeta correspondiente en el carrusel lo presenta junto al identificador enmascarado y al monto (**BR-01**).
4. **Given** un usuario autenticado en el resumen con cuentas de distintos tipos, **When** selecciona el chip «Cuentas», **Then** el carrusel muestra solo cuentas de tipo ahorro o corriente; al seleccionar «Tarjetas», solo tarjetas de crédito; «Todos» restaura todas las cuentas visibles en demo.

---

### User Story 2 - Últimos movimientos (Priority: P1)

Como usuario autenticado en el resumen, quiero ver una lista de mis últimos movimientos con descripción, fecha en formato relativo y importe con signo, para entender la actividad reciente sin navegar a otro módulo.

**Why this priority**: Complementa el resumen de cuentas con contexto transaccional; es requisito explícito de la demo de banca digital.

**Independent Test**: Puede verificarse en la sección de movimientos del resumen comprobando al menos tres entradas con descripción, fecha relativa e importe con signo positivo o negativo (**SC-02**).

**Acceptance Scenarios**:

1. **Given** un usuario autenticado en el resumen, **When** revisa la sección de movimientos, **Then** ve al menos tres movimientos con descripción, fecha relativa e importe con signo (**SC-02**).
2. **Given** un movimiento con importe negativo, **When** se muestra en la lista, **Then** el usuario percibe claramente que es un cargo o salida de fondos mediante el signo del importe (**BR-02**).

---

### User Story 3 - Atajos a operaciones frecuentes (Priority: P2)

Como usuario autenticado en el resumen, quiero atajos visibles hacia transferencias y, cuando el producto los incluya en el alcance de la demo, hacia otros servicios de la maqueta, para acceder con menos pasos a operaciones habituales.

**Why this priority**: Aporta navegación rápida pero depende de que el resumen base (cuentas y movimientos) ya esté disponible.

**Independent Test**: Puede verificarse localizando los atajos en pantalla, usando el de transferencias y comprobando la llegada a la ruta de transferencias del producto (**SC-03**); para atajos secundarios sin ruta implementada, comprobar el comportamiento acordado en _Assumptions_ (**BR-03**, **BR-06**).

**Acceptance Scenarios**:

1. **Given** un usuario autenticado en el resumen y una ruta de transferencias implementada en el producto, **When** usa el atajo de transferencias, **Then** navega a esa ruta (**SC-03**).
2. **Given** un usuario autenticado en el resumen y la ruta de transferencias aún no implementada, **When** usa el atajo de transferencias, **Then** llega a la pantalla placeholder en español (mismo comportamiento que atajos secundarios sin ruta).
3. **Given** un usuario autenticado en el resumen, **When** observa la zona de atajos, **Then** ve enlaces o controles claramente identificables hacia transferencias y, si están en alcance de la demo, hacia otros servicios indicados en la referencia de diseño (**BR-03**).
4. **Given** un usuario autenticado en el resumen, **When** observa la parte inferior de la pantalla, **Then** ve el componente `Navbar` con los ítems **Inicio**, **Transferir**, **Retirar**, **Pagos** y **Otros**, estando **Inicio** resaltado como activo.
5. **Given** un usuario autenticado en el resumen, **When** pulsa **Transferir** en `Navbar`, **Then** navega a la ruta de transferencias o a la pantalla placeholder si la ruta no existe (**SC-03**, **FR-009**).
6. **Given** un usuario autenticado en el resumen, **When** pulsa **Retirar**, **Pagos** u **Otros** en `Navbar` sin ruta implementada, **Then** llega a la pantalla placeholder en español (**FR-009**).

---

### User Story 4 - Acceso solo con sesión válida (Priority: P1)

Como visitante sin sesión, no debo poder usar el resumen como pantalla de inicio autenticada; el sistema debe aplicar las mismas reglas de autenticación que el resto del producto (**US-001**).

**Why this priority**: La landing es contenido protegido; sin esta regla se rompe el modelo de seguridad de la demo.

**Independent Test**: Puede verificarse intentando abrir el resumen sin sesión y comprobando la redirección según las reglas de autenticación ya definidas (**SC-04**).

**Acceptance Scenarios**:

1. **Given** un visitante sin sesión, **When** intenta abrir el resumen, **Then** es redirigido según las reglas de autenticación de **US-001** (**SC-04**, **BR-05**).

---

### Edge Cases

- ¿Qué ocurre si no hay cuentas que mostrar? En la demo se asume al menos dos cuentas de ejemplo; si en el futuro la lista estuviera vacía, el sistema debe comunicarlo en español sin pantalla rota ni datos incoherentes.
- ¿Qué ocurre si no hay movimientos recientes? Debe mostrarse un estado vacío comprensible en la sección de movimientos, sin errores técnicos visibles al usuario.
- ¿Cómo se presenta una cuenta de tipo tarjeta de crédito? El monto mostrado representa consumo acumulado; no se expone cupo disponible en esta entrega (**BR-07**, alineado con alcance demo).
- ¿Qué ocurre al usar atajos «Servicios» o «Pagos QR» cuando la ruta destino no existe? El usuario llega a una pantalla placeholder en español con mensaje de funcionalidad no disponible en la demo; no se muestra error 404 genérico ni se bloquean los atajos (**BR-06**).
- ¿Qué ocurre si el usuario pierde la sesión mientras visualiza el resumen? Debe tratarse como no autenticado y aplicarse redirección al flujo de login según **US-001**.
- ¿Qué ocurre si falla la carga de cuentas o de movimientos? La sección afectada muestra un mensaje de error en español y una acción «Reintentar»; las demás secciones del resumen que hayan cargado correctamente permanecen visibles.
- ¿Cómo se enmascara el número de cuenta? En toda la pantalla (`AccountsCarousel` y referencias en movimientos) solo se muestran los **últimos 4 dígitos**; los demás se sustituyen por caracteres de ocultación (p. ej. `****7890`).
- ¿Qué ocurre si solo hay una cuenta? El carrusel muestra una tarjeta sin romper el layout; no es obligatorio scroll horizontal.
- ¿Qué ocurre si el carrusel no puede cargar cuentas? Aplica **FR-014** dentro del contenedor de `AccountsCarousel` (mensaje + «Reintentar»).
- ¿Qué ocurre si un filtro no tiene cuentas (p. ej. «Inversiones» en demo)? El carrusel muestra un estado vacío en español para esa categoría, sin error técnico.
- ¿Qué ocurre al pulsar **Inicio** en `Navbar` estando ya en el resumen? Permanece en `/` o refresca la vista de inicio sin perder sesión.
- ¿El `Navbar` oculta contenido al hacer scroll? Debe permanecer fijo en la parte inferior de la landing según Figma, sin tapar contenido crítico (espaciado inferior en `LandingScreen`).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: La pantalla de inicio autenticada **DEBE** mostrar el listado de cuentas mediante el componente **`AccountsCarousel`**: carrusel horizontal de tarjetas, cada una con identificador enmascarado (solo últimos 4 dígitos visibles) y saldo o consumo presentado al usuario (**BR-01**).
- **FR-015**: El listado de cuentas **NO DEBE** implementarse como lista vertical estática genérica; **DEBE** usar el componente `AccountsCarousel` con desplazamiento horizontal entre tarjetas y vista parcial de la tarjeta siguiente cuando haya más de una cuenta (patrón carrusel según Figma frame Home, nodo 36:1699).
- **FR-016**: `AccountsCarousel` **DEBE** incluir chips de filtro **Todos**, **Cuentas**, **Tarjetas** e **Inversiones** (etiquetas en español); al seleccionar un chip, el carrusel **DEBE** mostrar solo las cuentas que correspondan: **Cuentas** → tipos `saving` y `checking`; **Tarjetas** → `credit-card`; **Inversiones** → ninguna cuenta en demo salvo que el dataset mock incluya ese tipo; **Todos** → sin filtro.
- **FR-012**: Todo número de cuenta mostrado en el resumen (cuentas y movimientos) **DEBE** enmascararse mostrando únicamente los últimos 4 dígitos; el resto **DEBE** ocultarse de forma consistente (p. ej. `****7890`).
- **FR-013**: Los importes monetarios (saldos, consumos y movimientos) **DEBEN** mostrarse en formato anglosajón con separador de miles por coma y decimales por punto, incluyendo símbolo de dólar `$` (p. ej. `$1,250.50` o `1,250.50` con `$` visible en la misma línea).
- **FR-014**: Si falla la carga de la sección de cuentas o de movimientos, el sistema **DEBE** mostrar en esa sección un mensaje de error comprensible en español y una acción «Reintentar»; **NO DEBE** sustituir todo el resumen por una pantalla de error global si otras secciones cargaron correctamente.
- **FR-020**: Los errores por sección **DEBEN** renderizarse con el componente compartido **`Error`** (`src/components/ui/Error.tsx`), que **DEBE** aceptar un prop `message` (texto del error en español) y un callback `onRetry` invocado al pulsar «Reintentar»; el componente **NO DEBE** acoplar el mensaje ni la lógica de reintento a un feature concreto.
- **FR-002**: Cuando una cuenta tenga nombre para mostrar, la tarjeta correspondiente en `AccountsCarousel` **DEBE** incluirlo de forma legible (**BR-01**).
- **FR-003**: La pantalla **DEBE** mostrar una lista de últimos movimientos con descripción, fecha relativa respecto al momento actual del usuario y importe con signo (**BR-02**).
- **FR-004**: La pantalla **DEBE** ofrecer atajos visibles hacia la funcionalidad de transferencias (**BR-03**); si la ruta de transferencias no está implementada, el atajo **DEBE** conducir a la pantalla placeholder en español definida en **FR-009**.
- **FR-005**: Si el alcance de la demo incluye otros servicios en la maqueta de referencia, la pantalla **DEBE** mostrar atajos hacia ellos de forma coherente con el diseño acordado (**BR-03**).
- **FR-006**: Textos, etiquetas y estructura de la pantalla **DEBEN** ser comprensibles en español para la audiencia de banca digital de demostración (**BR-04**); el formato numérico de importes sigue **FR-013** (convención anglosajón con `$`, independiente del idioma de las etiquetas).
- **FR-007**: El resumen **DEBE** estar disponible solo en contexto autenticado según las reglas de **US-001**; un visitante sin sesión **NO DEBE** consumir el contenido del resumen (**BR-05**, **SC-04**).
- **FR-008**: Los datos de cuentas y movimientos en esta entrega **PUEDEN** provenir de contenido estático o simulado de demo; la integración con núcleo de cuentas real **DEBE** planificarse fuera de este alcance (**BR-05**, **BR-07**).
- **FR-009**: Los atajos secundarios sin ruta implementada (p. ej. «Servicios», «Pagos QR») **DEBEN** navegar a una pantalla dedicada placeholder en español que indique que la funcionalidad no está disponible en la demo; **NO DEBEN** mostrar error 404 genérico del sistema ni permanecer deshabilitados (**BR-06**).
- **FR-010**: La pantalla **DEBE** alinearse visualmente con la referencia de diseño acordada en la user story (Figma: Pantallas taller SDD, frame Home, nodo 36:1699).
- **FR-011**: En condiciones normales de la demo, el resumen **DEBE** presentar al menos dos cuentas y al menos tres movimientos para cumplir los escenarios de aceptación (**SC-01**, **SC-02**).
- **FR-017**: La landing **DEBE** incluir el componente compartido **`Navbar`** (`src/components/ui/Navbar.tsx`) fijo en la parte inferior, con cinco ítems en español: **Inicio**, **Transferir**, **Retirar**, **Pagos** y **Otros**, cada uno con icono y etiqueta según Figma frame Home, nodo 36:1699.
- **FR-018**: En la ruta de inicio autenticada (`/`), el ítem **Inicio** del `Navbar` **DEBE** mostrarse como activo (estilo resaltado: icono y texto en color primario, fondo de ítem según maqueta); los demás ítems en estado inactivo.
- **FR-019**: Las acciones del `Navbar` **DEBEN** navegar así: **Inicio** → `/`; **Transferir** → ruta de transferencias o placeholder si no existe; **Retirar**, **Pagos** y **Otros** → placeholder en demo salvo que exista ruta implementada (**FR-009**).

### Key Entities

- **Cuenta (resumen)**: Producto financiero del usuario mostrado en la landing como **tarjeta** dentro de `AccountsCarousel`. Atributos conceptuales: identificador interno, número para mostrar (en UI solo últimos 4 dígitos visibles), tipo (ahorro, corriente, tarjeta de crédito), monto a mostrar (saldo para ahorro/corriente; consumo acumulado para tarjeta), nombre opcional visible, etiqueta de producto en tarjeta (p. ej. «Gastos», «Saldo») según Figma.
- **AccountsCarousel**: Componente UI de la sección de cuentas; agrupa chips de filtro por categoría, carril horizontal y tarjetas de cuenta.
- **Filtro de categoría (chip)**: Control «Todos» | «Cuentas» | «Tarjetas» | «Inversiones» que restringe qué tarjetas de cuenta muestra el carrusel.
- **Movimiento (actividad reciente)**: Operación asociada a una cuenta. Atributos conceptuales: número de cuenta de referencia (misma regla de enmascaramiento: últimos 4 dígitos), fecha del movimiento, descripción breve, importe con signo (positivo o negativo).
- **Atajo de navegación**: Enlace o control en el cuerpo de la landing (p. ej. componente `Shortcuts`) hacia operaciones frecuentes.
- **MovementsList**: Componente UI de la lista de últimos movimientos (descripción, fecha relativa, importe con signo).
- **Shortcuts**: Componente UI de atajos en el cuerpo de la landing (distinto de `Navbar`).
- **Error** (compartido): Componente reutilizable para fallos de carga por sección; props `message` + `onRetry`.
- **Navbar** (compartido): Barra de navegación inferior fija en `src/components/ui/`; ítems **Inicio**, **Transferir**, **Retirar**, **Pagos**, **Otros**; prop `activeItem` o equivalente para estado activo/inactivo por ruta.
- **Ítem de Navbar**: Par icono + etiqueta; un destino de navegación cada uno.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Un usuario autenticado puede abrir el resumen y localizar al menos dos cuentas con número enmascarado y monto en menos de 30 segundos (**SC-01**).
- **SC-002**: El 100 % de las sesiones de prueba en el resumen muestran al menos tres movimientos con descripción, fecha relativa e importe con signo (**SC-02**).
- **SC-003**: El 100 % de los usos del atajo de transferencias desde el resumen llevan al usuario a la ruta de transferencias del producto (si existe) o a la pantalla placeholder acordada (si aún no existe), sin pasos intermedios obligatorios (**SC-03**).
- **SC-004**: El 100 % de los intentos de acceso al resumen sin sesión válida resultan en redirección conforme a **US-001**, sin visualización del contenido de cuentas o movimientos (**SC-04**).
- **SC-005**: En pruebas de aceptación de la demo, los cuatro escenarios de la user story (**SC-01** a **SC-04**) pueden ejecutarse de forma repetible con datos de demostración, sin dependencia de sistemas bancarios productivos.
- **SC-006**: Al menos el 90 % de usuarios de prueba interna identifican correctamente en español las secciones principales (cuentas, movimientos, atajos, barra inferior de navegación) en una primera visita sin guía adicional.

## Assumptions

- **US-001** está implementada y operativa: mecanismo de sesión, rutas protegidas y redirección al login aplican al resumen (**BR-05**).
- El alcance coincide con **US-002** en estado Ready; no incluye integración con núcleo de cuentas ni datos productivos reales (**BR-07**).
- Los contratos en `docs/technical-docs/api-accounts.md` y `docs/technical-docs/api-activity.md` describen la forma de los datos de cuentas y movimientos que el producto debe poder presentar; en esta entrega los datos **pueden** servirse mediante simulación o contenido estático equivalente, sin exigir backend productivo.
- Para **BR-06**, cuando «Servicios» o «Pagos QR» apunten a rutas no implementadas, se usa **pantalla dedicada placeholder en español** (funcionalidad no disponible en la demo); decisión confirmada en sesión de clarificación 2026-06-01.
- Si la ruta de transferencias no está implementada en esta entrega, el atajo usa la **misma pantalla placeholder** que otros atajos sin ruta; decisión confirmada en sesión de clarificación 2026-06-01. Cuando la ruta exista, **SC-03** exige navegación directa a ella.
- La fecha relativa («hace X días», «ayer», etc.) se deriva de la fecha del movimiento respecto al momento de visualización; no se exige zona horaria avanzada más allá de la coherencia perceptible para el usuario en demo.
- Número de cuentas y movimientos mínimos (dos cuentas, tres movimientos) son umbrales de aceptación de la demo, no límites máximos del diseño.
- Ajustes menores respecto a Figma son negociables si preservan la jerarquía visual de cuentas, movimientos y atajos.
- Usuarios acceden desde navegador web con conectividad típica; no se exige modo offline en esta entrega.
- El enmascaramiento de números de cuenta usa **últimos 4 dígitos visibles** en toda la landing; decisión confirmada en sesión de clarificación 2026-06-01.
- Los importes se presentan en **formato anglosajón con símbolo `$`** (coma para miles, punto para decimales); decisión confirmada en sesión de clarificación 2026-06-01.
- Ante fallo de carga por sección (cuentas o movimientos), se muestra **mensaje en español + «Reintentar»** en la sección afectada; decisión confirmada en sesión de clarificación 2026-06-01.
- El listado de cuentas se implementa como **`AccountsCarousel`** (carrusel horizontal de tarjetas); decisión confirmada en sesión de clarificación 2026-06-01 (input producto + maqueta Figma).
- Los chips **Todos / Cuentas / Tarjetas / Inversiones** filtran por tipo de cuenta según **FR-016**; decisión confirmada en sesión de clarificación 2026-06-01.
- La navegación inferior se implementa como componente compartido **`Navbar`** en `src/components/ui/` (Inicio, Transferir, Retirar, Pagos, Otros); decisión confirmada en sesión de clarificación 2026-06-01 (input producto + maqueta Figma).
- **`Error`** es compartido en `src/components/ui/`, con props `message` y `onRetry`; decisión confirmada en sesión de clarificación 2026-06-01.
