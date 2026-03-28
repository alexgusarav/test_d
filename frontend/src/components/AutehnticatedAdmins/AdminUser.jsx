import React from "react";
import { useState } from "react";
import { updateAdminUsers, deleteAdminUsers } from "../../apiService/requests";
import { Link } from "react-router-dom";

function AdminUser({id, username, first_name, last_name, email, 
    countFiles, sizeFiles, isSuper, refreshUsers, handlerEdit }) {
const [isChecked, setIsChecked] = useState(isSuper);

const handlerChecked = async (event, user_obj) => {
    console.log('[AdminUser.jsx] set checkbox:', event.target.checked)
    setIsChecked(event.target.checked)
    const { id } = user_obj;
    const data = {
        'id': id,
        'is_superuser': event.target.checked,
    }
    try {
        const response = await updateAdminUsers(data, id)
           if (!response.ok) {
        throw new Error('Ошибка смены прав пользователя:');
      }
      refreshUsers();
    } catch (err) {
        console.log(err.message);
    }
}

const handlerDelete = async (id) => {
    if(id == 1) return  // заглушка от удаления администартора админ.
    if (!window.confirm(`Вы уверены что хотите удалить пользователя ${id}?`)) return;

    console.log('clicked delete:', id);
    const data = {
        'id': id
    }
    try{
       const response = await deleteAdminUsers(data, id)
        if (!response.ok) {
        throw new Error('Ошибка при удалении пользователя:');
      }
      refreshUsers();
    } catch (error) {
        console.log(error.message)
    }
}
    return(
        <React.Fragment>
            <tr key={id}>
            <td>{username}</td>
            <td>{first_name}</td>
            <td>{last_name}</td>
            <td>{email}</td>
            <td>
            <Link to={`/adminfiles/${id}`}>{countFiles}</Link>
            </td>
            <td>{sizeFiles > 0 ? (<span>{sizeFiles} Мб </span>) : (<span>0 Мб</span>) }</td>
            <td>
            {username == 'admin' ? (
            <input type="checkbox" checked disabled/>
            ) :
            (<input type="checkbox" checked={isChecked} onChange={(e) => handlerChecked(e, {id})}/>)
                }
            </td>
            <td>
            <button onClick={() => handlerEdit(id)}>Редактировать</button>  
            <button onClick={() => handlerDelete(id)}>Удалить</button>    
            </td>
        </tr>
        </React.Fragment>
    )
}
export default AdminUser;