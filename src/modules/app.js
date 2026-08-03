import { searchBooks } from "./books.js";
import { printBooks } from "./render.js";

const form = document.querySelector("#formSearch");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const title = formData.get("title");

    const books = await searchBooks(title);
    console.log(books);

    printBooks(books);
});

async function testBooks() {
    const books = await searchBooks("el principito");
    console.log(books);

    printBooks(books);
}

await testBooks();
