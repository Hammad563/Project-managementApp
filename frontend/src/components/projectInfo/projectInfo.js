import React, { useRef, useEffect, useState } from "react";
import { useParams, Link, Redirect } from "react-router-dom";
import "./projectInfo.css";
import PropTypes from "prop-types";
import Navbar from "../navbar/navbar";
import TaskForm from "./taskForm";
import Task from "./tasks";

const Project = (props) => {
  const loggedIn = useRef(null);
  const closeUpdateBtn = useRef(null);
  const { projectId } = useParams();

  //useStates
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);
  const [projectData, setProjectData] = useState({});
  const [tasksData, setTasksData] = useState([]);
  const [editProjectName, setEditProjectName] = useState("");
  const [editProjectDesc, setEditProjectDesc] = useState("");
  const [projectDeleted, setProjectDeleted] = useState(false);
  const [databaseQueried, setDatabaseQueried] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  // useeffects
  // check if user loggedIn
  useEffect(() => {
    async function checkLoggedIn() {
      const response = await fetch("/auth/isLoggedIn", {
        method: "GET",
      });
      const result = await response.json();
      loggedIn.current = result.isLoggedIn;
      setIsLoggedIn(loggedIn.current);
    }
    checkLoggedIn();
  }, []);

  // get project information
  useEffect(() => {
    async function getProjectData() {
      if (!projectDeleted) {
        const response = await fetch(`/projects/projectData/${projectId}`);
        const result = await response.json();
        setProjectData(result);
        setEditProjectName(result.projectName);
        setEditProjectDesc(result.projectDesc);
      }
    }
    async function getTasks() {
      if (!projectDeleted) {
        const response = await fetch(`/projects/${projectId}/tasks`);
        const result = await response.json();
        setTasksData(result);
      }
    }
    getProjectData();
    getTasks();
  }, [projectId, projectDeleted]);

  const refreshTasks = async function () {
    const response = await fetch(`/projects/${projectId}/tasks`);
    const result = await response.json();
    setTasksData(result);
  };

  const handleEditProjectName = (e) => {
    setEditProjectName(e.target.value);
  };
  const handleEditProjectDesc = (e) => {
    setEditProjectDesc(e.target.value);
  };

  const updateProject = async () => {
    const response = await fetch(`/projects/updateProject/${projectId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newName: editProjectName,
        newDesc: editProjectDesc,
      }),
    });
    const result = await response.json();
    if (result.updated) {
      console.log("updated");
      closeUpdateBtn.current.click();
      setProjectData({
        ...projectData,
        projectName: editProjectName,
        projectDesc: setEditProjectDesc,
      });
    } else {
      console.log("could not be updated");
    }
  };
  const deleteProject = async () => {
    const response = await fetch(`/projects/deleteProject/${projectId}`, {
      method: "POST",
    });
    const result = await response.json();
    if (result.deleted) {
      setProjectDeleted(true);
      console.log("project deleted");
    } else {
      console.log("unsuccess");
    }
  };
  const logoutPressed = () => {
    setIsLoggedIn(false);
    props.logoutPressed();
  };

  if (isLoggedIn && !projectDeleted) {
    return (
      <div>
        <Navbar logoutPressed={logoutPressed}></Navbar>
        <div className="container-fluid">
          <div className="row">
              {/* sideBar */}
            
                
            <div className="col-md-9 col-lg-10 px-md-4">
                    {/* project Information */}
                <div className="projectHeader pb-2 mb-3 border-bottom">
                    <div className="row w-100">
                        <div className="col-10">
                            <h4>Project:</h4>
                            <h4>{projectData.projectName}</h4>
                            <p className="projectPtag">{projectData.projectDesc}</p>
                        </div>
                        {/* delete/update project */}
                        <div className="col-3">
                            <button className="btn projectButtons btn-primary " data-bs-toggle="modal" data-bs-target="#editProjectModal">
                                    Edit Project
                            </button>
                            <button className="btn projectButtons btn-danger" onClick={deleteProject}>
                                    Delete Project
                            </button>

                        </div>
                    </div>
                </div>
                 {/* Add a task Form */}
                <div className="row mb-3">
                    <div className="col-4">
                        <div className="shadow-lg container border rounded-3 taskContainer">
                            <h2 className="tasksHeader">Tasks To-Do</h2>
                            {
                                showTaskForm ? (<TaskForm projectId={projectId} newTaskAdded={refreshTasks} closeTaskForm={ () => {setShowTaskForm(false)}} ></TaskForm>)
                                : ( <button onClick={ (e) => (setShowTaskForm(true), e.preventDefault() )} className="btn addBtn" > Add a new task</button>)
                            }
                              {/* Task State management */}
                              {
                                  tasksData.length ? (
                                      tasksData.filter( (task) => {
                                          return task.taskState === 'ND';
                                      }).map( (task) => {
                                          return ( <Task key={task._id} task={task} taskUpdated={refreshTasks}></Task>)
                                      })
                                  ) : databaseQueried ? ( 
                                      <h3 className="m-3">No Tasks!</h3>
                                  ) : null
                              }
                        </div>
                    </div>
                    <div className="col-4">
                       <div className="shadow-lg container border rounded-3 taskContainer">
                         <h2 className="tasksHeader"> In-Progress</h2>
                         {
                             tasksData.filter( (task) => {
                                 return task.taskState === 'IP'
                             }).map( (task) => ( <Task task={task} taskUpdated={refreshTasks} key={task._id} ></Task>))
                         }
                       </div>
                    </div>
                    <div className="col-4">
                       <div className="shadow-lg container border rounded-3 taskContainer">
                         <h2 className="tasksHeader">Completed</h2>
                         {
                             tasksData.filter( (task) => {
                                 return task.taskState === 'done'
                             }).map( (task) => ( <Task task={task} taskUpdated={refreshTasks} key={task._id} ></Task>))
                         }
                       </div>
                    </div>
                </div>
                     {/* End of task state */}
            </div>
          </div>
            {/* Edit Project Modal */}
             <div className="modal fade" id="editProjectModal"tabIndex="-1" aria-labelledby="editProjectModalLabel" aria-hidden="true">
               <div className="modal-dialog">
                   <div className="modal-content">
                       <div className="modal-header">
                            <h3 className="modal-title" id="editProjectModalLabel">Edit Project</h3>
                            <button  type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" ></button>
                       </div>
                       <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="project-name" className="col-form-label">Project Name:</label>
                                    <input type="text" id="project-name" value={editProjectName} onChange={handleEditProjectName} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="desc-text" className="col-form-label">Description:</label>
                                    <textarea id="desc-text" value={editProjectDesc} onChange={handleEditProjectDesc} />
                                </div>
                            </form>
                       </div>
                       <div className="modal-footer">
                            <button type="button" data-bs-dismiss="modal" id="closeUpdateBtn" ref={closeUpdateBtn}>Close</button>
                            <button type="button" onClick={updateProject} className="btn btnUpdate">Edit Project</button>
                       </div>
                   </div>
                </div>              
             </div>
             {/* End of edit project modal */}
        </div>
      </div>
    );
  } else if (!isLoggedIn) {
    return <Redirect to="/login"></Redirect>;
  } else if (projectDeleted) {
    return <Redirect to="/dashboard"></Redirect>;
  }
};

Project.propTypes = {
  logoutPressed: PropTypes.func.isRequired,
};

export default Project;
