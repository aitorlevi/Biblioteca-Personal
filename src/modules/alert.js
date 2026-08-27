import { escapeHtml } from "./html.js";

const alertMessage = document.querySelector("#alertMessage");
let hideTimeoutId = null;

export function showAlert(type, messageDescription) {
    let message = null;
    const safeMessage = escapeHtml(messageDescription);
    alertMessage.classList.remove(
        "alert--success",
        "alert--error",
        "alert--info",
    );
    switch (type) {
        case "success":
            alertMessage.classList.add("alert--success");
            message = `<i class="fa-solid fa-circle-check"></i><span>${safeMessage}</span>`;
            break;
        case "error":
            alertMessage.classList.add("alert--error");
            message = `<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i><span>${safeMessage}</span>`;
            break;
        case "info":
            alertMessage.classList.add("alert--info");
            message = `<i class="fa-solid fa-circle-info" aria-hidden="true"></i><span>${safeMessage}</span>`;
            break;
        default:
            message = `<span>${safeMessage}</span>`;
            break;
    }
    alertMessage.innerHTML = message;

    alertMessage.classList.add("show");

    clearTimeout(hideTimeoutId);
    hideTimeoutId = setTimeout(() => {
        alertMessage.classList.remove("show");
    }, 4000);
}
