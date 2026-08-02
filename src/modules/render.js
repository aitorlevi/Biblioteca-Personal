export function printBooks(books) {
    const container = document.querySelector("#searchResult");

    container.innerHTML = books
        .map((book) => {
            let cover = book.cover_i
                ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                : "/public/images/image-not-found.png";
            return `<article class="libro-card">
                    <img src="${cover}" alt="${book.title}" />
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                    <button
                        data-titulo="${book.title}"
                        data-autor="${book.author}"
                        data-isbn="${book.isbn ?? ""}"
                        data-portada="${book.cover_i ?? ""}"
                    >
                        Añadir a mi biblioteca
                    </button>
                </article>`;
        })
        .join("");
}
