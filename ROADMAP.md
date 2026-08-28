# Hoja de ruta — AitorTeca

## Contexto

- **Estado actual**: sitio estático vanilla (3 páginas HTML, módulos ES, sin dependencias).
  Búsqueda contra Google Books desde el navegador, biblioteca en `localStorage`.
  Revisión completa aplicada (JS + HTML + accesibilidad + CSS, commits `368671e` → `7fe787d`).
  Versión marcada con el tag `v0-vanilla`.
- **Objetivo**: convertirlo en una app full-stack con SvelteKit para poder crecer sin techo
  (BD, auth, features de IA con la API de Anthropic, filtros, valoraciones, más páginas).
- **Motivo del cambio de arquitectura**: llamar a la API de Anthropic exige un backend
  (la key es un secreto real + CORS). Y una vez hay backend, la BD, la auth y las keys
  de terceros viven ahí.

## Principios

1. **Una fase a la vez.** Cada fase termina con la app funcionando y desplegada.
2. **Commit por fase** (o sub-fase). Nada de ramas largas sin integrar.
   Los commits y el push los ejecuta el usuario; Claude prepara los cambios en local.
3. **Conservar la lógica de dominio.** `processBookData`, sanitizador, mapa de estados,
   helpers de storage → se reutilizan casi tal cual. Lo que se reescribe es el _render_.
4. **No adelantar trabajo.** Sin BD hasta la Fase 5. Sin auth hasta que haya un motivo.
   Sin cascada multi-modelo de IA. Sin design system.
5. **Desplegar en continuo** desde la Fase 3.

---

## Fase 0 — Cerrar la revisión (CSS) ✅ Hecha (2026-08-28)

Empezó como pasada ligera y, a petición, creció a una revisión de diseño.

- [x] `.loader` separado del bloque `.overlay` (bloque propio, sin override posterior).
- [x] Clases muertas fuera: `.book-card__btn`, `.btn__primary`.
- [x] Variables sin uso eliminadas: `--color-black`, `--color-background-soft-opacity`,
      `--transition-normal`, `--shadow-sm`.
- [x] `@media` redundantes limpiados; bugs sueltos (`border-radius: var(--shadow-lg)`,
      `.menu :hover` → `.menu a:hover`, `font-size: var(--spacing-md)` en tarjetas).
- [x] **Paleta a tokens por rol**: `--color-bg` / `--color-surface` / `--color-surface-inset` /
      `--color-on-primary` / `--color-on-accent` / `--color-text-muted` / `--color-accent(-hover)`.
      Colores de estado reajustados hacia la paleta; `--color-alert` deja de ser gris neutro.
- [x] **Sistema de botones de 3 variantes**: `.btn` (primario), `.btn--ghost` (secundario,
      hover con `color-mix` que funciona sobre cualquier fondo), `.btn--danger` (destructivo).
      `:focus-visible` y `:disabled` añadidos. `btn--choose` → `btn--ghost` / `btn--danger`.
- [x] README reescrito.

**Pendiente para Fase 2** (necesita componente): el picker de estado del overlay
(4 opciones apiladas) → lista de elección única con estado seleccionado.

---

## Fase 1 — Fijar la versión vanilla ✅ Hecha (2026-08-28)

- [x] `main` al día con `origin`, con la Fase 0 dentro (`7fe787d`).
- [x] Tag anotado `v0-vanilla` sobre `7fe787d`, empujado al remoto.
- [x] Rama `vanilla` — no creada (opcional; `git branch vanilla v0-vanilla` si hace falta).

Uso durante la migración: `git diff v0-vanilla`, `git checkout v0-vanilla`,
`git branch <nombre> v0-vanilla`.

---

## Fase 2 — Andamiar SvelteKit + portar

### 2a. Andamiaje

- [ ] `npm create svelte@latest` → plantilla _Skeleton_.
- [ ] **Decisión: TypeScript**. Recomendado sí (el proyecto va a crecer). Se puede empezar
      en JS y migrar `<script>` por `<script lang="ts">` poco a poco.
- [ ] **Decisión: adapter de despliegue** (`@sveltejs/adapter-vercel` / `-netlify` /
      `-cloudflare`). Elegir ya porque condiciona env vars y funciones serverless.
- [ ] Vitest viene incluido → dejarlo listo.
- [ ] `main.css` → `src/app.css`, importado en `src/routes/+layout.svelte`.
- [ ] Sprite `icons.svg` y `public/` → `static/`.

### 2b. Port de páginas y lógica

| Vanilla                                                | SvelteKit                                                             |
| ------------------------------------------------------ | --------------------------------------------------------------------- |
| `index.html` + `app.js`                                | `src/routes/+page.svelte` (búsqueda)                                  |
| `book.html` + `book.js`                                | `src/routes/book/+page.svelte` (+ luego `+page.server.js`)            |
| `library.html` + `library.js`                          | `src/routes/library/+page.svelte`                                     |
| `<head>` + overlay duplicados                          | `+layout.svelte` + componentes `<Overlay>`, `<Alert>`, `<Loader>`     |
| `render.js` (HTML con strings)                         | **se elimina** → componentes `<BookCard>`, `<BookInfo>`               |
| `escapeHtml` en todos lados                            | **se elimina** → Svelte escapa `{...}` solo                           |
| `sanitizeHtml` (descripción)                           | **se conserva** → `{@html sanitize(desc)}`                            |
| `processBookData`, mapa de estados, `books.js` helpers | se copian casi tal cual a `src/lib/`                                  |
| `storage.js` (`localStorage`)                          | se conserva de momento (`src/lib/storage.js`), se usa solo en cliente |
| `overlay.js` (foco, Esc, trap)                         | lógica dentro del componente `<Overlay>` o un `action` de Svelte      |

- [ ] Portar la lógica pura a `src/lib/` y **añadir tests Vitest** a `processBookData` y
      al sanitizador (ahora que por fin es testeable).
- [ ] Verificar accesibilidad tras el port (roles de diálogo, live regions, foco).

**Decisiones a cerrar**: TypeScript (sí/no), adapter.
**Hecho cuando**: las 3 páginas funcionan en `npm run dev` con paridad de features. Commit.

---

## Fase 3 — Google Books en el servidor

**Objetivo**: que la key de Google Books no llegue nunca al navegador.

- [ ] `config.js` → fuera. Key en `.env` como `GOOGLE_BOOKS_API_KEY`
      (`$env/static/private`, nunca `PUBLIC_`).
- [ ] Búsqueda: `+page.server.js` con `form action`, o `src/routes/api/search/+server.js`.
- [ ] Ficha de libro: `src/routes/book/+page.server.js` con `load` que llama a Google Books
      del lado servidor.
- [ ] `booksUrl` / `requestJson` se mueven al servidor.
- [ ] **Primer despliegue** con el adapter elegido. Configurar la env var en el hosting.
- [ ] `.env.example` + nota en el README.

**Hecho cuando**: la app está desplegada y las llamadas a Google Books salen del servidor.
A partir de aquí, cada fase termina con deploy.

---

## Fase 4 — Anthropic (primera feature de IA)

**Objetivo**: proxy de Anthropic + **una** feature concreta. No construir una plataforma.

- [ ] `npm i @anthropic-ai/sdk`. `ANTHROPIC_API_KEY` como env var **de servidor**.
- [ ] `src/routes/api/ai/.../+server.js`: llama a `messages` con **streaming**, reenvía
      como SSE al navegador.
- [ ] **Rate limiting** propio en ese endpoint + `max_tokens` con tope.
- [ ] **Decisión: modelo.** `claude-haiku-4-5` ($1/$5 por millón) o `claude-sonnet-5`
      ($2/$10) para presupuesto de hobby; `claude-opus-5` ($5/$25) si hace falta más.
- [ ] Elegir **una** feature de arranque:
    - "¿De qué trata este libro sin spoilers?" (resumen de la sinopsis)
    - "Recomiéndame libros similares a este" (a partir de los metadatos)
    - Búsqueda en lenguaje natural sobre la biblioteca ("novelas cortas de ci-fi que ya leí")
    - Resumen de gustos a partir de la biblioteca guardada
- [ ] Nunca llamar a Anthropic desde el navegador en producción.

**Decisiones a cerrar**: modelo, feature de arranque.
**Hecho cuando**: la feature funciona en producción con rate limiting y tope de tokens.

---

## Fase 5 — Base de datos + autenticación

**Objetivo**: la biblioteca deja de ser `localStorage` y pasa a ser por usuario.
Auth primero, luego migrar los datos.

### 5a. Auth

- [ ] **Decisión: enfoque de auth.** Lo que recomiende SvelteKit en su momento, o un
      servicio (Supabase Auth / Clerk / Better Auth) para no pelearse con sesiones.
- [ ] Login / logout / sesión. Rutas protegidas con `hooks.server.js`.

### 5b. BD

- [ ] **Decisión: BD y hosting.** SQLite (local, cero infra) o Postgres en free tier
      (Neon / Supabase / Turso).
- [ ] **Decisión: ORM.** Drizzle (ligero) o Prisma.
- [ ] Esquema: `user`, `book` (o `saved_book` con FK a `user`, estado de lectura, fecha).
- [ ] Migrar `addBookToShelf` / `removeBookFromShelf` / `updateStatusBookFromShelf` /
      `getBooksFromShelf` de `localStorage` a consultas a BD.
- [ ] Migración de datos existentes: al primer login, subir lo que haya en `localStorage`.
- [ ] Retirar el bloque de migración `collection` → `library` de `storage.js` (ya no aplica).

**Decisiones a cerrar**: enfoque de auth, BD, hosting, ORM.
**Hecho cuando**: un usuario logueado ve su biblioteca desde cualquier dispositivo.

---

## Fase 6 — Más implementaciones

Bucket abierto, ya barato con framework + BD:

- [ ] **Valoraciones** (el modelo `Book` ya tiene `rating`; ver `todo.md`). Requiere BD.
- [ ] **Filtros** (por estado, autor, género, valoración). Requiere BD para que valga la pena.
- [ ] Más páginas (perfil, estadísticas de lectura, listas).
- [ ] Paginación de resultados de búsqueda.
- [ ] Reintentos con backoff en las llamadas a Google Books (503 `backendFailed`).

---

## Registro de decisiones

| Fecha | Decisión                  | Elección | Motivo |
| ----- | ------------------------- | -------- | ------ |
|       | TypeScript                |          |        |
|       | Adapter de despliegue     |          |        |
|       | Hosting                   |          |        |
|       | Modelo de Anthropic       |          |        |
|       | Feature de IA de arranque |          |        |
|       | Enfoque de auth           |          |        |
|       | BD + hosting de BD        |          |        |
|       | ORM                       |          |        |

## Aparcadero (ideas sin fecha)

- Open Graph / metadatos para compartir.
- PWA / offline.
- Import/export de la biblioteca.
- Tests E2E (Playwright).
- i18n (ahora todo en español).
- Componetizar de verdad si el HTML repetido vuelve a molestar (Astro-style islands N/A ya con SvelteKit).

## Referencia rápida — Anthropic

- Todo pasa por `POST /v1/messages`. SDK: `@anthropic-ai/sdk`, **solo en servidor**.
- Streaming hacia el navegador (SSE) para UX de chat.
- Modelos y precio ($ por millón de tokens in / out):
    - `claude-haiku-4-5` — 1 / 5
    - `claude-sonnet-5` — 2 / 10
    - `claude-opus-5` — 5 / 25
- La key va sin prefijo `PUBLIC_` / `VITE_` (esos se envían al cliente).
- Existe `anthropic-dangerous-direct-browser-access`, pero expone la key → solo prototipos.
