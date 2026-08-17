import { printBooksFromStorage } from "./modules/render.js";
import { getBooksFromShelf } from "./modules/storage.js";

function showBooks() {
    const books = getBooksFromShelf();
    if (books) {
        printBooksFromStorage(books);
    }
}

showBooks();
