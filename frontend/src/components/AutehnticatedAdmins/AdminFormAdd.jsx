import React from "react";

const AdminFormAdd = ({isOpenNewUser, onCloseNewUser, onSaveNewUser}) => {
    if (!isOpenNewUser) return null;

    return (
        <React.Fragment>
<div className="modal-overlay">
      <div className="modal-content">
        <h2>Добавление пользователя</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const dataObject = Object.fromEntries(formData.entries());
          // Обновленные данные возвращаем в onSaveNewUser handler.
          onSaveNewUser(dataObject);
        }}>
           <label>Логин:</label>
          <input className="edit_form_textarea" type="text" name="username"></input>
           <label>Пароль:</label>
          <input className="edit_form_textarea" type="text" name="password"></input>   
          <label>Имя:</label>
          <input className="edit_form_textarea" type="text" name="first_name"></input>        
          <label>Фамилия:</label>
           <input className="edit_form_textarea" type="text" name="last_name"></input> 
          <label>Email:</label>
           <input className="edit_form_textarea" type="text" name="email"></input>
     
          <div className="modal-actions">
            <button type="button" onClick={onCloseNewUser}>Отмена</button>
            <button type="submit">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
</React.Fragment>    
);
};
export default AdminFormAdd