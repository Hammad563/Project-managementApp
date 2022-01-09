import React from "react";
import { Link } from "react-router-dom";
import landingPage_image from "../../images/landing_page.png";
import "./landing.css";

const Landing = () => {
  return (
    <div className="pageBody">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container">
          <h3 className="navbar-nav linkText" style={{ color: "white" }}>
            TaskNow
          </h3>
          <div>
              <ul className="navbar-nav">
                  <li className="nav-item"> maxime possimus hic deserunt dolore provident.
                  </li>  
              </ul>
          </div>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ">
            <li className="nav-item">
                <a className="nav-link" href="/register">
                 About us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/login">
                  Log In
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/register">
                  Register
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <header>
        <div className="page-header">
          <div className="container pt-3">
            <div className="row align-items-center justify-content-center">
              <div className="col-md-5">
                <h2>Complete your tasks with our software!</h2>
                <p>
                  Welcome to a place where you can manage your projects with
                  simplicity and ease!
                </p>
                <Link
                  type="button"
                  className="btn btn-outline-info btn-lg"
                  to="/register"
                >
                  {" "}
                  Join Now!
                </Link>
              </div>
            </div>
            <div className="col-md-5 image-landing">
              <img src={landingPage_image} />
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Landing;
