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

    updateStatusBookFromShelf(targetUpdateStatus, status);
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
            closeOverlay();
            location.reload();
        }
    });
});

btnCloseRemoveOverlay.addEventListener("click", closeRemoveBookOverlay);
btnConfirmRemove.addEventListener("click", () => {
    if (removeBookFromShelf(targetBook)) {
        closeOverlay();
        location.reload();
    }
});

showBooks();
