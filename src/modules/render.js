export function printBooks(books) {
    const container = document.querySelector("#searchResult");

    container.innerHTML = books
        .filter(
            (book) =>
                book.volumeInfo.title != null &&
                book.volumeInfo.language === "es",
        )
        .map((book) => {
            const bookData = book.volumeInfo;
            const authors =
                bookData.authors && bookData.authors.length > 0
                    ? bookData.authors.join()
                    : "Autor desconocido";
            const picture =
                bookData.imageLinks && bookData.imageLinks.thumbnail
                    ? bookData.imageLinks.thumbnail
                    : "../../../../public/images/image-not-found.png";
            return `<article class="book-card">
                    <img src="${picture}" class="book-card__image" alt="${bookData.title}" />
                    <h3 class="book-card__title">${bookData.title}</h3>
                    <h4 class="book-card__subtitle">${bookData.subtitle ?? ""}</h4>
                    <h4 class="book-card__author">${authors}</h4>
                </article>`;
        })
        .join("");
}
