export const VALID_STATUSES = ["pending", "inProgress", "read", "notFinished"];

const STATUS_LABELS = {
    pending: "Pendiente",
    inProgress: "Leyendo",
    read: "Leído",
    notFinished: "Sin terminar",
};

export function isValidStatus(status) {
    return VALID_STATUSES.includes(status);
}

export function getStatusLabel(status) {
    return STATUS_LABELS[status] ?? null;
}
