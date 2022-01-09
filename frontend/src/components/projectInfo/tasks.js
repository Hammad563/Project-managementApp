import PropTypes from 'prop-types';
import { useRef, useState } from 'react';
import './tasks.css'


const Task = (props) => {
    const [editTextValue, setTextValue] = useState(props.task.taskText);
    const updateTimelineForm = useRef(null);
    let timelineValue = "";
    
    // update task info
    const updateTaskText = async (e) => {
        e.preventDefault();
        const response = await fetch("/projects/updatetaskText",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: props.task._id,
                newText: editTextValue
            })
        })
        if(response){
            document.querySelector(`#editTextModal${props.task._id}`).click();
            props.taskUpdated();
            console.log("task updated")
        }else{
            console.log("could not update task")
        }
    }

    // update task state
    const updateTaskState = async (e) => {
        e.preventDefault();
        if(timelineValue){
            const response = await fetch("/projects/updatetask",{
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: props.task._id,
                    newState: timelineValue
                })
            });
            if(response){
                document.querySelector(`#closeUpdateModalButton${props.task._id}`).click();
                props.taskUpdated();
                console.log("state updated")
            }else{
                console.log("state unsuccess")
            }
        }
    }

    const deleteTask = async () => {
        const response = await fetch('/projects/deletetask',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                taskId: props.task._id
            })
        });
        if(response){
            props.taskUpdated();
            console.log('task deleted')
        }
    }

    // handle form changes
    const timeLineChange = (e) => {
        timelineValue = e.target.value;
    }
    const handleTextChange = (e) => {
        setTextValue(e.target.value);
    }
    return(
        <div>
            <div className='card mt-3 border shadow'>
                <div className='card-body'>
                    <p className='taskText'>{props.task.taskText}</p>
                </div>
                 {/* task buttons */}
                 <div className='taskBtnContainer'>
                     <button type='button' className='btn tasksButton' data-bs-toggle="modal" data-bs-target={"#stateModal" + props.task._id} >
                            Update Task
                     </button>
                     <button className="btn tasksButton" data-bs-toggle="modal" data-bs-target={"#editTextModal" + props.task._id}>
                        Edit Task
                     </button>
                     <button className='btn tasksButton' onClick={deleteTask}>
                        Delete Task
                     </button>
                 </div>
            </div>
            {/* Modals */}
            {/* Task state modal */}
            <div className='modal fade' id={"stateModal" + props.task._id}  tabIndex="-1" aria-label="timelineModal" aria-hidden="true">
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h4 className='modal-title'>Update progress for task: {props.task.taskText}</h4>
                             <button  type="button"className="btn-close"data-bs-dismiss="modal"aria-label="Close"></button>
                        </div>
                        <div className='modal-body'>
                            <form onChange={timeLineChange} onSubmit={updateTaskState} ref={updateTimelineForm}>
                                <div className='btn-group' role='group' aria-label="Basic radio toggle button group" >
                                    <input type='radio' name='btnradio' value='ND' id={"todoRadioButton" + props.task._id} autoComplete='off' className='btn-check active' />
                                    <label htmlFor={"todoRadioButton" + props.task._id} className='btn btn-outline-primary'>To-Do</label>
                                    
                                    <input type="radio" name='btnradio' value='IP' id={"inProgressRadio" + props.task._id} className='btn-check active'  />
                                    <label htmlFor={"inProgressRadio" + props.task._id}  className='btn btn-outline-primary'>In Progress</label>

                                    <input type="radio" name='btnradio' value='done' id={"doneRadio" + props.task._id} className='btn-check active'  />
                                    <label htmlFor={"doneRadio" + props.task._id}  className='btn btn-outline-primary'>Done</label>
                                </div>
                                <div className='modal-footer mt-2'>
                                    <button type='button'data-bs-dismiss="modal" id={"closeUpdateModalButton" + props.task._id} className='btn btnClose'>Close</button>
                                    <button type='submit' className='btn btnUpdate'>Update Progress</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Task text modal */}
            <div className='modal fade' id={'editTextModal' + props.task._id} tabIndex="-1" aria-labelledby={"editTextModalLabel" + props.task._id} aria-hidden="true">
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h4 className='modal-title' id={"editTaskModalLabel"}>Edit Task</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className='modal-mody'>
                            <form id={"editTaskTextForm"+ props.task._id} onSubmit={updateTaskText}>
                                <div className='mb-3'>
                                    <label htmlFor={"editTextArea" + props.task._id} className='col-form-label'>Task</label>
                                    <textarea value={editTextValue} onChange={handleTextChange}  id={"editTextArea" + props.task._id} className='form-control' ></textarea>
                                </div>
                                <div className='modal-footer'>
                                <button type="button" className="btn btnClose"data-bs-dismiss="modal">Close</button>
                                <button type="submit" className="btn btnUpdate">Update Task</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Modal text update end */}
        </div>
    )


}

Task.propTypes=  {
    task: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        taskText: PropTypes.string.isRequired
    }),
    taskUpdated: PropTypes.func.isRequired
}


export default Task;