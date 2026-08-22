export function addBookToShelf(book) {
    const currentCollection =
        JSON.parse(localStorage.getItem("collection")) || [];

    const isAlready = currentCollection.some(
        (savedBook) => savedBook.id === book.id,
    );

    if (isAlready) {
        // TODO: Añadir alerta
        console.info("Libro ya en la lista");
        return;
    }

    currentCollection.push(book);

    localStorage.setItem("collection", JSON.stringify(currentCollection));
}

export function removeBookFromShelf(bookId) {
    const currentCollection =
        JSON.parse(localStorage.getItem("collection")) || [];

    const bookPosition = currentCollection.findIndex(
        (book) => book.id === bookId,
    );

    if (bookPosition >= 0) {
        console.log(bookPosition);
        currentCollection.splice(bookPosition, 1);
    } else {
        // TODO: Añadir alerta
        console.info("Este libro no esta en la colección");
        return false;
    }

    localStorage.setItem("collection", JSON.stringify(currentCollection));
    return true;
}

export function updateStatusBookFromShelf(bookId, newStatus) {
    const currentCollection =
        JSON.parse(localStorage.getItem("collection")) || [];

    const bookPosition = currentCollection.findIndex(
        (book) => book.id === bookId,
    );

    if (bookPosition >= 0) {
        currentCollection[bookPosition].status = newStatus;
    } else {
        // TODO: Añadir alerta
        console.info("Este libro no esta en la colección");
        return false;
    }

    localStorage.setItem("collection", JSON.stringify(currentCollection));
    return true;
}

export function getBooksFromShelf() {
    const currentCollection =
        JSON.parse(localStorage.getItem("collection")) || [];

    return currentCollection;
}
