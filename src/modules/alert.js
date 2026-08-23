const alertMessage = document.querySelector("#alertMessage");

export function showAlert(type, messageDescription) {
    let message = null;
    switch (type) {
        case "success":
            alertMessage.classList.add("alert--success");
            message = `<h4>¡Éxito!</h4><p>${messageDescription}</p>`;
            break;
        case "error":
            alertMessage.classList.add("alert--error");
            message = `<h4>¡Error!</h4><p>${messageDescription}</p>`;
            break;
        default:
            message = `<h4>!Info!</h4><p>${messageDescription}</p>`;
            break;
    }
    alertMessage.innerHTML = message;

    alertMessage.classList.add("show");
    setTimeout(() => {
        alertMessage.classList.remove("show");
    }, 2000);
}
