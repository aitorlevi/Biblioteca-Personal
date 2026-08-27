const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
import { GOOGLE_BOOKS_API_KEY } from "./config.js";

export class Book {
    constructor(
        id,
        title,
        subtitle = null,
        author,
        isbn = null,
        cover = null,
        publishedDate = null,
        publisher = null,
        status = null,
    ) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.author = author;
        this.isbn = isbn;
        this.cover = cover;
        this.publishedDate = publishedDate;
        this.publisher = publisher;
        this.status = status;
        this.rating = null;
        this.dataAdded = new Date().toISOString();
    }

    static createFromGoogleBooks(data, status = null) {
        return new Book(
            data.id,
            data.title,
            data.subtitle,
            data.author,
            data.isbn,
            data.imageLinks,
            data.publishedDate,
            data.publisher,
            status,
        );
    }
}

export async function searchBooks(title) {
    const url = `${BASE_URL}?q=${encodeURIComponent(title)}&langRestrict=es&maxResults=20&key=${GOOGLE_BOOKS_API_KEY}`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la petición ${response.status}`);
        }

        const data = await response.json();

        return data.items;
    } catch (error) {
        console.error("Hubo un problema con la búsqueda:", error);
        return false;
    }
}

export async function getBook(id) {
    const url = `${BASE_URL}/${id}?key=${GOOGLE_BOOKS_API_KEY}`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la petición ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error(
            "Hubo un problema al cargar la información del libro: ",
            error,
        );
        return false;
    }
}

export function processBookData(rawData) {
    const volumeInfo = rawData.volumeInfo ?? {};
    const saleInfo = rawData.saleInfo ?? {};
    const identifiers = volumeInfo.industryIdentifiers ?? [];
    const listPrice = saleInfo.listPrice;

    return {
        id: rawData.id,
        title: volumeInfo.title ?? "Título desconocido",
        subtitle: volumeInfo.subtitle ?? null,
        author:
            volumeInfo.authors && volumeInfo.authors.length > 0
                ? volumeInfo.authors.join(", ")
                : "Autor desconocido",
        price:
            saleInfo.saleability === "FOR_SALE"
                ? listPrice?.amount != null
                    ? `${listPrice.amount} ${listPrice.currencyCode === "EUR" ? "€" : "- moneda desconocida"}`
                    : "Precio no disponible"
                : "No está a la venta",
        isbn: identifiers[1]?.identifier ?? identifiers[0]?.identifier ?? null,
        publishedDate: volumeInfo.publishedDate ?? null,
        publisher: volumeInfo.publisher ?? null,
        pageCount: volumeInfo.pageCount ?? null,
        categories:
            volumeInfo.categories && volumeInfo.categories.length > 0
                ? volumeInfo.categories.join()
                : "",
        description: volumeInfo.description ?? null,
        imageLinks: volumeInfo.imageLinks ?? null,
    };
}
