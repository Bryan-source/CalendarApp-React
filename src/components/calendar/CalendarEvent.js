import React from 'react'

/* Recibe los parámetros del objeto event definido en el CalendarScreen.js */
export const CalendarEvent = ({event}) => {
    const {title, user} = event;

    return (
        <div>
            <strong>{title}</strong>
            <span>-{user.name}</span>
        </div>
    )
}
