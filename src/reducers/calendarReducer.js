import moment from 'moment';
import { types } from '../types/types';

const initialState = {
    events: [{
        id: new Date().getTime(),
        title: "Tarea de prueba",
        start: moment().toDate(),
        end: moment().add(2, 'hours').toDate(),
        bgcolor: '#fafafa',
        notes: 'Descripción de tarea',
        user: {
            _id: '123',
            name: 'Usuario'
        }
    }],

    activeEvent: null
}

export const calendarReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.eventAddNew:
            return {
                ...state,
                events: [...state.events, action.payload]
            }
    
        case types.eventSetActive:
            return {
                ...state,
                activeEvent: {
                    /* obtiene todos los elementos dentro del payload */
                    ...action.payload
                }
            }
        
        case types.eventClearActiveEvent:
            return {
                ...state,
                activeEvent: null
            }
        
        /* Editar un evento */
        case types.eventUpdated:
            return {
                ...state,
                events: state.events.map(
                    /* recibe el formValues activo como event del payload */
                    e => (e.id === action.payload.id) ? action.payload : e
                )
            }
        
            /* Elminar un evento*/
        case types.eventDeleted:
            return {
                ...state,
                events: state.events.filter(
                    e => (e.id !== state.activeEvent.id) 
                ),

                activeEvent: null
            }
        default:
            return state;
    }
}