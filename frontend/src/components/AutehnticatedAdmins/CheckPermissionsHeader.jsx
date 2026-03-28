import React from "react";
import {useEffect} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function CheckPermissionHeader({handlerCreateUser}) {
//получаем данные из redux.
const navigate = useNavigate();
const userData = useSelector((state) => state.user?.userData);
const isAuthenticated = useSelector((state) => state.user?.isAuthenticated);
const isAdmin = useSelector((state) => state.user?.isAdmin);
const sessionid = useSelector((state) => state.user?.sessionid);

//если пользователь не аутентифицирован или данные в redux отсутствуют.
   useEffect(() => {
    if(!isAdmin && !sessionid && !isAuthenticated || !userData) {
        navigate('/');
    return
    }
    },[sessionid, isAuthenticated, navigate, isAdmin, userData])
    return (
   <React.Fragment>
        <div>
        <button onClick={handlerCreateUser} style={{marginBottom:10}}>Новый пользователь</button>
        </div>
</React.Fragment>
    )
}
export default CheckPermissionHeader;