const loader = document.querySelector("#loader");

export function showLoader() {
    loader.classList.add("show");
}

export function hideLoader() {
    setTimeout(() => {
        loader.classList.remove("show");
    }, 500);
}
