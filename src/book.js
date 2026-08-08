import { getBook } from "./modules/books.js";
import { printBookInfo } from "./modules/render.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

if (id) {
    getBook(id)
        .then((book) => printBookInfo(book))
        .catch(() => {
            document.querySelector("#bookInfo").innerHTML =
                "<p>No se ha podido cargar el libro.</p>";
        });
}
