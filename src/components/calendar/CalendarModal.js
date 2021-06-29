/* Clase 307 react hooks */

import React, { useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux';

import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';
import Swal from 'sweetalert2';
import { uiCloseModal } from '../../actions/ui';
import { eventAddNew, eventClearActiveEvent, eventUpdated } from '../../actions/events';


/* Sirve para centrar el modal en la pantalla */
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
/* Hace referencia de donde se va a mostrar el modal en este caso en el root que se encuentra en el index.html del proyecto */
Modal.setAppElement('#root');

/* Define el día de hoy añade una hora más a la actual add porque se está estableciendo una tarea futura */
const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowPlus1 = now.clone().add(1, 'hours');

const initEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: nowPlus1.toDate()
}

export const CalendarModal = () => {
    
    /* useSelector useDispatch */
    const {modalOpen} = useSelector( state => state.ui );
    const {activeEvent} = useSelector( state => state.calendar );
    const dispatch = useDispatch();

    /* useState */
    const [dateStart, setDateStart] = useState(now.toDate());
    const [dateEnd, setDateEnd] = useState(nowPlus1.toDate());
    const [titleValid, setTitleValid] = useState(true);

    /* No se usa useForm pero recoge los valores del formulario tal cual*/
    const [formValues, setFormValues] = useState(initEvent);
    const {title, notes, start, end} = formValues;


    /* useEffect se utiliza para obtener los valores del evento activo y que estos se muestren en el formulario del modal cuando se abra */
    useEffect(() => {
        if (activeEvent) {
            /* Aquí formValues toma todos los valores del objeto activeEvent incluyendo el id */
            setFormValues(activeEvent);
        } else {
            /* Esto es necesario porque al momento de seleccionar un evento y eliminarlo, al querer crear otro evento, el formValue conservó los valores del último activeEvent */
            setFormValues(initEvent);
        }
    }, [activeEvent, setFormValues])

    const handleInputChange = ({target}) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value /* No guarda las fechas pero estas se manejas de forma independiente en su handleDateChange */
        })
        
    }
    const closeModal = () => {
        dispatch(uiCloseModal(modalOpen));
        setFormValues(initEvent);

        /* Debe limpiar el evento activo y ponerlo en null al cerrar la modal de esa manera se evitan errores */
        dispatch(eventClearActiveEvent());
    }

    /* Captura la fecha inicial */
    const handleStartDateChange = (e) => {
        setDateStart(e);

        /* Captura y guarda la fecha en formValues */
        setFormValues({
            ...formValues,
            start: e
        })
    }

    /* Captura la fecha final */
    const handleEndDateChange = (e) => {
        setDateEnd(e);
        /* Captura y guarda la fecha en formValues */
        setFormValues({
            ...formValues,
            end: e
        })
    }

    const handleSubmitForm = (e) => {
        e.preventDefault();
        
        const momentStart = moment(start);
        const momentEnd = moment(end);

        /* Valida que la fecha inicial no sea exactamente la misma ni mayor a la final */
        if (momentStart.isSameOrAfter(momentEnd)) {
            return Swal.fire('Error', 'La fecha de inicio no puede ser mayor a la fecha final', 'error');
        }

        if (title.trim().length < 2) {
            return setTitleValid(false);
        }

        /* EDITAR o AGREGAR un nuevo evento */
        /* Si no hay algún evento activo entonces es porque se está creando una nota nueva de otro modo si lo hay, entonces se está editando el que está activo*/
        if (activeEvent) {
            /* el formValues de inicio no tiene un id como para ser igualado con los eventos que si tienen entonces cómo es que se usa este objeto para comparar? */
            /* formValues obtiene los valores del activeEvent incluyendo el id cuando pasa por el useEffect por eso se usa el formValues que funciona como el argumento para hacer la comparación en el calendarReducer */
            dispatch(eventUpdated(formValues));
        }else {
            dispatch(eventAddNew({
                ...formValues,
                id: new Date().getTime(),
                user: {
                    _id: '123',
                    name: 'Usuario'
                }
            }))
        }
        
        //TODO: Realizar la grabación en la base de datos
        setTitleValid(true);
        closeModal();
    }

    return (
        
        <Modal
            isOpen={modalOpen}
            /* onAfterOpen={afterOpenModal} */
            onRequestClose={closeModal}/* Cierra el modal al hacer click afuera de la pantalla */
            style={customStyles}
            closeTimeoutMS={200} /* Aplica 200ms para que se ejecute una transición suave al cerrarse, esto está definido en styles.css */

            /* Se aplican las clases que hacen referencia en el archivo de styles.css */
            className="modal"
            overlayClassName="modal-fondo" /* Es un estilo propio no de la librería */
            /* contentLabel="Example Modal" */
        >
            
            <h1> {(activeEvent)? 'Editar evento' : 'Nuevo evento'} </h1>
            <hr />
            <form 
                className="container"
                onSubmit={handleSubmitForm}
                >

                <div className="form-group">
                    <label>Fecha y hora inicio</label>

                    {/* Tiene un estilo en styles.css que creamos para desaparecer los bordes y quedarnos con el estilo del form-control  */}
                    <DateTimePicker
                        onChange={handleStartDateChange}
                        value={dateStart}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                        onChange={handleEndDateChange}
                        value={dateEnd}
                        minDate={dateStart} /* Valida que esta fecha no sea menor que la dateStart */
                        className="form-control"
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input 
                        type="text" 
                        className={`form-control ${!titleValid && 'is-invalid'}`}
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={handleInputChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <textarea 
                        type="text" 
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={notes}
                        onChange={handleInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block mb-2"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
            
            
        </Modal>
        
    )
}
