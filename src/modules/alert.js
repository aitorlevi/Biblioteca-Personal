const alertMessage = document.querySelector("#alertMessage");

export function showAlert(type, messageDescription) {
    let message = null;
    switch (type) {
        case "success":
            alertMessage.classList.add("alert--success");
            message = `<i class="fa-solid fa-circle-check"></i><span>${messageDescription}</span>`;
            break;
        case "error":
            alertMessage.classList.add("alert--error");
            message = `<i class="fa-solid fa-circle-xmark" aria-hidden="true"></i><span>${messageDescription}</span>`;
            break;
        case "info":
            alertMessage.classList.add("alert--info");
            message = `<i class="fa-solid fa-circle-info" aria-hidden="true"></i><span>${messageDescription}</span>`;
            break;
        default:
            message = `<span>${messageDescription}</span>`;
            break;
    }
    alertMessage.innerHTML = message;

    alertMessage.classList.add("show");
    setTimeout(() => {
        alertMessage.classList.remove("show");
    }, 4000);
}
