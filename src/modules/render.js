export function printBooks(books) {
    const container = document.querySelector("#searchResult");

    container.innerHTML = books
        .map((book) => {
            const bookData = book.volumeInfo;
            return `<article class="libro-card">
                    <img src="${bookData.imageLinks.thumbnail}" alt="${bookData.title}" />
                    <h3>${bookData.title}</h3>
                    <h4>${bookData.subtitle}</h4>
                    
                    <button
                        data-titulo="${bookData.title}"
                    >
                        Añadir a mi biblioteca
                    </button>
                </article>`;
        })
        .join("");
}
