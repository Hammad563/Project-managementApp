import { React, useEffect, useState, useRef } from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";
import PropTypes from "prop-types";
import Navbar from "../navbar/navbar";
import { Link, Redirect } from "react-router-dom";
import NavBarSearch from "../navbar/navbarSearch";
import ProjectCard from "./projectCard";
import { IoHomeOutline, IoPersonOutline,IoAddOutline } from "react-icons/io5";
import './dashboard.css'

const useStyles = makeStyles((theme) => ({
  root: {
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

const Dashboard = (props) => {
  const loggedIn = useRef(null);
  const newProjectForm = useRef(null);
  const closeModal = useRef(null);

  // useStates
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [userProjects, setUserProjects] = useState([]);
  const [projectCount, setProjectCount] = useState(0);
  const [sideBarProjects, setSideBarProjects] = useState([]);
  const [dataQueried, setDataQueried] = useState(false);

  console.log(sideBarProjects);

  // setup pagination
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const handlePagination = (value) => {
    setUserProjects([]);
    setPage(value);
  };

  // userEffects
  // get current user/check if loggedin with useEffect
  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/auth/isLoggedIn", {
        method: "GET",
      });
      const result = await response.json();
      //store "isLoggedIn" field in loggedIn useRef
      loggedIn.current = result.isLoggedIn;

      // store user Data in "loggedInUser" useState
      setLoggedInUser(result.user);
      // set IsLoggedIn to the "loggedIn.current" field
      setIsLoggedIn(loggedIn.current);
    }
    fetchData();
  }, []);

  //create project function
  const handleNewProject = async (e) => {
    e.preventDefault();
    const formData = new FormData(newProjectForm.current);
    const projectName = formData.get("projectName");
    const projectDesc = formData.get("projectDesc");

    const response = await fetch("/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projectName: projectName,
        projectDesc: projectDesc,
        ownerId: loggedInUser._id,
      }),
    });
    if (response) {
      closeModal.current.click();
      console.log("added new project");
      const data = await fetch(`/projects/${loggedInUser._id}/page/${page}`, {
        method: "GET",
      });
      const parsedData = await data.json();
      setUserProjects(parsedData);
    } else {
      console.log("could not create project");
    }
  };

  // useeffect project count
  useEffect(() => {
    async function getProjectCount() {
      if (loggedInUser && loggedInUser._id) {
        const response = await fetch(`/projects/${loggedInUser._id}/count`, {
          method: "GET",
        });
        const result = await response.json();
        setProjectCount(result.count);
      }
    }
    getProjectCount();
  }, [loggedInUser]);

  // useffect. Get projects based on the page
  useEffect(() => {
    async function getProjectData() {
      if (loggedInUser && loggedInUser._id) {
        const response = await fetch(
          `/projects/${loggedInUser._id}/page/${page}`,
          {
            method: "GET",
          }
        );
        const result = await response.json();
        setUserProjects(result);
        setDataQueried(true);
      }
    }
    getProjectData();
  }, [loggedInUser, page]);

  // 5 most recent projects
  useEffect(() => {
    async function getRecentProjects() {
      if (loggedInUser && loggedInUser._id) {
        const response = await fetch(`/projects/${loggedInUser._id}/profile`);
        const result = await response.json();
        setSideBarProjects(result);
      }
    }
    getRecentProjects();
  },[loggedInUser, userProjects]);

  const logoutPressed = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
    props.logoutPressed();
  };

  if (isLoggedIn && loggedInUser) {
    return (
      <div>
        <NavBarSearch logoutPressed={logoutPressed}></NavBarSearch>
        <div className="container-fluid">
          <div className="row">
            <nav className="col-md-3 col-lg-2 d-lg-block bg-light sidebar collapse" id="sideBarMenu">
              <div className="position-sticky pt-3 ">
                <ul className="nav flex-column navbarTask">
                  <li className="nav-item ">
                    <Link to="/dashboard" className="nav-link active">
                      <div className="sideBarItem">
                        <IoHomeOutline className='sidebarIcon'></IoHomeOutline>
                        Dashboard
                      </div>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/profile" className="nav-link active">
                      <div className="sidebarItem">
                        <IoPersonOutline className='sidebarIcon'></IoPersonOutline>
                        Profile
                      </div>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn nav-link"
                      data-bs-toggle="modal"
                      data-bs-target="#newProjectModal"
                      data-bs-whatever="@mdo"
                    >
                      Create a new project
                      <IoAddOutline className='sidebarIcon'></IoAddOutline>
                    </button>
                  </li>
                </ul>
                <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-5 mb-2">
                  <span>Recent Projects</span>
                </h6>
                <ul className="nav flex-column mb-2">
                  {sideBarProjects.map((project) => {
                    return (
                      <li key={project._id}>
                        <Link
                          to={"/projects/" + project._id}
                          className="projectLink nav-link"
                        >
                          {project.projectName}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                {userProjects.length === 0 && (
                  <div className="container">No projects!</div>
                )}
              </div>
            </nav>
            {/* Create New project form */}
            <div
              className="modal fade"
              id="newProjectModal"
              tabIndex="-1"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">
                
                      New Project
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                    ></button>
                  </div>
                  <div className="modal-body">
                    <form
                      id="newProjectForm"
                      ref={newProjectForm}
                      onSubmit={handleNewProject}
                    >
                      <div className="mb-3">
                        <label htmlFor="projectName" className="col-form-label">
                          Project Name:{" "}
                        </label>
                        <input
                          type="text"
                          id="projectName"
                          name="projectName"
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="projectDesc" className="col-form-label">
                          Project Description:{" "}
                        </label>
                        <textarea
                          id="projectDesc"
                          name="projectDesc"
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          ref={closeModal}
                          id="closeModal"
                          className="btn btnClose"
                          data-bs-dismiss="modal"
                        >
                          close
                        </button>
                        <button type="submit" className="btn createButton">
                          Create Project
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Dashboard*/}
            <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
              <div className="">
                <h1 className="h2 dashTitle">Dashboard</h1>
              </div>
              <div className="row">
                {userProjects.map((project) => {
                  return (
                    <Link
                      to={"/projects/" + project._id}
                      className="projectLink"
                      key={project._id}
                    >
                      <ProjectCard
                        name={project.projectName}
                        desc={project.projectDesc}
                        key={project._id}
                      ></ProjectCard>
                    </Link>
                  );
                })}
                {userProjects.length === 0 && (
                  <div>
                    <h3>No Projects</h3>
                  </div>
                )}
              </div>
              {/* Pagination */}
              <div className="">
                <div className={classes.root}>
                  <Typography align="center"></Typography>
                  <Pagination
                    count={Math.floor(projectCount / 14) + 1}
                    page={page}
                    onChange={handlePagination}
                  ></Pagination>
                </div>
              </div>
            </div>
            {/* End */}
          </div>
        </div>
      </div>
    );
  } else return <Redirect to="/login"></Redirect>;
};

Dashboard.propTypes = {
  logoutPressed: PropTypes.func.isRequired,
};

export default Dashboard;
