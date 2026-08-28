const FOCUSABLE_SELECTOR = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
].join(", ");

function createOverlay(overlay) {
    if (!overlay) {
        return { open() {}, close() {} };
    }

    const modal = overlay.querySelector(".overlay__modal");
    let lastFocused = null;

    function getFocusable() {
        return Array.from(modal.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
            (element) => element.offsetParent !== null,
        );
    }

    function onKeydown(event) {
        if (event.key === "Escape") {
            event.preventDefault();
            close();
            return;
        }

        if (event.key !== "Tab") {
            return;
        }

        const focusable = getFocusable();

        if (focusable.length === 0) {
            event.preventDefault();
            modal.focus();
            return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }

    function open() {
        if (overlay.classList.contains("show")) {
            return;
        }

        lastFocused = document.activeElement;
        overlay.classList.add("show");
        document.addEventListener("keydown", onKeydown);
        (getFocusable()[0] ?? modal).focus();
    }

    function close() {
        if (!overlay.classList.contains("show")) {
            return;
        }

        overlay.classList.remove("show");
        document.removeEventListener("keydown", onKeydown);
        lastFocused?.focus();
    }

    overlay.addEventListener("click", (event) => {
        if (event.target === overlay) {
            close();
        }
    });

    overlay.querySelector(".overlay__close")?.addEventListener("click", close);

    return { open, close };
}

const statusOverlay = createOverlay(document.querySelector("#overlayStatus"));
const removeOverlay = createOverlay(document.querySelector("#overlayRemove"));

export const openUpdateStatusOverlay = statusOverlay.open;
export const closeUpdateStatusOverlay = statusOverlay.close;
export const openRemoveBookOverlay = removeOverlay.open;
export const closeRemoveBookOverlay = removeOverlay.close;
