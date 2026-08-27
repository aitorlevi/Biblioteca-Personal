import { showAlert } from "./modules/alert.js";
import { searchBooks } from "./modules/books.js";
import { hideLoader, showLoader } from "./modules/loader.js";
import { printBooksFromSearch } from "./modules/render.js";

const form = document.querySelector("#formSearch");

form.addEventListener("submit", async (e) => {
    showLoader();
    e.preventDefault();
    const formData = new FormData(form);
    const title = formData.get("title");

    searchBooks(title)
        .then((books) => {
            const resultCount = printBooksFromSearch(books);

            if (resultCount === 0) {
                showAlert(
                    "info",
                    "No se encontraron libros para esa búsqueda.",
                );
            }
        })
        .catch((error) => {
            console.error(error);
            showAlert(
                "error",
                "No se ha podido realizar la búsqueda. Por favor, prueba de nuevo.",
            );
        })
        .finally(() => {
            hideLoader();
        });
});
