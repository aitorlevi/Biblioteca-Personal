import { printBooksFromStorage } from "./modules/render.js";
import {
    getBooksFromShelf,
    removeBookFromShelf,
    updateStatusBookFromShelf,
} from "./modules/storage.js";
import {
    closeRemoveBookOverlay,
    closeUpdateStatusOverlay,
    openRemoveBookOverlay,
    openUpdateStatusOverlay,
} from "./modules/overlay.js";
import { showAlert } from "./modules/alert.js";

const bookShelfContainer = document.querySelector("#bookShelf");
const overlay = document.querySelector("#overlayStatus");
let targetBook = null;

const btnConfirmRemove = document.querySelector("#confirmRemoveBtn");
const btnCloseRemoveOverlay = document.querySelector("#closeRemoveOverlayBtn");

function showBooks() {
    const books = getBooksFromShelf();
    if (books) {
        printBooksFromStorage(books);
    }
}

function updateStatus(status) {
    const validStatuses = ["pending", "inProgress", "read", "notFinished"];

    if (!validStatuses.includes(status)) {
        console.error("Estado no disponible");
        return false;
    }

    updateStatusBookFromShelf(targetBook, status);
    return true;
}

bookShelfContainer.addEventListener("click", (event) => {
    if (event.target && event.target.matches("#updateStatusBtn")) {
        targetBook = event.target.dataset.id;
        openUpdateStatusOverlay();
    } else if (event.target && event.target.matches("#removeBtn")) {
        targetBook = event.target.dataset.id;
        openRemoveBookOverlay();
    }
});

overlay.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => {
        if (updateStatus(button.dataset.status)) {
            closeUpdateStatusOverlay();
            showAlert("success", "Estado actualizado con éxito");
        } else {
            showAlert("error", "No se ha podido actualizar el estado");
        }
    });
});

btnCloseRemoveOverlay.addEventListener("click", closeRemoveBookOverlay);
btnConfirmRemove.addEventListener("click", () => {
    if (removeBookFromShelf(targetBook)) {
        closeRemoveBookOverlay();
        location.reload();
    }
});

showBooks();
