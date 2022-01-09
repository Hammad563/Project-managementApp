import {useEffect ,useRef, useState} from 'react';
import PropTypes from "prop-types";
import {Link, Redirect, useParams} from 'react-router-dom';
import Navbar from '../navbar/navbar';
import ProjectCard from '../dashboard/projectCard';
import './profile.css';


function Profile(props) {
    let loggedIn = useRef(null);
    const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);
    const [loggedInUserInfo, setLoggedInUserInfo] = useState({});
    const [userData, setUserData] = useState({});
    const [userProjects, setUserProjects] = useState([])

    // useEffects
    useEffect( () => {
        async function checkLoggedIn(){
            const response = await fetch('/auth/isLoggedIn',{
                method: 'GET'
            })
            const result = await response.json();
            loggedIn.current = result.isLoggedIn;
            setLoggedInUserInfo(result.user);
            setIsLoggedIn(loggedIn.current);
        }
        checkLoggedIn();
    },[isLoggedIn])

    useEffect( () => {
        async function fetchUserInfo() {
            if(loggedInUserInfo){
                const response = await fetch(`/userData/${loggedInUserInfo._id}`,{
                    method: 'GET'
                })
                const result = await response.json();
                if(result){
                    setUserData(result);
                }
            }
        }
        fetchUserInfo();
    },[loggedInUserInfo])

    // get 5 most recent projects

    useEffect( () => {
        async function getProjectData() {
            if(loggedInUserInfo){
                const response = await fetch(`/projects/${loggedInUserInfo._id}/profile`,{
                    method: 'GET'
                })
                const result = await response.json();
                setUserProjects(result);
            }else{
                console.log("you need to sign in");
                setIsLoggedIn(false)
            }
        }
        getProjectData();
    },[loggedInUserInfo])

    const logoutPressed = () => {
        setIsLoggedIn(false);
        setLoggedInUserInfo(null);
        props.logoutPressed();
    }
    if(isLoggedIn){
        return(
            <div className='profile-cont'>
                <Navbar logoutPressed={logoutPressed}></Navbar>
                <main className='col-md-9 ms-sm-auto col-lg-12 px-md-4 '>
                    <div className='profile-container'>
                        <h5 className='mt-3'> Profile:</h5>

                         {/* first half (profile Information) */}
                        <div className='row gutters-sm'>

                            <div className='col-md-4 mb-3'>
                                <div className='profile-card'>
                                    <div className='p-card-body'>
                                        <div className='d-flex justify-content-between'>
                                            <h3 className='card-title'>{userData.fullname}</h3>
                                            <Link to='/profile/update' className='btn editBtn'>Edit Profile</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='col-md-8'>
                                <div className='profile-card mb-3'>
                                    <div className='p-card-body'>
                                        <div className='row'>
                                            <div className='col-sm-3'>
                                                <p className='mb-0 descriptor-p'>Name</p>
                                            </div>
                                            <div className='col-sm-9 text-secondary'>
                                                {userData.fullname}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className='row'>
                                            <div className='col-sm-3'>
                                                <p className='mb-0 descriptor-p'>Email</p>
                                            </div>
                                            <div className='col-sm-9 text-secondary'>
                                                {userData.username}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className='row'>
                                            <div className='col-sm-3'>
                                                <p className='mb-0 descriptor-p'>Job</p>
                                            </div>
                                            <div className='col-sm-9 text-secondary'>
                                                {userData.job}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className='row'>
                                            <div className='col-sm-3'>
                                                <p className='mb-0 descriptor-p'>City</p>
                                            </div>
                                            <div className='col-sm-9 text-secondary'>
                                                {userData.location}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className='row'>
                                            <div className='col-sm-3'>
                                                <p className='mb-0 descriptor-p'>Institution</p>
                                            </div>
                                            <div className='col-sm-9 text-secondary'>
                                                {userData.institution}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h3 className="mt-4" style={{ color: "#005252" }}>
                                 Recent Projects
                            </h3>
                        </div>
                        <div className='row row-cols-1 row-cols-md-2 g-4 mb-3 '>
                            {
                                userProjects.map(  (project) => {
                                    return(
                                        <Link to={`/projects/${project._id}`} className='projectLink' key={project._id} > 
                                            <ProjectCard name={project.projectName} desc={project.projectDesc} key={project._id}></ProjectCard>
                                        </Link>
                                    )
                                })
                            }
                        </div>

                         {/* second half (recent projects)*/}

                    </div>
                </main>
            </div>
        )
    } else {
        return <Redirect to='/login'></Redirect>
    }

}

Profile.propTypes = {
    logoutPressed: PropTypes.func.isRequired
}

export default Profile