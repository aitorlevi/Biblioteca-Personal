import { GOOGLE_BOOKS_API_KEY } from "./config.js";

const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
const SEARCH_PARAMS = { langRestrict: "es", maxResults: "20" };

function booksUrl(path = "", params = {}) {
    const url = new URL(BASE_URL + path);

    for (const [name, value] of Object.entries({
        ...params,
        key: GOOGLE_BOOKS_API_KEY,
    })) {
        url.searchParams.set(name, value);
    }

    return url;
}

async function requestJson(url, errorContext) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la petición ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(errorContext, error);
        throw error;
    }
}

export class Book {
    constructor({
        id,
        title,
        subtitle = null,
        author,
        isbn = null,
        cover = null,
        publishedDate = null,
        publisher = null,
        status = null,
    }) {
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
        this.dateAdded = new Date().toISOString();
    }

    static createFromGoogleBooks(data, status = null) {
        return new Book({
            id: data.id,
            title: data.title,
            subtitle: data.subtitle,
            author: data.author,
            isbn: data.isbn,
            cover: data.imageLinks,
            publishedDate: data.publishedDate,
            publisher: data.publisher,
            status,
        });
    }
}

export async function searchBooks(title) {
    const url = booksUrl("", { q: title, ...SEARCH_PARAMS });
    const data = await requestJson(url, "Hubo un problema con la búsqueda:");

    return data.items;
}

export async function getBook(id) {
    const url = booksUrl(`/${encodeURIComponent(id)}`);

    return requestJson(
        url,
        "Hubo un problema al cargar la información del libro:",
    );
}

export function processBookData(rawData) {
    const volumeInfo = rawData.volumeInfo ?? {};
    const saleInfo = rawData.saleInfo ?? {};
    const identifiers = volumeInfo.industryIdentifiers ?? [];
    const listPrice = saleInfo.listPrice;

    const findIdentifier = (type) =>
        identifiers.find((entry) => entry?.type === type)?.identifier ?? null;
    const isbn =
        findIdentifier("ISBN_13") ??
        findIdentifier("ISBN_10") ??
        identifiers[0]?.identifier ??
        null;

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
        isbn,
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
