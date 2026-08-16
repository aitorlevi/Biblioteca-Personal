import { Book } from "./books.js";

export function addBookToShelf(book) {
    const currentCollection =
        JSON.parse(localStorage.getItem("collection")) || [];

    currentCollection.push(book);

    localStorage.setItem("collection", JSON.stringify(currentCollection));
}
