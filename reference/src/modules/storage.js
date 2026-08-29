const STORAGE_KEY = "library";

// Migración temporal de la clave antigua "collection" -> "library".
// Se puede eliminar una vez que todos los clientes hayan cargado la app.
try {
    const legacy = localStorage.getItem("collection");

    if (legacy !== null && localStorage.getItem(STORAGE_KEY) === null) {
        localStorage.setItem(STORAGE_KEY, legacy);
        localStorage.removeItem("collection");
    }
} catch (error) {
    console.error("No se ha podido migrar la biblioteca:", error);
}

function getLibrary() {
    let storedLibrary = null;

    try {
        storedLibrary = localStorage.getItem(STORAGE_KEY);
    } catch (error) {
        console.error("No se ha podido acceder al almacenamiento:", error);
        return [];
    }

    if (!storedLibrary) {
        return [];
    }

    try {
        const library = JSON.parse(storedLibrary);
        return Array.isArray(library)
            ? library.filter(
                  (book) =>
                      book !== null &&
                      typeof book === "object" &&
                      !Array.isArray(book) &&
                      book.id !== null &&
                      book.id !== undefined,
              )
            : [];
    } catch (error) {
        console.error("La biblioteca almacenada no es válida:", error);
        return [];
    }
}

function saveLibrary(library) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
        return true;
    } catch (error) {
        console.error("No se ha podido guardar la biblioteca:", error);
        return false;
    }
}

export function addBookToShelf(book) {
    const currentLibrary = getLibrary();

    const isAlready = currentLibrary.some(
        (savedBook) => savedBook.id === book.id,
    );

    if (isAlready) {
        return false;
    }

    currentLibrary.push(book);

    return saveLibrary(currentLibrary);
}

export function removeBookFromShelf(bookId) {
    const currentLibrary = getLibrary();

    const bookPosition = currentLibrary.findIndex((book) => book.id === bookId);

    if (bookPosition < 0) {
        return false;
    }

    currentLibrary.splice(bookPosition, 1);

    return saveLibrary(currentLibrary);
}

export function updateStatusBookFromShelf(bookId, newStatus) {
    const currentLibrary = getLibrary();

    const bookPosition = currentLibrary.findIndex((book) => book.id === bookId);

    if (bookPosition < 0) {
        return false;
    }

    currentLibrary[bookPosition].status = newStatus;

    return saveLibrary(currentLibrary);
}

export function getBooksFromShelf() {
    return getLibrary();
}
