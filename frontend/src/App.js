import {BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import "../node_modules/react-grid-layout/css/styles.css";
import "../node_modules/react-resizable/css/styles.css";
import { useEffect, useState } from 'react';
import './App.css';
import Landing from './components/landingPage/landing';
import Register from './components/register/register';
import Login from './components/login/login';
import Dashboard from './components/dashboard/dashboard';
import Project from './components/projectInfo/projectInfo';
import Profile from './components/profilePage/profile';
import UpdateProfile from './components/profilePage/updateProfile';


function App() {

  let [loggedIn, setLoggedIn] = useState(false);

  useEffect( () => {
    async function fetchData() {
      const response = await fetch("/auth/isLoggedIn", {
        method: "GET",
      })
      const result = await response.json();
      setLoggedIn(result.isLoggedIn);
    }
    fetchData();

  }, [])

  const logoutPressed = () => {
    setLoggedIn(false)
  }
  const LoginPressed = () => {
    setLoggedIn(true);
  }


  return (
   <Router>
     <Switch>
       <Route exact path="/register"><Register></Register></Route>
       <Route exact path="/dashboard">{loggedIn ? (<Dashboard logoutPressed={logoutPressed}></Dashboard>) : <Redirect to='/login'></Redirect>}</Route>
       <Route exact path="/projects/:projectId"> {loggedIn ? (<Project></Project>) : <Redirect to='/login'></Redirect>}</Route>
       <Route exact path="/login"> {!loggedIn ? (<Login loginPressed={LoginPressed}></Login>) : (<Redirect to='/dashboard'></Redirect>)} </Route>
       <Route exact path='/profile'>{loggedIn ? <Profile></Profile> : <Redirect to='/login'></Redirect>}</Route>
       <Route exact path='/profile/update'> {loggedIn ? <UpdateProfile></UpdateProfile> : <Redirect to='/login'></Redirect>}</Route>
       <Route exact path="/"><Landing></Landing></Route>
     </Switch>
   </Router>
  );
}

export default App;
