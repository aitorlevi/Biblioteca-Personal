import { showAlert } from "./modules/alert.js";
import { Book, getBook, processBookData } from "./modules/books.js";
import { hideLoader, showLoader } from "./modules/loader.js";
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
    showLoader();
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
        })
        .finally(() => {
            hideLoader();
        });
} else {
    showAlert("error", "El libro que se está intentando cargar no existe.");
}

function addStatus(status) {
    const validStatuses = ["pending", "inProgress", "read", "notFinished"];

    if (!validStatuses.includes(status)) {
        return { ok: false, reason: "invalidStatus" };
    }

    if (!currentRawData) {
        return { ok: false, reason: "noData" };
    }

    const book = Book.createFromGoogleBooks(currentRawData, status);

    if (!addBookToShelf(book)) {
        return { ok: false, reason: "duplicate" };
    }

    return { ok: true };
}

overlay.querySelectorAll("[data-status]").forEach((button) => {
    button.addEventListener("click", () => {
        const result = addStatus(button.dataset.status);

        if (result.ok) {
            closeUpdateStatusOverlay();
            showAlert("success", "Libro añadido a la biblioteca.");
        } else if (result.reason === "duplicate") {
            closeUpdateStatusOverlay();
            showAlert("info", "El libro ya está añadido en la biblioteca.");
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
