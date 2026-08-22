import { Book, getBook, processBookData } from "./modules/books.js";
import {
    closeUpdateStatusOverlay,
    openUpdateStatusOverlay,
} from "./modules/overlay.js";
import { printBookInfo } from "./modules/render.js";
import { addBookToShelf } from "./modules/storage.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const bookInfoContainer = document.querySelector("#bookInfo");
const overlay = document.querySelector("#overlayStatus");
let currentRawData = null;

if (id) {
    getBook(id)
        .then((book) => {
            currentRawData = processBookData(book);
            printBookInfo(book);
        })
        .catch((error) => {
            console.error(error);
            document.querySelector("#bookInfo").innerHTML =
                "<p>No se ha podido cargar el libro.</p>";
        });
}

function addStatus(status) {
    const validStatuses = ["pending", "inProgress", "read", "notFinished"];

    if (!validStatuses.includes(status)) {
        console.error("Estado no disponible");
        return false;
    }

    const book = Book.createFromGoogleBooks(currentRawData, status);
    addBookToShelf(book);
    return true;
}

overlay.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => {
        if (addStatus(button.dataset.status)) {
            closeUpdateStatusOverlay();
        }
    });
});

bookInfoContainer.addEventListener("click", (event) => {
    if (event.target && event.target.matches("#addToLibraryBtn")) {
        openUpdateStatusOverlay();
    }
});
