const url = "https://openlibrary.org/search.json?q=test";
const headers = new Headers({
    "User-Agent": "BibliotecaPrivadaAitor/1.0 (aitorlevi@gmail.com)",
});
const options = {
    method: "GET",
    headers: headers,
};

export function getBooks() {
    fetch(url, options)
        .then((response) => console.log(response.json()))
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
}
