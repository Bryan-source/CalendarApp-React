import { types } from "../types/types";

export const eventAddNew = (event) => ({
    type: types.eventAddNew,
    payload: event
});

export const eventSetActive = (event) => ({
    type: types.eventSetActive,
    payload: event
});

/* Al cerrar el modal debe limpiarse el activeEvent volviendo a ser null para evitar problemas */
/* Relación con el CalendarModal.js calendarReducer.js */
export const eventClearActiveEvent = () => ({type: types.eventClearActiveEvent});


/* Editar un evento */
/* Relación con el CalendarModal.js calendarReducer.js */
export const eventUpdated = (event) => ({
    type: types.eventUpdated,
    payload: event
});


/* Eliminar un evento */
export const eventDeleted = () => ({type: types.eventDeleted});