import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import './navbar.css';


function Navbar(props) {
    const [loggedIn, setLoggedIn] = useState(true);

    const signout = async () => {
        const response = await fetch('/auth/logout',{
            method: 'GET'
        })
        const result = await response.json();
        if(result.logout){
            setLoggedIn(false);
            props.logoutPressed();
        }
    }

    if(loggedIn) {
        return(
            <header className="navbar navbar-light sticky-top nav-bg flex-md-nowrap p-0 shadow">
            <Link className="col-md-3 col-lg-2 me-0 px-3 brand-text navbarTitle" to='/dashboard'> TaskNow</Link>
            <button
            className="navbar-toggler position-absolute d-md-none collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
           <span className="navbar-toggler-icon"></span>
           </button>
           <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap">
                    <Link to='/dashboard' className="navLinks">DashBoard</Link>
                </li> 
            </ul>
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap">
                    <Link to='/profile' className="navLinks">Profile</Link>
                </li> 
            </ul>
            <ul className="navbar-nav px-3">
                <li className="nav-item text-nowrap">
                    <button className="btn nav-bar-sign-out" onClick={signout}>Log Out</button>
                </li>
            </ul>

        </header>
        )
    }

}

Navbar.propTypes = {
    logoutPressed: PropTypes.func.isRequired
}

export default Navbar;