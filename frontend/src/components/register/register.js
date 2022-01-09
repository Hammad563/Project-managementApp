import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import'./register.css';

const Register = () => {
    const [name, setName] = useState("");
    const [instValue, setInstValue] = useState("");
    const [jobValue, setJobValue] = useState("");
    const [locationValue, setLocationValue] = useState("");
    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [registerStatus, setRegisterStatus] = useState(false)

    const handleName = (e) => {
        setName(e.target.value);
    }
    const handleInst = (e) => {
        setInstValue(e.target.value);
    }
    const handleJob = (e) => {
        setJobValue(e.target.value);
    }
    const handleLoc = (e) => {
        setLocationValue(e.target.value);
    }
    const handleEmail = (e) => {
        setEmailValue(e.target.value);
    }
    const handlePassword = (e) => {
        setPasswordValue(e.target.value);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        const response = await fetch("/auth/register",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userFullName: name,
                userInst: instValue,
                userJob: jobValue,
                userLocation: locationValue,
                userEmail: emailValue,
                userPassword: passwordValue
            })
        })
        const data = await response.json();
        if(data.registered){
            setRegisterStatus(true);
            console.log("Created Account")
        }else{
            setRegisterStatus(false)
            console.log("Please use another email")
        }

    }


    if(!registerStatus){
        return(
            <div className="form-signin text-center">
                {/* Header */}
                <Link to="/">
                    <h1>TaskNow</h1>
                    <div className="row justify-content-center mb-4">
                        <div>About OpTask</div>
                    </div>
                </Link>
                <h1 className="h3 mb-3">Register Now!</h1>
                {/* Form */}
    
                <form onSubmit={handleSubmit}>
                    <div className="form-floating">
                        <input type="name" className="form-control" placeholder="Full Name" name="userFullName" id="userFullName" onChange={handleName} value={name}  />
                        <label htmlFor="userFullName">Full Name</label>
                    </div>
                    <div className="form-floating">
                        <input type="inst" className="form-control" placeholder="company/organization" name="userInst" id="userInst" onChange={handleInst} value={instValue}  />
                        <label htmlFor="userInst">Company/Organization</label>
                    </div>
                    <div className="form-floating">
                        <input type="jobName" className="form-control" placeholder="Job" name="userJob" id="userJob" onChange={handleJob} value={jobValue}  />
                        <label htmlFor="userJob">Job</label>
                    </div>
                    <div className="form-floating">
                        <input type="location" className="form-control" placeholder="city/town" name="userLocation" id="userLocation" onChange={handleLoc} value={locationValue}  />
                        <label htmlFor="userLocation">City/Town</label>
                    </div>
                    <div className="form-floating">
                        <input type="email" className="form-control" placeholder="Email Name" name="userEmail" id="userEmail" onChange={handleEmail} value={emailValue} />
                        <label htmlFor="userEmail">Email</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" placeholder="password" name="userPassword" id="userPassword" onChange={handlePassword} value={passwordValue} />
                        <label htmlFor="userPassword">Password</label>
                    </div>
                    <button type="submit" className="w-100 btn btn-lg submitBtn">Sign Up</button>
                    <Link className="signup-link" to="/login">Already have an account? Log in!</Link>
                </form>
            </div>
        )
    }else{
        return <Redirect to='/login'></Redirect>
    }
}

export default Register

