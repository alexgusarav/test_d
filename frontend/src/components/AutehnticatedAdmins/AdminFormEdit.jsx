import React from "react";

const AdminFormEdit = ({data, isOpen, onClose, onSave}) => {
    if (!isOpen || !data) return null;

    return (
        <React.Fragment>
<div className="modal-overlay">
      <div className="modal-content">
        <h2>Редактировать пользователя</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const dataObject = Object.fromEntries(formData.entries());
          // Обновленные данные возвращаем в onSave handler.
          onSave(dataObject, data.id);
        }}>
           <label>Логин:</label>
          <input className="edit_form_textarea" type="text" name="username" defaultValue={data.username}></input>  
          <label>Имя:</label>
          <input className="edit_form_textarea" type="text" name="first_name" defaultValue={data.first_name}></input>        
          <label>Описание:</label>
           <input className="edit_form_textarea" type="text" name="last_name" defaultValue={data.last_name}></input> 
          <label>Email:</label>
           <input className="edit_form_textarea" type="text" name="email" defaultValue={data.email}></input>
           <input type="hidden" name="id" defaultValue={data.id}></input>  
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
</React.Fragment>    
);
};
export default AdminFormEdit