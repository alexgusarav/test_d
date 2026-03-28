import React, { useState, useEffect } from "react";
import CheckPermissionHeader from "./CheckPermissionsHeader";
import { get_csrf_token, getAdminUsers, getAdminUserInfo } from "../../apiService/requests";
import AdminUser from "./AdminUser";
import AdminFormEdit from "./AdminFormEdit";
import AdminFormAdd from "./AdminFormAdd";
import { updateAdminUsers, createAdminUser } from "../../apiService/requests";

function AdminUserList(){

//состояния редактирования пользователя.
const [isModalOpen, setisModalOpen] = useState(null)
const [editData, setEditData] = useState(null);

//состояния добавления нового пользователя.
const [isModalOpenNewUser, setisModalOpenNewUser] = useState(null);
const [NewUserData, setNewUserData] = useState(null);

const [users, setUsers] = useState([])
    
const fetchUsers = async () => {
    try {
    //   setLoading(true);
      get_csrf_token();
      // Запрос списка пользователей к API
      const response = await getAdminUsers();
      if (!response.ok) {
        throw new Error('Ошибка при загрузке списка файлов');
      }
      const data = await response.json();
      console.log('[FileStorage.jsx] fetch files data:',data)
      setUsers(data); // Ожидается массив объектов файлов
    } catch (err) {

    } finally {

    }
  };

useEffect(() => {
    fetchUsers();
  }, []);



    //helper для обновления данных.
const refreshUsers = () => queryClient.invalidateQueries(['users']);

//обработчик при редактировании пользователя.

const handlerEdit = async (user_id) => {
    //логика при редактировании файла.
    const response = await getAdminUserInfo(user_id);
    const data = await response.json();
    console.log('[AdminUsersList.jsx] getAdminUserInfo response:',data)
    setEditData(data);
    setisModalOpen(true);
    console.log(response);
  }

const onClose = () => {
    //при закрытии модального окна меняем состояния.
    setisModalOpen(false);
    setEditData(null)
  }

    const onSave = async (updatedData, user_id) => {
    //логика обновления при редактировании.
    console.log('[AdminUsersList.jsx] data for editUser:', updatedData)
    try {
    const response = await updateAdminUsers(updatedData, user_id);
    if(response.ok) {
      console.log("Данные успешно обновлены!");
      //закрываем модальное окно и перезагружаем файлы.
      onClose();
      refreshUsers();
    } else {
      console.log("Ошибка при сохранении файла.")
    }
  } catch (error) {
    console.error("Ошибка:", error.message);
    }
}

const handlerCreateUser = () => {
    setisModalOpenNewUser(true)
}

const onCloseNewUser = () => {
    //при закрытии модального окна меняем состояния.
    setisModalOpenNewUser(false);
    setNewUserData(null)
}

const onSaveNewUser = async (userData) => {
    //логика обновления при редактировании.
    try {
    const response = await createAdminUser(userData);
    if(response.ok) {
      console.log("Данные успешно обновлены!");
      //закрываем модальное окно и перезагружаем файлы.
      onCloseNewUser();
      refreshUsers();
    } else {
      console.log("Ошибка при добавлении пользователя.")
    }
  } catch (error) {
    console.error("Ошибка:", error.message);
    }
}

//рендерим файлы пользователя.
const handlerFiles = (username, user_id) => {
    const userData = {
        'username':username,
        'user_id':user_id
    }
    console.log('Try to render files:', userData)

}



    return (
        <React.Fragment>
            <div>

                {/* Компонент модального окна добавления нового пользователя.. */}
      <AdminFormAdd isOpenNewUser={isModalOpenNewUser} onCloseNewUser={onCloseNewUser} onSaveNewUser={onSaveNewUser} />

                {/* Компонент модального окна редактирования. */}
      <AdminFormEdit isOpen={isModalOpen} data={editData} onClose={onClose} onSave={onSave} />
                <h1>Управление пользователями</h1>
                <CheckPermissionHeader handlerCreateUser={handlerCreateUser} />
                <h2>Список Пользователей</h2>
    <>
        <table className="files_table" border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Пользователь</th>
          <th>Имя</th>
          <th>Фамилия</th>
          <th>Email</th>
          <th>Количество файлов</th>
          <th>Размер</th>
          <th>Администратор</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {/* mapping fetchdata response here */}
        {users.map((user) => (
        <AdminUser
        key={user.id}
        id={user.id}
        username={user.username}
        first_name={user.first_name}
        last_name= {user.last_name}
        email={user.email}
        countFiles={user?.count}
        sizeFiles={user?.size}
        isSuper={user.is_superuser}
        refreshUsers={refreshUsers}
        handlerEdit={handlerEdit}
        handlerFiles={handlerFiles}
        />
        ))}
    </tbody>
    </table>
          </>
    </div>
    </React.Fragment>
)
}
export default AdminUserList