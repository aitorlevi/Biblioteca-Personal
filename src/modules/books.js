const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
import { API_KEY } from "./config.js";

export class Book {
    constructor(
        title,
        author,
        subtitle = null,
        isbn = null,
        cover = null,
        publishedDate = null,
        publisher = null,
    ) {
        this.id = crypto.getRandomValues();
        this.title = title;
        this.subtitle = subtitle;
        this.author = author;
        this.isbn = isbn;
        this.cover = cover;
        this.publishedDate = publishedDate;
        this.publisher = publisher;
        this.status = null;
        this.rating = null;
        this.dataAdded = new Date().toISOString();
    }

    changeStatus(newStatus) {
        const status = [null, "pending", "inProgress", "read"];
        if (!status.includes(newStatus)) {
            throw new Error(`Estado incorrecto`);
        }
        this.status = newStatus;
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

    static createFromGoogleBooks(data) {
        return new Book({
            title: data.title,
            subtitle: data.subtitle,
            author: data.author,
            isbn: data.isbn,
            cover: data.cover,
            publishedDate: data.publishedDate,
            publisher: data.publisher,
        });
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
