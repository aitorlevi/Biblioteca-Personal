import { processBookData } from "./books.js";

const DEFAULT_BOOK_COVER = "/public/images/image-not-found.png";

export function printBooksFromSearch(books) {
    const container = document.querySelector("#searchResults");

    if (!Array.isArray(books)) {
        container.innerHTML = "";
        return 0;
    }

    const booksToRender = books.filter(
        (book) =>
            book?.volumeInfo?.title != null &&
            book.volumeInfo.language === "es",
    );

    container.innerHTML = booksToRender
        .map((book) => {
            const id = book.id;
            const title = book.volumeInfo.title;
            const subtitle = book.volumeInfo.subtitle ?? null;
            const authors =
                book.volumeInfo.authors && book.volumeInfo.authors.length > 0
                    ? book.volumeInfo.authors.join()
                    : "Autor desconocido";
            const image = setImages(
                setSecuredImages(book.volumeInfo.imageLinks),
                title,
                "book-card__image",
            );

            return `<article class="book-card">
                        <a class="book-card__link" href="./book.html?id=${encodeURIComponent(id)}" title="${escapeHtml(title)}">
                            <picture class="book-card__picture">
                                ${image}
                            </picture>
                            <h3 class="book-card__title">${escapeHtml(title)}</h3>
                            ${subtitle ? `<h4 class="book-card__subtitle">${escapeHtml(subtitle)}</h4>` : ""}
                            <h4 class="book-card__author">${escapeHtml(authors)}</h4>
                        </a>
                    </article>`;
        })
        .join("");

    return booksToRender.length;
}

export function printBookInfo(book) {
    if (!book) {
        return;
    }
    const container = document.querySelector("#bookInfo");

    const processedBook = processBookData(book);

    const image = setImages(
        setSecuredImages(processedBook.imageLinks),
        processedBook.title,
        "book-info__image",
    );

    const pageTitle = document.querySelector("#pageTitle");
    pageTitle.textContent = `AitorTeca - ${processedBook.title}`;

    container.innerHTML = `<div class="book-info__main">
                        <div class="book-info__image-container">
                            <picture>
                                ${image}
                            </picture>
                        </div>
                        <div class="book-info__titles">
                            <div class="book-info__copy">
                                <h2>${escapeHtml(processedBook.title)}</h2>
                                ${processedBook.subtitle ? `<h4>${escapeHtml(processedBook.subtitle)}</h4>` : ""}
                                <h4>${escapeHtml(processedBook.author)}</h4>
                                <h5 class="book-info__price">Precio aproximado en librerías: <span class="book-info__money">${escapeHtml(processedBook.price)}</span></h5>
                            </div>
                            <div class="book-info__buttons">
                                <button class="btn btn__primary" id="addToLibraryBtn">
                                    Añadir a la biblioteca
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="book__data">
                        <h3 class="book__data-title">DATOS DEL LIBRO</h3>
                        <ul class="book__data-list">
                            ${processedBook.isbn ? `<li class="book__data-item"><b>ISBN</b>: ${escapeHtml(processedBook.isbn)}</li>` : ""}
                            ${processedBook.publishedDate ? `<li class="book__data-item"><b>Fecha de publicación</b>: ${escapeHtml(processedBook.publishedDate)}</li>` : ""}
                            ${processedBook.publisher ? `<li class="book__data-item"><b>Editorial</b>: ${escapeHtml(processedBook.publisher)}</li>` : ""}
                            ${processedBook.categories ? `<li class="book__data-item"><b>Géneros</b>: ${escapeHtml(processedBook.categories)}</li>` : ""}
                            ${processedBook.pageCount ? `<li class="book__data-item"><b>Número de páginas</b>: ${escapeHtml(processedBook.pageCount)}</li>` : ""}
                        </ul>
                    </div>
                    ${
                        processedBook.description
                            ? `<div class="book__description">
                                    <h3>DESCRIPCIÓN</h3>
                                    <div class="book__description-copy">
                                        ${sanitizeHtml(processedBook.description)}
                                    </div>
                                </div>`
                            : ""
                    }`;
}

export function printBooksFromStorage(books) {
    if (!books) {
        return;
    }
    const container = document.querySelector("#bookShelf");

    container.innerHTML = books
        .map((book) => {
            const id = book.id;
            const title = book.title;
            const subtitle = book.subtitle;
            const author = book.author;
            const cover = setImages(
                setSecuredImages(book.cover),
                book.title,
                "book-card__image",
            );
            const statusLabel = printStatus(book.status);

            return `<article class="book-card" data-id="${escapeHtml(id)}">
                        <div class="book-card__link">
                            ${statusLabel ? `<div class="book-card__status">${escapeHtml(statusLabel)}</div>` : ""}
                            <a  href="./book.html?id=${encodeURIComponent(id)}">
                            <picture class="book-card__picture">
                                ${cover}
                            </picture>
                            </a>
                            <h3 class="book-card__title">${escapeHtml(title)}</h3>
                            ${subtitle ? `<h4 class="book-card__subtitle">${escapeHtml(subtitle)}</h4>` : ""}
                            <h4 class="book-card__author">${escapeHtml(author)}</h4>
                            <div class="book-card__buttons">
                                <button class="book-card__btn btn btn--choose js-update-status" data-id="${escapeHtml(id)}">
                                    Actualizar estado
                                </button>
                                 <button class="book-card__btn btn btn--choose js-remove" data-id="${escapeHtml(id)}">
                                    Quitar de la biblioteca
                                </button>
                            </div>
                        </div>
                    </article>`;
        })
        .join("");
}

function setImages(imageLinks, title, extraClases) {
    const getImageUrl = (...sources) =>
        sources.map(getSafeImageUrl).find(Boolean) ?? DEFAULT_BOOK_COVER;
    const largeSrc = getImageUrl(
        imageLinks?.large,
        imageLinks?.medium,
        imageLinks?.small,
        imageLinks?.thumbnail,
        imageLinks?.smallThumbnail,
    );
    const mediumSrc = getImageUrl(
        imageLinks?.medium,
        imageLinks?.small,
        imageLinks?.smallThumbnail,
        imageLinks?.thumbnail,
    );
    const defaultSrc = mediumSrc;

    return `<source media="(min-width: 1024px)" srcset="${escapeHtml(largeSrc)}">
            <source media="(min-width: 768px)" srcset="${escapeHtml(mediumSrc)}">
            <img 
            src="${escapeHtml(defaultSrc)}" 
            class="img${extraClases ? ` ${escapeHtml(extraClases)}` : ""}"
            alt="Portada de ${escapeHtml(title)}"
            title="${escapeHtml(title)}" 
            loading="eager"
            >`;
}

function printStatus(status) {
    const statusMap = {
        pending: "Pendiente",
        inProgress: "Leyendo",
        read: "Leído",
        notFinished: "Sin terminar",
    };

    return statusMap[status] ?? null;
}

function setSecuredImages(images) {
    if (!images || typeof images !== "object") {
        return null;
    }

    return Object.fromEntries(
        Object.entries(images).map(([property, value]) => [
            property,
            typeof value === "string"
                ? value.replace("http://", "https://")
                : value,
        ]),
    );
}

function getSafeImageUrl(value) {
    if (typeof value !== "string") {
        return null;
    }

    const securedValue = value.replace("http://", "https://");
    return /^https:\/\//i.test(securedValue) ? securedValue : null;
}

function escapeHtml(value) {
    const characters = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
    };

    return String(value ?? "").replace(
        /[&<>"']/g,
        (character) => characters[character],
    );
}

function sanitizeHtml(value) {
    const allowedTags = new Set([
        "P",
        "BR",
        "B",
        "STRONG",
        "I",
        "EM",
        "U",
        "UL",
        "OL",
        "LI",
        "BLOCKQUOTE",
        "A",
    ]);
    const parser = new DOMParser();
    const documentFragment = parser.parseFromString(
        String(value ?? ""),
        "text/html",
    );

    const sanitizeNode = (node) => {
        Array.from(node.children).forEach((element) => {
            if (!allowedTags.has(element.tagName)) {
                if (
                    ["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED"].includes(
                        element.tagName,
                    )
                ) {
                    element.remove();
                    return;
                }

                sanitizeNode(element);
                while (element.firstChild) {
                    element.parentNode.insertBefore(
                        element.firstChild,
                        element,
                    );
                }
                element.remove();
                return;
            }

            Array.from(element.attributes).forEach((attribute) => {
                if (element.tagName !== "A" || attribute.name !== "href") {
                    element.removeAttribute(attribute.name);
                }
            });

            if (element.tagName === "A") {
                const href = element.getAttribute("href");
                let url;

                try {
                    url = new URL(href, document.baseURI);
                } catch {
                    url = null;
                }

                if (!url || !["http:", "https:"].includes(url.protocol)) {
                    element.removeAttribute("href");
                }
            }

            sanitizeNode(element);
        });
    };

    sanitizeNode(documentFragment.body);
    return documentFragment.body.innerHTML;
}
