import { Book, getBook, processBookData } from "./modules/books.js";
import { printBookInfo } from "./modules/render.js";
import { addBookToShelf } from "./modules/storage.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const bookInfoContainer = document.querySelector("#bookInfo");
let currentRawData = null;

bookInfoContainer.addEventListener("click", () => {
    if (event.target && event.target.matches("#addToLibraryBtn")) {
        const book = Book.createFromGoogleBooks(currentRawData);
        addBookToShelf(book);
    }
});

if (id) {
    getBook(id)
        .then((book) => {
            currentRawData = processBookData(book);
            printBookInfo(book);
        })
        .catch(() => {
            document.querySelector("#bookInfo").innerHTML =
                "<p>No se ha podido cargar el libro.</p>";
        });
}
