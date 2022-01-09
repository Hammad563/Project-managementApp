import React, { useState } from "react";
import PropTypes from "prop-types";
import "./taskForm.css";

const TaskForm = (props) => {
    const [taskData, setTaskData] = useState("");

    const handleTaskData = (e) => {
        setTaskData(e.target.value)
    }

    const createTaskFunction = async (e) => {
        e.preventDefault();
        const response = await fetch('/projects/newTask',{
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                projectId: props.projectId,
                taskText: taskData,
                taskState: "ND"
            })
        });
        if(response){
            setTaskData("");
            props.newTaskAdded();
            console.log("added Task")
        }

    }
    return(
        <div className="card p-3 border mt-3 shadow">
            <form onSubmit={createTaskFunction}>
                <div className="mb-3">
                    <label htmlFor="taskText" className="form-label">New Task</label>
                    <textarea onChange={handleTaskData} value={taskData} id="taskText" name="taskText" className=""></textarea>
                    <button type="submit" className="btn">Create Task</button>
                    <button className="btn btnClose" onClick={ (e) => (props.closeTaskForm(), e.preventDefault())} >close</button>
               </div>
            </form>
        </div>
    )

}
TaskForm.propTypes =  {
    newTaskAdded: PropTypes.func,
    projectId: PropTypes.string.isRequired,
    closeTaskForm: PropTypes.func.isRequired
}

export default TaskForm;