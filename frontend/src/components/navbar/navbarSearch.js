import React, { useState } from "react";
import PropTypes from 'prop-types';
import { Link, Redirect } from "react-router-dom";
import './navbar.css'


function NavBarSearch(props) {
    const [loggedIn, setLoggedIn] = useState(true);

    const handleLogout = async () => {
        const response = await fetch('/auth/logout',{
            method: 'GET'
        })
        const result = await response.json();
        if(result.logOut){
            setLoggedIn(false)
            props.logoutPressed();
        }
    }

    if(loggedIn){
        return(
            <header className="navbar navbar-dark sticky-top navbar-bg flex-md-nowrap shadow">
                <div className="navbarTitleContainer">
                    <Link className="col-md-3 col-lg-2 navbarTitle" to='/dashboard'> 
                        TaskNow
                    </Link>
                </div>
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
                <form className="" id="navbarSearch">
                    <input type="text" placeholder="Search for any projects" className="" />
                </form>
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap">
                        <button className="btn nav-bar-sign-out" onClick={handleLogout}>Log Out</button>
                    </li>
                </ul>
            </header>
        )
    } else{
        return <Redirect to='/login'></Redirect>
    }
}

NavBarSearch.propTypes =  {
    logoutPressed: PropTypes.func.isRequired
}

export default NavBarSearch;