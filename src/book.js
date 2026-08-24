import { showAlert } from "./modules/alert.js";
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
            showAlert(
                "error",
                "No se ha podido cargar el libro. Por favor, prueba de nuevo.",
            );
        });
}

function addStatus(status) {
    const validStatuses = ["pending", "inProgress", "read", "notFinished"];

    if (!validStatuses.includes(status)) {
        return false;
    }

    const book = Book.createFromGoogleBooks(currentRawData, status);

    if (addBookToShelf(book)) {
        return true;
    } else {
        showAlert("info", "El libro ya está añadido en la biblioteca");
    }
}

overlay.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => {
        if (addStatus(button.dataset.status)) {
            closeUpdateStatusOverlay();
            showAlert("success", "Libro añadido a la biblioteca.");
        } else {
            showAlert(
                "error",
                "El libro no se ha podido añadir a la biblioteca.",
            );
        }
    });
});

bookInfoContainer.addEventListener("click", (event) => {
    if (event.target && event.target.matches("#addToLibraryBtn")) {
        openUpdateStatusOverlay();
    }
});
