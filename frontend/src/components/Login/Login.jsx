
import React, { useState } from "react";
import LoginHandler from "./LoginHandler";
import { validateLogin } from "../Validators/valdiateLogin";
import { validatePassword } from "../Validators/valdiatePassword";

function Login() {
  const [errLogin, setErrorLogin] = useState(null);
  const [errPassword, setErrorPassword] = useState(null);
    const [formData, setFormData] = useState({
      username: '',
      password: '',
    });

    //данный стейт используем для useEffect в RegistrationComponent
    const [sendRequest, setSendRequest] = useState(false)
  
    const handlerChange = (e) => {
      //записываем в состояние данные формы.
      setErrorLogin(false)
      setErrorPassword(false)
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  
    const handlerSubmit = (e) => {
      e.preventDefault();
      const username = e.target["username"].value;
      const password = e.target["password"].value;
      const isValidLogin = validateLogin(username)
      const isValidPass = validatePassword(password)

      if(isValidLogin.status == false) {
        setErrorLogin(isValidLogin.message);
        return
      }
      if(isValidPass.status == false) {
        setErrorPassword([isValidPass.message]);
        return     
      }
      
      console.log('send username:', password)
      console.log('isValid:',isValidPass)
      //вызываем useEffect в RegisterComponent.
      setSendRequest(true)
    }

    return (
        <React.Fragment>
    <div>
      <h1>Login to Your Account</h1>
      <form onSubmit={handlerSubmit}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="login_username" name="username" value={formData.username} onChange={handlerChange} required/>
        <br />
        {errLogin}
        <label htmlFor="password">Password:</label>
        <input type="password"  id="login_password" name="password" value={formData.password} onChange={handlerChange} required/>
        <br />
        { errPassword ? errPassword.map((a) => <span key={errPassword.indexOf(a)}>{ a }</span>) : null }
        {/* {errPassword} */}
        <button type="submit">Login</button>
      </form>
    </div>
        {/* {передаем данные формы и триггер в компонент обработчик RegisterHandler  } */}
    <LoginHandler formData={formData} sendRequest={sendRequest}
    setSendRequest={setSendRequest}>
    </LoginHandler>
        </React.Fragment>
    )
}

export default Login;