import {useEffect ,useRef, useState} from 'react';
import PropTypes from "prop-types";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/core/styles";
import {Link, useParams} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  }));


function SearchResultsPage(props) {
    let loggedIn = useRef(null);

    const [isLoggedIn, setIsLoggedIn] = useState(loggedIn);
    const [loggedInUserInfo, setLoggedInUserInfo] = useState({});
    const [userProjects, setUserProjects] = useState([])
    const [projectCount, setProjectCount] = useState(0);
    const {query} = useParams();
    const [databaseQueried, setDatabaseQueried] = useState(false);
    const [page, setPage] = useState(1);

    const classes = useStyles();
    const handlePagination = (e,value) => {
        setUserProjects([]);
        setPage(value);
    }

    useEffect( () => {
        async function checkLoggedIn(){
            const response  = await fetch('/auth/isLoggedIn', {
                method: 'GET'
            })
            const result = await response.json();
            setLoggedInUserInfo(result.user);
            setIsLoggedIn(result.current);
        }
        checkLoggedIn();
    },[]);

    // get users project count
    useEffect( () => {
        async function getProjectCount(){
            
        }
    })



}