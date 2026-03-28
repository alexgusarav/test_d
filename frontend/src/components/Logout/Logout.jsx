import React, {useEffect, useState } from "react";
import { logout } from "../../apiService/requests";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logoutUser, clearAuthTokens } from "../../store/reducers/userReducer";
import Cookies from 'js-cookie'

function Logout({sendRequest, setSendRequest}) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null)
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await logout();
            const result = await response.json();

            if(!response.ok) {
                    setError(Object.values(result.error || result));
                    setIsLoading(false);
                    return
                }

		    dispatch(clearAuthTokens());
		    dispatch(logoutUser());
		    localStorage.removeItem('persist:root');
            Cookies.remove('sessionid');
            Cookies.remove('csrftoken');
            
            setIsLoading(false);
            setSendRequest(false);
        
            //отправляем пользователя в логины
            navigate('/login');
            } catch(err) {
                console.log(err);
                setError(["Произошла ошибка сети."])
        
            } finally {
                setIsLoading(false);
                if(sendRequest) {
                    setSendRequest(false);
                }
            }
        };
        if(sendRequest) {
        fetchData();
        }
    }, [sendRequest, dispatch, navigate, setSendRequest]);

       //если идет загрузка показываем спиннер или текст загрузка.
       if(isLoading) {
       return (
           <React.Fragment>
               <div style={{ padding: '10px', textAlign: 'center' }}>
                   <p>Разлогиниваюсь..</p>
               </div>
   
           </React.Fragment>
       );
               }
       if (error && error.length > 0) {
           return (
               <React.Fragment>
           <div style={{ color: 'red', border: '1px solid red', padding: '10px', margin: '10px 0' }}>
           <strong>Ошибка отключения:</strong>
           <ul>
             {error.map((msg, index) => (
               <li key={index}>{msg}</li>
             ))}
           </ul>
         </div>
         </React.Fragment>
           )
       }
}

export default Logout