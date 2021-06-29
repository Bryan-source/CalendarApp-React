import React, { useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import moment from 'moment';

import { Navbar } from '../ui/Navbar';

/* Importaciòn para cambiar el idioma a español del calendar */
import { messages } from '../../helpers/calendar-massages-es';

/* En este import está todo el estilo del calendario para que se vea ordenado */
import 'react-big-calendar/lib/css/react-big-calendar.css';

/* Importaciòn para cambiar el idioma a español de las fechas del moment */
import 'moment/locale/es';
import { CalendarEvent } from './CalendarEvent';
import { CalendarModal } from './CalendarModal';
import { uiOpenModal } from '../../actions/ui';
import { eventClearActiveEvent, eventSetActive } from '../../actions/events';
import { AddNewFab } from '../ui/AddNewFab';
import { DeleteEventFab } from '../ui/DeleteEventFab';

moment.locale('es');


const localizer = momentLocalizer(moment); // or globalizeLocalizer
/* Estos events funcionan como parámetros para establecer una tarea */
/* const events = [{
    title: "Cumpleaños",
    start: moment().toDate(),
    end: moment().add(2, 'hours').toDate(),
    bgcolor: '#fafafa',
    notes: 'Comprar el pastel',
    user: {
        _id: '123',
        name: 'Bryan'
    }
}] */
export const CalendarScreen = () => {
    
    const {events, activeEvent} = useSelector( state => state.calendar );

    const dispatch = useDispatch();

    /* lastView hace referencia a la última visulización del usuario en el calendario la cual es almacenada en el local storage para que al abrir el calendario esta le muestro en la última sección que se quedó, si no se guardó en el localStorage entonces va a mostrar la sección de month */
    const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'month');

    const onDoubleClick = (e) => {
        dispatch(uiOpenModal());
        //dispatch(eventSetActive(e));
    }

    /* Este se llama cuando se dá un sólo click */
    const onSelectEvent = (e) => {
        dispatch(eventSetActive(e));
    }

    /* Este se llama cuando se cambia la vista en el calendario devuelve el nombre de la vista que se quedó */
    const onViewChange = (e) => {
        setLastView(e);
        localStorage.setItem('lastView', e);
    }

    /* Detecta si se da click fuera del evento y lo desactiva poniendo el activeEvent =null para ocultar el botón de delete */
    const onSelectSlot = (e) => {
        dispatch(eventClearActiveEvent());
    }
    /* Toma los parámetros del calendar como son event, start, end, isSelected para mofificarlos en este caso se aplica un estilo propio general */
    const eventStyleGetter = (event, start, end, isSelected) => {
        const style = {
            backgroundColor: '#367CF7',
            borderRadius: '0px',
            opacity: 0.8,
            display: 'block',
            color: 'white'
        }

        return {
            style
        }
    }
    return (
        /* La sección Month no muestra su diseño como debería y esto es debido a que no ocupa todo el ancho de la pantalla por esta razón se le aplica este estilo  */
        <div className="calendar-screen">
            <Navbar/>

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                messages={messages}
                
                /* Obtiene el estilo definido para cambiar el aspecto del calendar */
                eventPropGetter={eventStyleGetter}

                onDoubleClickEvent = {onDoubleClick}
                onSelectEvent={onSelectEvent}
                onView={onViewChange}

                /* tanto onSelectSlot como slectable de necesita para Detecta si se da click fuera del evento y lo desactiva poniendo el activeEvent =null para ocultar el botón de delete */ 
                onSelectSlot = {onSelectSlot}
                selectable = {true}

                /* Se especifica que la vista que va tener cuando ingresemos a la página es el lastView */
                view={lastView}

                components={{
                    /* Recive CalendarEvent.js como referencia */
                    /* En CalendarEvent se especifica lo que va a mostrar el recuadro de la tarea que se ubica en los diferentes días */
                    event: CalendarEvent
                }}
            />

            {/* Implementar una vez se hayan creado la base de datos */}
            {/* <AddNewFab/>

            {
                (activeEvent) && <DeleteEventFab/>
            } */}
            
            <CalendarModal/>
        </div>
    )
}
