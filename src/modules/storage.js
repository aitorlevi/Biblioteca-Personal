export function addBookToShelf(book) {
    const currentCollection =
        JSON.parse(localStorage.getItem("collection")) || [];

    const isAlready = currentCollection.some(
        (savedBook) => savedBook.id === book.id,
    );

    if (isAlready) {
        return false;
    }

    currentCollection.push(book);
    localStorage.setItem("collection", JSON.stringify(currentCollection));

    return true;
}

export function removeBookFromShelf(bookId) {
    const currentCollection =
        JSON.parse(localStorage.getItem("collection")) || [];

    const bookPosition = currentCollection.findIndex(
        (book) => book.id === bookId,
    );

    if (bookPosition < 0) {
        return false;
    }

    currentCollection.splice(bookPosition, 1);
    localStorage.setItem("collection", JSON.stringify(currentCollection));

    return true;
}

export function updateStatusBookFromShelf(bookId, newStatus) {
    const currentCollection =
        JSON.parse(localStorage.getItem("collection")) || [];

    const bookPosition = currentCollection.findIndex(
        (book) => book.id === bookId,
    );

    if (bookPosition < 0) {
        return false;
    }

    currentCollection[bookPosition].status = newStatus;
    localStorage.setItem("collection", JSON.stringify(currentCollection));

    return true;
}

export function getBooksFromShelf() {
    const currentCollection =
        JSON.parse(localStorage.getItem("collection")) || [];

    return currentCollection;
}
