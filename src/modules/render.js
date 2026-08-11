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
    const authors =
        bookData.authors && bookData.authors.length > 0
            ? bookData.authors.join()
            : "Autor desconocido";
    const categories =
        bookData.categories && bookData.categories.length > 0
            ? bookData.categories.join()
            : "";
    const picture =
        bookData.imageLinks && bookData.imageLinks.thumbnail
            ? bookData.imageLinks.thumbnail
            : "../../../../public/images/image-not-found.png";
    const price = `${book.saleInfo.listPrice.amount} ${book.saleInfo.listPrice.currencyCode === "EUR" ? "€" : " - moneda desconocida"}`;

    container.innerHTML = `<div class="book-info__main">
                        <div class="book-info__image-container">
                            <img
                                class="img book-info__image"
                                src="${picture}"
                                alt="${bookData.title}"
                            />
                        </div>
                        <div class="book-info__titles">
                            <div class="book-info__copy">
                                <h2>${bookData.title}</h2>
                                ${bookData.subtitle ? `<h4>${bookData.subtitle}</h4>` : ""}
                                <h5>${authors}</h5>
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
                            <li class="book__data-item">Fecha de publicación: ${bookData.publishedDate}</li>
                            <li class="book__data-item">Editorial: ${bookData.publisher}</li>
                            <li class="book__data-item">Géneros: ${categories}</li>
                            <li class="book__data-item">Nº de páginas: ${bookData.pageCount}</li>
                            <li class="book__data-item">ISBN: ${bookData.industryIdentifiers.length > 1 ? bookData.industryIdentifiers[1].identifier : bookData.industryIdentifiers[0].identifier}</li>
                            <li class="book__data-item">Precio: ${price}</li>
                        </ul>
                    </div>
                    <div class="book__summary">
                        <h3>SINOPSIS</h3>
                        <div class="book__summary-copy">
                            ${bookData.description}
                        </div>
                    </div>`;
}
