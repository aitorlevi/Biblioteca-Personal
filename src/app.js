import { searchBooks } from "./modules/books.js";
import { printBooksFromSearch } from "./modules/render.js";

const form = document.querySelector("#formSearch");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const title = formData.get("title");

    searchBooks(title)
        .then((books) => printBooksFromSearch(books))
        .catch(() => {
            document.querySelector("#searchResult").innerHTML =
                "<p>No se ha podido realizar la búsqueda.</p>";
        });
});
