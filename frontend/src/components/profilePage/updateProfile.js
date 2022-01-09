import PropTypes from 'prop-types';
import { Redirect, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './profile.css';
import Navbar from '../navbar/navbar';





function UpdateProfile(props) {
    let loggedIn = useRef(null);
    const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);
    const [loggedInUserData, setLoggedInUserData] = useState({});
    const [nameValue, setNameValue] = useState("");
    const [instValue, setInstValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [locationValue, setLocationValue] = useState("");
    const [jobValue, setJobValue] = useState("");
    const [updateStatus, setUpdateStatus] = useState(false);

    // check if user is loggedin
    useEffect( () => {
       
        async function checkIfLoggedIn(){
            const response = await fetch('/auth/isLoggedIn', {
                method: 'GET'
            })
            const result  = await response.json();
            loggedIn.current = result.isloggedIn;
            setIsLoggedIn(loggedIn.current);
            setLoggedInUserData(result.user);
        }
        checkIfLoggedIn();
    }, [])

    // get user's data
    useEffect( () => {
        async function getUserData(){
            if(loggedInUserData && loggedInUserData._id){
                const response = await fetch(`/userData/${loggedInUserData._id}`,{
                    method: 'GET'
                })

                const result = await response.json();
                console.log("result", result)
                setNameValue(result.fullname);
                setEmailValue(result.username);
                setInstValue(result.institution);
                setJobValue(result.job);
                setLocationValue(result.location)
            }
        }
        getUserData();
    },[loggedInUserData])

    const handleNameChange = (e) => {
        setNameValue(e.target.value);
    }
    const handleEmailChange = (e) => {
        setEmailValue(e.target.value);
    }
    const handleJobChange = (e) => {
        setJobValue(e.target.value);
    }
    const handleInstChange = (e) => {
        setInstValue(e.target.value);
    }
    const handleLocationChange = (e) => {
        setLocationValue(e.target.value);
    }

    const submitFunction = async (e) => {
        e.preventDefault();
        const data = {
            userFullName: nameValue,
            userEmail: emailValue,
            userInst: instValue,
            userJob: jobValue,
            userLocation: locationValue,
            id: loggedInUserData._id
        }
        const response = await fetch(`/userData/updateProfile`,{
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        const result = await response.json();
        if(result.done){
            setUpdateStatus(true);
            console.log("updated successfully")
        }else{
            console.log("unsuccess user update")
        }
        
    }

    const logoutPressed = () => {
        setIsLoggedIn(false);
        setLoggedInUserData(null);
        props.logoutPressed();
    }
    return(
        <div className='profile-cont'>
          <Navbar logoutPressed={logoutPressed}></Navbar>
            <main className='col-md-9 ms-sm-auto col-lg-10 px-md-4 '>
                <form className='profile-container' onSubmit={submitFunction}>
                    <h4>Profile:</h4>
                    <div className='main-body'>
                        <div className='row'>
                                 {/*Profile section*/}
                            <div className='col-md-4 mb-3'>
                                <div className='profile-card'>
                                    <div className='p-card-body'>
                                        <div className='d-flex flex-column  align-items-center text-center'>
                                           <h4 className='card-title mb-0'>{nameValue}</h4> 
                                           <div className='mt-3'>
                                                <button type='submit' className='btn saveBtn'>Save Profile</button>
                                                <Link className='btn btnCancel' to='/profile'>Cancel Update</Link>
                                           </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                 {/*Profile section End*/}
                                 {/*Form Start*/}
                            <div className='col-md-8'>
                                <div className='profile-card mb-3'>
                                    <div className='p-card-body'>
                                        <div className='row'>
                                            <div className='col-sm-3'>
                                                <label htmlFor="nameInput">Full Name</label>
                                                <input type="text" id='nameInput' value={nameValue} name='fullname' onChange={handleNameChange} className='col-sm-9 text-secondary' />
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-sm-3'>
                                                <label htmlFor="emailInput">Email/username</label>
                                                <input type="email" id='emailInput' value={emailValue} name='email' onChange={handleEmailChange} className='col-sm-9 text-secondary' />
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-sm-3'>
                                                <label htmlFor="jobInput">Job</label>
                                                <input type="text" id='jobInput' value={jobValue} name='job' onChange={handleJobChange} className='col-sm-9 text-secondary' />
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-sm-3'>
                                                <label htmlFor="instInput">Institution</label>
                                                <input type="text" id='instInput' value={instValue} name='institution' onChange={handleInstChange} className='col-sm-9 text-secondary' />
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-sm-3'>
                                                <label htmlFor="locationInput">City/Town</label>
                                                <input type="text" id='locationInput' value={locationValue} name='location' onChange={handleLocationChange} className='col-sm-9 text-secondary' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*Form End*/}
                        </div>
                    </div>
                </form>
            </main>
        </div>
    )



}

UpdateProfile.propTypes = {
    logoutPressed: PropTypes.func
}

export default UpdateProfile;