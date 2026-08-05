const BASE_URL = "https://www.googleapis.com/books/v1/volumes";
import { API_KEY } from "./config.js";

export class Book {
    constructor(title, author, isbn = null, cover = null, year = null) {
        this.id = crypto.getRandomValues();
        this.title = title;
        this.author = author;
        this.cover = cover;
        this.year = year;
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

    static createFromOpenLibrary(data) {
        return new Book({
            title: data.title,
            author: data.author_name?.[0] ?? "Autor desconocido",
            isbn: data.isbn?.[0] ?? null,
            cover: data.cover_i
                ? `https://covers.openlibrary.org/b/id/${dataCruda.cover_i}-M.jpg`
                : null,
            year: data.first_publish_year ?? null,
        });
    }
}

export async function searchBooks(title) {
    const url = `${BASE_URL}?q=${encodeURIComponent(title)}&langRestrict=es&key=${API_KEY}`;
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
