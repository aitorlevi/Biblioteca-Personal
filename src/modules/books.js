const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
import { API_KEY } from "./config.js";

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

    rate(newRate) {
        if (typeof newRate != Number || newRate < 1 || newRate > 10) {
            throw new Error(`Valoración incorrecta`);
        }
        this.rating = newRate;
    }

    static validate({ title, author }) {
        if (!title && title.trim === "") {
            throw new Error(`Título incorrecto`);
        }
        if (!author && author.trim === "") {
            throw new Error(`Autor incorrecto`);
        }
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
    const url = `${BASE_URL}?q=${encodeURIComponent(title)}&langRestrict=es&maxResults=20&key=${API_KEY}`;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error en la petición ${response.status}`);
        }

        const data = await response.json();

        return data.items;
    } catch (error) {
        console.error("Hubo un problema con la búsqueda:", error);
    }
}

export async function getBook(id) {
    const url = `${BASE_URL}/${id}?key=${API_KEY}`;
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
    }
}

export function processBookData(rawData) {
    return {
        id: rawData.id,
        title: rawData.volumeInfo.title,
        subtitle: rawData.volumeInfo.subtitle ?? null,
        author:
            rawData.volumeInfo.authors && rawData.volumeInfo.authors.length > 0
                ? rawData.volumeInfo.authors.join(", ")
                : "Autor desconocido",
        price:
            rawData.saleInfo.saleability === "FOR_SALE"
                ? `${rawData.saleInfo.listPrice.amount} ${rawData.saleInfo.listPrice.currencyCode === "EUR" ? "€" : " - moneda desconocida"}`
                : "No está a la venta",
        isbn:
            rawData.volumeInfo.industryIdentifiers[1].identifier ??
            rawData.volumeInfo.industryIdentifiers[0].identifier,
        publishedDate: rawData.volumeInfo.publishedDate,
        publisher: rawData.volumeInfo.publisher,
        pageCount: rawData.volumeInfo.pageCount,
        categories:
            rawData.volumeInfo.categories &&
            rawData.volumeInfo.categories.length > 0
                ? rawData.volumeInfo.categories.join()
                : "",
        description: rawData.volumeInfo.description,
        imageLinks: rawData.volumeInfo.imageLinks,
    };
}
