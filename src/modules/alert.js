const alertMessage = document.querySelector("#alertMessage");

export function showAlert(type, message) {
    switch (type) {
        case "success":
            alertMessage.classList.add("alert--success");

            break;
        case "error":
            alertMessage.classList.add("alert--error");
            break;
        default:
            break;
    }
    alertMessage.innerHTML = message;

    alertMessage.classList.add("show");
    setTimeout(() => {
        alertMessage.classList.remove("show");
    }, 2000);
}
