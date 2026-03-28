import React, {useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";	
import { get_csrf_token, getAdminUserFiles } from "../../apiService/requests";
import CopyButton from "../AuthenticatedUsers/CopyButton";
import { HOST_URL } from "../../apiService/requests";
import { downloadFile, deleteAdminFile } from "../../apiService/requests";

function AdminUserFiles() {
    const { id, username } = useParams();   // получаем параметры из router.
    
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.user?.isAuthenticated);
    const sessionid = useSelector((state) => state.user?.sessionid);

    const [userfiles, setUserFiles] = useState([])
    //отправляем пользователя домой если не авторизован.
    useEffect(() => {
    if(!sessionid && !isAuthenticated) {
        navigate('/');
    return
    }
    },[sessionid, isAuthenticated, navigate])

    const fetchUserFiles = async () => {
        try {
          get_csrf_token();
          console.log('csrf')
          // Запрос списка пользователей к API
          const response = await getAdminUserFiles(id);
          if (!response.ok) {
            throw new Error('Ошибка при загрузке списка файлов');
          }
          const data = await response.json();
          console.log('[FileStorage.jsx] fetch files data:',data)
          setUserFiles(data); // Ожидается массив объектов файлов
        } catch (err) {
        } finally {
    
        }
      };
    
    useEffect(() => {
        fetchUserFiles(id);
      }, []);

    
    const handleNoramlizeDate = (somedate) => {
      if (!somedate) return '-'

  const date = new Date(somedate);
  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}).format(date);

  return formattedDate;
 }
 const handleDelete = async (id) => {
    try {
      // Запрос на удаление файла
      const response = await deleteAdminFile(id);

      if (!response.ok) {
        throw new Error('Ошибка при удалении файла');
      }
      // Обновление списка файлов после успешного удаления
      fetchUserFiles(id);
    } catch (err) {
      alert(err.message);
    }
  };

    return (
        <React.Fragment>
            <div>
                <h1>Управление файлами пользователя</h1>
                <h3>Список файлов пользователя {username}</h3>
        <>
        <table className="files_table" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Дата загрузки</th>
              <th>Дата скачивания</th>
              <th>Оригинальное имя</th>
              <th>Размер</th>
              <th>Описание</th>
              <th>Публичная ссылка</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {userfiles.map((file) => (
              <tr key={file.id}>
                <td>{file.id}</td>
                <td>{handleNoramlizeDate(file.uploaded_at)}</td>
                 <td>{handleNoramlizeDate(file.downloaded_at)}</td>
                <td>
 {/* Ссылка на скачивание файла */}
                  <a href="#" rel="noopener noreferrer" onClick={(e) => handleDownload(e, file.id, file.original_name)}>
                    {file.original_name}
                  </a>
                </td>
                <td>
                  { file.size > 0 ? (<span> {file.size} MB</span>) : ("0 МБ")}
                </td>
                <td>{file.description}</td>
                <td> 
                    <CopyButton linkToCopy={`${HOST_URL}/api/download/${file.secret_name}`}/>
                    {/* {file.secret_name} */}
                </td>
                <td>
                  <button onClick={() => {if (window.confirm(`Вы уверены, что хотите удалить файл ${file.original_name}`)) {  handleDelete(file.id)}}}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </>
            </div>
        </React.Fragment>
    )
};

export default AdminUserFiles