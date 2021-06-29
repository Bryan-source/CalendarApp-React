/* EL rootReducer se encarga de combinar todos los reducers en uno  */

import {combineReducers} from 'redux';
import { calendarReducer } from './calendarReducer';
import {uiReducer} from './uiReducer';

/* combineReducers: Debido a que el createStore únicamente recibe un sólo reducer con el combineReducers hacemos que reciba más de uno. */

export const rootReducer = combineReducers({
    ui: uiReducer,
    calendar: calendarReducer,
    //TODO: AuthReducer
    
})