import { showAlert } from "./modules/alert.js";
import { searchBooks } from "./modules/books.js";
import { printBooksFromSearch } from "./modules/render.js";

const form = document.querySelector("#formSearch");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const title = formData.get("title");

    searchBooks(title)
        .then((books) => printBooksFromSearch(books))
        .catch((error) => {
            console.error(error);
            showAlert(
                "error",
                "No se ha podido realizar la búsqueda. Por favor, prueba de nuevo.",
            );
        });
});
