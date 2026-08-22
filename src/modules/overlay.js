const overlayStatus = document.querySelector("#overlayStatus");
const overlayRemove = document.querySelector("#overlayRemove");

const overlayStatusCloseBtn = document.querySelector("#overlayStatusCloseBtn");
const closeOverlayRemoveBtn = document.querySelector("#overlayRemoveCloseBtn");

export function openUpdateStatusOverlay() {
    overlayStatus.classList.add("show");
}

export function closeUpdateStatusOverlay() {
    overlayStatus.classList.remove("show");
}

export function openRemoveBookOverlay() {
    overlayRemove.classList.add("show");
}

export function closeRemoveBookOverlay() {
    overlayRemove.classList.remove("show");
}

overlayStatus?.addEventListener("click", function (event) {
    if (event.target === overlayStatus) {
        closeUpdateStatusOverlay();
    }
});

overlayRemove?.addEventListener("click", function (event) {
    if (event.target === overlayRemove) {
        closeRemoveBookOverlay();
    }
});

overlayStatusCloseBtn?.addEventListener("click", closeUpdateStatusOverlay);
closeOverlayRemoveBtn?.addEventListener("click", closeRemoveBookOverlay);
