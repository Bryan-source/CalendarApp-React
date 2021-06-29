import React from 'react'
import { useSelector } from 'react-redux'
import { AddNewFab } from './AddNewFab'
import { DeleteEventFab } from './DeleteEventFab'


export const Navbar = () => {
    const {activeEvent} = useSelector( state => state.calendar );
    return (
        <div className="navbar navbar-dark bg-dark mb-4">
            {/* <span className="navbar-brand">
                Bryan
            </span> */}
            {
                <AddNewFab/>
            }

            {/* <button className="btn btn-outline-danger">
            <i className="fas fa-sign-out-alt"></i>
                <span> Salir</span>
            </button> */}

            {
                (activeEvent) && <DeleteEventFab/>
            }
        </div>
    )
}
