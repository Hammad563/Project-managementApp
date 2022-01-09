import react, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';



const Login = (props) => {

    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    const handleEmail = (e) => {
        setEmailValue(e.target.value)
    }
    const handlePassword = (e) => {
        setPasswordValue(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await fetch('/auth/login', {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userEmail: emailValue,
                userPassword: passwordValue
            })
        })
        const data = await response.json();
        if(data.loginStatus){
            console.log("sign in success");
            props.loginPressed();
        }else{
            console.log("not successfull login")
        }
    }

    if(!props.loggedIn){
        return(
            <div className='form-signin text-center '>
                {/* Header */}
                <Link to="/" style={{'textDecoration' : 'none'}}>
                    <h1 style={{'textDecoration' : 'none'}}>TaskNow</h1>
                    <div className="row justify-content-center mb-4">
                        <div>About OpTask</div>
                    </div>
                </Link>
                <h1 className="h3 mb-3">Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-floating">
                        <input type="email" className="form-control" placeholder="Email" name="userEmail" id="userEmail" onChange={handleEmail} value={emailValue}  />
                        <label htmlFor="userFullName">Full Name</label>
                    </div>
                    <div className="form-floating">
                        <input type="password" className="form-control" placeholder="Password" name="userPassword" id="userPassword" onChange={handlePassword} value={passwordValue}  />
                        <label htmlFor="userInst">Company/Organization</label>
                    </div>
                    <button type="submit" className="w-100 btn btn-lg submitBtn">Log In</button>
                    <Link className="signup-link" to="/register">Dont have an account? sign up</Link>
                </form>
            </div>
        )
    } else{
        <Redirect to='/dashboard'></Redirect>
    }

}

Login.propTypes = {
    loginPressed: PropTypes.func.isRequired,
    loggedIn: PropTypes.bool.isRequired
}

export default Login;