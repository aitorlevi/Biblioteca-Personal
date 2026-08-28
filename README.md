# AitorTeca

Biblioteca personal de libros. Buscas contra la API de Google Books, abres la ficha
de un libro y lo guardas en tu biblioteca con un estado de lectura.

Proyecto de aprendizaje. Ahora mismo es un sitio estático en JavaScript vanilla (módulos
ES, sin dependencias ni build). El plan de evolución está en [`ROADMAP.md`](ROADMAP.md)
(migración a SvelteKit, backend, base de datos, features de IA).

## Funcionalidad

- **Búsqueda** de libros por título (Google Books, resultados en español).
- **Ficha del libro**: portada, autor, ISBN, editorial, géneros, páginas, precio
  aproximado y descripción.
- **Biblioteca**: guardar/quitar libros y marcar su estado de lectura
  (Pendiente · Leyendo · Leído · Sin terminar).
- Los datos se guardan en `localStorage` del navegador (clave `library`).

## Páginas

| Archivo | Entrada JS | Para qué |
|---|---|---|
| `index.html` | `src/app.js` | Búsqueda |
| `book.html` | `src/book.js` | Ficha de un libro (`?id=<volumeId>`) |
| `library.html` | `src/library.js` | Biblioteca guardada |

## Puesta en marcha

### 1. API key de Google Books

`src/modules/config.js` no está versionado (está en `.gitignore`). Créalo con tu clave:

```js
// src/modules/config.js
export const GOOGLE_BOOKS_API_KEY = "TU_API_KEY";
```

Se obtiene en [Google Cloud Console](https://console.cloud.google.com/) activando la
*Books API*. Conviene restringir la clave por *HTTP referrer* a tu dominio.

### 2. Servir por HTTP

Hace falta un servidor estático (los `<script type="module">` y el sprite SVG con
`<use>` no funcionan abriendo el archivo con `file://`). Cualquiera vale:

```bash
python -m http.server 8000
# o
npx serve
```

Luego abre `http://localhost:8000`. En VS Code también sirve la extensión *Live Server*.

## Estructura

```
├── index.html · book.html · library.html
├── styles/main.css
├── public/               favicon, imagen por defecto, sprite de iconos
├── src/
│   ├── app.js · book.js · library.js     entradas de cada página
│   └── modules/
│       ├── books.js      Google Books API + modelo Book
│       ├── storage.js    biblioteca en localStorage
│       ├── render.js     construcción del DOM
│       ├── overlay.js    diálogos modales (foco, Esc, trampa de Tab)
│       ├── alert.js      notificaciones
│       ├── loader.js     indicador de carga
│       ├── status.js     estados de lectura
│       ├── html.js       escape de HTML
│       └── config.js     API key (no versionado)
├── ROADMAP.md
└── todo.md
```

## Despliegue

Sitio estático: sirve la carpeta tal cual en cualquier hosting. Las rutas son
relativas, así que funciona también bajo un subpath.
