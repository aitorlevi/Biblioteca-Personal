const overlayStatus = document.querySelector("#overlayStatus");
const closeOverlayBtn = document.querySelector("#closeBtn");

const btnWantToReadBtn = document.querySelector("#btnWantToRead");
const btnReadingBtn = document.querySelector("#btnReading");
const btnReadBtn = document.querySelector("#btnRead");
const btnNotFinishedBtn = document.querySelector("#btnNotFinished");

export function openOverlay() {
    overlayStatus.classList.add("show");
}

export function closeOverlay() {
    overlayStatus.classList.remove("show");
}

overlayStatus.addEventListener("click", function (event) {
    if (event.target === overlayStatus) {
        closeOverlay();
    }
});

closeOverlayBtn.addEventListener("click", closeOverlay);
