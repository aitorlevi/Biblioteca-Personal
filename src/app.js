import { searchBooks } from "./modules/books.js";
import { printBooks } from "./modules/render.js";

const form = document.querySelector("#formSearch");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const title = formData.get("title");

    searchBooks(title)
        .then((books) => printBooks(books))
        .catch(() => {
            document.querySelector("#searchResult").innerHTML =
                "<p>No se ha podido realizar la búsqueda.</p>";
        });

    printBooks(books);
});
