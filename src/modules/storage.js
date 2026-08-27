function getCollection() {
    let storedCollection = null;

    try {
        storedCollection = localStorage.getItem("collection");
    } catch (error) {
        console.error("No se ha podido acceder al almacenamiento:", error);
        return [];
    }

    if (!storedCollection) {
        return [];
    }

    try {
        const collection = JSON.parse(storedCollection);
        return Array.isArray(collection)
            ? collection.filter(
                  (book) =>
                      book !== null &&
                      typeof book === "object" &&
                      !Array.isArray(book) &&
                      book.id !== null &&
                      book.id !== undefined,
              )
            : [];
    } catch (error) {
        console.error("La colección almacenada no es válida:", error);
        return [];
    }
}

function saveCollection(collection) {
    try {
        localStorage.setItem("collection", JSON.stringify(collection));
        return true;
    } catch (error) {
        console.error("No se ha podido guardar la colección:", error);
        return false;
    }
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

    return saveCollection(currentCollection);
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

    return saveCollection(currentCollection);
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

    return saveCollection(currentCollection);
}

export function getBooksFromShelf() {
    return getCollection();
}
