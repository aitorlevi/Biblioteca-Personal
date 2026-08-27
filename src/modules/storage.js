function getCollection() {
    const storedCollection = localStorage.getItem("collection");

    if (!storedCollection) {
        return [];
    }

    try {
        const collection = JSON.parse(storedCollection);
        return Array.isArray(collection) ? collection : [];
    } catch (error) {
        console.error("La colección almacenada no es válida:", error);
        return [];
    }
}

function saveCollection(collection) {
    localStorage.setItem("collection", JSON.stringify(collection));
}

export function addBookToShelf(book) {
    const currentCollection = getCollection();

    const isAlready = currentCollection.some(
        (savedBook) => savedBook.id === book.id,
    );

    if (isAlready) {
        return false;
    }

    currentCollection.push(book);
    saveCollection(currentCollection);

    return true;
}

export function removeBookFromShelf(bookId) {
    const currentCollection = getCollection();

    const bookPosition = currentCollection.findIndex(
        (book) => book.id === bookId,
    );

    if (bookPosition < 0) {
        return false;
    }

    currentCollection.splice(bookPosition, 1);
    saveCollection(currentCollection);

    return true;
}

export function updateStatusBookFromShelf(bookId, newStatus) {
    const currentCollection = getCollection();

    const bookPosition = currentCollection.findIndex(
        (book) => book.id === bookId,
    );

    if (bookPosition < 0) {
        return false;
    }

    currentCollection[bookPosition].status = newStatus;
    saveCollection(currentCollection);

    return true;
}

export function getBooksFromShelf() {
    return getCollection();
}
