const DEFAULT_BOOK_COVER = "/public/images/image-not-found.png";

export function printBooks(books) {
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
            const bookData = book.volumeInfo;
            const authors =
                bookData.authors && bookData.authors.length > 0
                    ? bookData.authors.join()
                    : "Autor desconocido";
            const picture =
                bookData.imageLinks && bookData.imageLinks.thumbnail
                    ? bookData.imageLinks.thumbnail
                    : "../../../../public/images/image-not-found.png";

            return `<article>
                        <a class="book-card" href="./book.html?id=${id}">
                            <img src="${picture}" class="book-card__image" alt="${bookData.title}" />
                            <h3 class="book-card__title">${bookData.title}</h3>
                            <h4 class="book-card__subtitle">${bookData.subtitle ?? ""}</h4>
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
        bookData.industryIdentifiers[1].identifier ??
        bookData.industryIdentifiers[0].identifier;
    const publishedDate = book.volumeInfo.publishedDate;
    const publisher = book.volumeInfo.publisher;
    const pageCount = book.volumeInfo.pageCount;
    const categories =
        book.volumeInfo.categories && book.volumeInfo.categories.length > 0
            ? book.volumeInfo.categories.join()
            : "";
    const description = book.volumeInfo.description;

    const pageTitle = document.querySelector("#pageTitle");
    pageTitle.innerHTML = `AitorTeca - ${title}`;

    container.innerHTML = `<div class="book-info__main">
                        <div class="book-info__image-container">
                            ${
                                bookData.imageLinks
                                    ? `<picture>
                                    <source media="(min-width: 1200px)" srcset="${bookData.imageLinks.large}"></source>
                                    <source media="(min-width: 768px)" srcset="${bookData.imageLinks.medium}"></source>
                                    <img class="img book-info__image" src="${bookData.imageLinks.small}" alt="${bookData.title} loading="eager"></img>
                                </picture>`
                                    : "<img class='img book-info__image' src='../../../../public/images/image-not-found.png' alt='Imagen no encontrada' />"
                            }
                            
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
                        <h3>SINOPSIS</h3>
                        <div class="book__summary-copy">
                            ${description}
                        </div>
                    </div>`;
}
