import React, {useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser, syncAuthTokens, setCsrfToken } from "../../store/reducers/userReducer";
import Cookies from 'js-cookie'
import { signIN } from "../../apiService/requests";

function LoginHandler({formData, sendRequest, setSendRequest}) {
        const [isLoading, setIsLoading] = useState(false);
        const [error, setError] = useState(null)
        const navigate = useNavigate();
        const dispatch = useDispatch();

            useEffect(() => {
                const fetchData = async () => {
                    setIsLoading(true);
                    try {
                        
                        //обьект ответа от django получаем в json.
                        const response = await signIN(formData);
                        const result = await response.json();
                        if(!response.ok) {
                            setError(Object.values(result.error || result));
                            setIsLoading(false);
                            return 
                        }
                        //если ответ успешный сохраняем data/sessinid/csrftoken в redux.
                        const csrftoken = Cookies.get('csrftoken')
                        dispatch(setUser(result.data));
                        dispatch(setCsrfToken(csrftoken));
                        console.log('[LoginHandler.jsx] sessionid:', Cookies.get('sessionid'))
                        console.log('[LoginHandler.jsx] csrftoken:', Cookies.get('csrftoken'));
                        dispatch(syncAuthTokens());
                        dispatch(setCsrfToken(csrftoken));
        
                        setIsLoading(false);
                        setSendRequest(false);
                        //отправляем пользователя а файлы.
                        navigate('/files');
                    }
                    catch(err) {
                        console.log(err);
                        setError(["Произошла ошибка сети."])
                
                    } finally {
                        setIsLoading(false);
                        //сбрасываем триггер в false.
                        if(sendRequest) {
                            setSendRequest(false);
                        }
                    }
                };
        
                if(sendRequest) {
                    fetchData();
                }
            }, [sendRequest, dispatch, formData, navigate, setSendRequest]);

                //если идет загрузка показываем спиннер или текст загрузка.
                if(isLoading) {
                return (
                    <React.Fragment>
                        <div style={{ padding: '10px', textAlign: 'center' }}>
                            <p>Вхожу в систему...</p>
                        </div>
            
                    </React.Fragment>
                );
                        }
                if (error && error.length > 0) {
                    return (
                        <React.Fragment>
                    <div style={{ color: 'red', border: '1px solid red', padding: '10px', margin: '10px 0' }}>
                    <strong>Ошибка входа.:</strong>
                    
                      <p>{error}</p>
                  
                  </div>
                  </React.Fragment>
                    )
                }
}
export default LoginHandler;