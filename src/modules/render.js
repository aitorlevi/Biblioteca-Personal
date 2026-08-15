const DEFAULT_BOOK_COVER = "/public/images/image-not-found.png";

export function printBooks(books) {
    console.log("printBooks");
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
                book.volumeInfo.imageLinks,
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

    const bookData = book.volumeInfo;
    const title = book.volumeInfo.title;
    const subtitle = book.volumeInfo.subtitle ?? null;
    const authors =
        book.volumeInfo.authors && book.volumeInfo.authors.length > 0
            ? book.volumeInfo.authors.join()
            : "Autor desconocido";
    const price = `${book.saleInfo.listPrice.amount} ${book.saleInfo.listPrice.currencyCode === "EUR" ? "€" : " - moneda desconocida"}`;
    const isbn =
        book.volumeInfo.industryIdentifiers[1].identifier ??
        book.volumeInfo.industryIdentifiers[0].identifier;
    const publishedDate = book.volumeInfo.publishedDate;
    const publisher = book.volumeInfo.publisher;
    const pageCount = book.volumeInfo.pageCount;
    const categories =
        book.volumeInfo.categories && book.volumeInfo.categories.length > 0
            ? book.volumeInfo.categories.join()
            : "";
    const description = book.volumeInfo.description;
    const imageLinks = book.volumeInfo.imageLinks;

    let largeSrc, mediumSrc, defaultSrc;

    const image = setImages(
        book.volumeInfo.imageLinks,
        title,
        "book-info__image",
    );

    const pageTitle = document.querySelector("#pageTitle");
    pageTitle.innerHTML = `AitorTeca - ${title}`;

    container.innerHTML = `<div class="book-info__main">
                        <div class="book-info__image-container">
                            <picture>
                                ${image}
                            </picture>
                        </div>
                        <div class="book-info__titles">
                            <div class="book-info__copy">
                                <h2>${title}</h2>
                                ${subtitle ? `<h4>${subtitle}</h4>` : ""}
                                <h4>${authors}</h4>
                                <h5>Precio aproximado en librerías: ${price}</h5>
                            </div>
                            <div class="book-info__buttons">
                                <button class="btn btn__primary">
                                    Añadir a la biblioteca
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="book__data">
                        <h3 class="book__data-title">DATOS DEL LIBRO</h3>
                        <ul class="book__data-list">
                            <li class="book__data-item"><b>ISBN</b>: ${isbn}</li>
                            <li class="book__data-item"><b>Fecha de publicación</b>: ${publishedDate}</li>
                            <li class="book__data-item"><b>Editorial</b>: ${publisher}</li>
                            <li class="book__data-item"><b>Géneros</b>: ${categories}</li>
                            <li class="book__data-item"><b>Número de páginas</b>: ${pageCount}</li>
                        </ul>
                    </div>
                    <div class="book__summary">
                        <h3>DESCRIPCIÓN</h3>
                        <div class="book__summary-copy">
                            ${description}
                        </div>
                    </div>`;
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
            loading="eager"
            >`;
}
