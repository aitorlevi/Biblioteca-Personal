import { processBookData } from "./books.js";

const DEFAULT_BOOK_COVER = "/public/images/image-not-found.png";

export function printBooksFromSearch(books) {
    console.log("printBooksFromSearch");
    console.log(books);
    const container = document.querySelector("#searchResults");
    container.innerHTML = books
        .filter(
            (book) =>
                book.volumeInfo.title != null &&
                book.volumeInfo.language === "es",
        )
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
                        <a class="book-card__link" href="./book.html?id=${id}" title="${title}">
                            <picture class="book-card__picture">
                                ${image}
                            </picture>
                            <h3 class="book-card__title">${title}</h3>
                            ${subtitle ? `<h4 class="book-card__subtitle">${subtitle}</h4>` : ""}
                            <h4 class="book-card__author">${authors}</h4>
                        </a>
                    </article>`;
        })
        .join("");
}

export function printBookInfo(book) {
    console.log("printBookInfo");
    console.log(book);
    const container = document.querySelector("#bookInfo");

    const processedBook = processBookData(book);

    const image = setImages(
        setSecuredImages(processedBook.imageLinks),
        processedBook.title,
        "book-info__image",
    );

    const pageTitle = document.querySelector("#pageTitle");
    pageTitle.innerHTML = `AitorTeca - ${processedBook.title}`;

    container.innerHTML = `<div class="book-info__main">
                        <div class="book-info__image-container">
                            <picture>
                                ${image}
                            </picture>
                        </div>
                        <div class="book-info__titles">
                            <div class="book-info__copy">
                                <h2>${processedBook.title}</h2>
                                ${processedBook.subtitle ? `<h4>${processedBook.subtitle}</h4>` : ""}
                                <h4>${processedBook.author}</h4>
                                <h5 class="book-info__price">Precio aproximado en librerías: <span class="book-info__money">${processedBook.price}</span></h5>
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
                            ${processedBook.isbn ? `<li class="book__data-item"><b>ISBN</b>: ${processedBook.isbn}</li>` : ""}
                            ${processedBook.publishedDate ? `<li class="book__data-item"><b>Fecha de publicación</b>: ${processedBook.publishedDate}</li>` : ""}
                            ${processedBook.publisher ? `<li class="book__data-item"><b>Editorial</b>: ${processedBook.publisher}</li>` : ""}
                            ${processedBook.categories ? `<li class="book__data-item"><b>Géneros</b>: ${processedBook.categories}</li>` : ""}
                            ${processedBook.pageCount ? `<li class="book__data-item"><b>Número de páginas</b>: ${processedBook.pageCount}</li>` : ""}
                        </ul>
                    </div>
                    ${
                        processedBook.description
                            ? `<div class="book__description">
                                    <h3>DESCRIPCIÓN</h3>
                                    <div class="book__description-copy">
                                        ${processedBook.description}
                                    </div>
                                </div>`
                            : ""
                    }`;
}

export function printBooksFromStorage(books) {
    console.log("printBooksFromStorage");
    console.log(books);

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
            const status = book.status;

            return `<article class="book-card" data-id="${id}">
                        <div class="book-card__link">
                            ${status != null ? `<div class="book-card__status">${printStatus(status)}</div>` : ""}
                            <a  href="./book.html?id=${id}">
                            <picture class="book-card__picture">
                                ${cover}
                            </picture>
                            </a>
                            <h3 class="book-card__title">${title}</h3>
                            ${subtitle ? `<h4 class="book-card__subtitle">${subtitle}</h4>` : ""}
                            <h4 class="book-card__author">${author}</h4>
                            <div class="book-card__buttons">
                                <button class="book-card__btn btn btn--choose" id="updateStatusBtn" data-id="${id}">
                                    Actualizar estado
                                </button>
                                 <button class="book-card__btn btn btn--choose" id="removeBtn" data-id="${id}">
                                    Quitar de la biblioteca
                                </button>
                            </div>
                        </div>
                    </article>`;
        })
        .join("");
}

// TODO: Borrar, solo se usa para probar
function compareImages(imagesToCompare, image) {
    switch (image) {
        case imagesToCompare.extraLarge:
            return "extraLarge";
        case imagesToCompare.large:
            return "large";
        case imagesToCompare.medium:
            return "medium";
        case imagesToCompare.small:
            return "small";
        case imagesToCompare.smallThumbnail:
            return "smallThumbnail";
        case imagesToCompare.thumbnail:
            return "thumbnail";
        default:
            return "default";
    }
}

function setImages(imageLinks, title, extraClases) {
    let largeSrc, mediumSrc, defaultSrc;

    if (imageLinks) {
        largeSrc =
            imageLinks.large ||
            imageLinks.medium ||
            imageLinks.small ||
            imageLinks.thumbnail ||
            imageLinks.smallThumbnail ||
            imageLinks.thumbnail ||
            DEFAULT_BOOK_COVER;
        mediumSrc =
            imageLinks.medium ||
            imageLinks.small ||
            imageLinks.smallThumbnail ||
            imageLinks.thumbnail ||
            DEFAULT_BOOK_COVER;
        defaultSrc =
            imageLinks.medium ||
            imageLinks.small ||
            imageLinks.smallThumbnail ||
            imageLinks.thumbnail ||
            DEFAULT_BOOK_COVER;
    } else {
        largeSrc = mediumSrc = defaultSrc = DEFAULT_BOOK_COVER;
    }

    return `<source media="(min-width: 1024px)" srcset="${largeSrc}">
            <source media="(min-width: 768px)" srcset="${mediumSrc}">
            <img 
            src="${defaultSrc}" 
            class="img${extraClases ? ` ${extraClases}` : ""}"
            alt="Portada de ${title}"
            title="${title}" 
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
    return Object.fromEntries(
        Object.entries(images).map(([property, value]) => [
            property,
            typeof value === "string"
                ? value.replace("http://", "https://")
                : value,
        ]),
    );
}
