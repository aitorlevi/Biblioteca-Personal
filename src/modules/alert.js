import { escapeHtml } from "./html.js";

const alertMessage = document.querySelector("#alertMessage");
let hideTimeoutId = null;

const icon = (name) =>
    `<svg class="icon" aria-hidden="true"><use href="./public/icons/icons.svg#${name}"></use></svg>`;

const ALERT_TYPES = {
    success: { modifier: "alert--success", icon: icon("alert-success") },
    error: { modifier: "alert--error", icon: icon("alert-error") },
    info: { modifier: "alert--info", icon: icon("alert-info") },
};

export function showAlert(type, messageDescription) {
    const safeMessage = escapeHtml(messageDescription);
    const config = ALERT_TYPES[type] ?? null;

    alertMessage.classList.remove(
        "alert--success",
        "alert--error",
        "alert--info",
    );

    if (config) {
        alertMessage.classList.add(config.modifier);
    }

    alertMessage.innerHTML = `${config?.icon ?? ""}<span>${safeMessage}</span>`;

    alertMessage.classList.add("show");

    clearTimeout(hideTimeoutId);
    hideTimeoutId = setTimeout(() => {
        alertMessage.classList.remove("show");
    }, 4000);
}
