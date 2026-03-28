import Cookies from 'js-cookie'
//registration request.
const HOST_URL = 'http://89.111.155.208:8000';

export function get_csrf_token() {
    return fetch(`${HOST_URL}/api/get-csrf/`)
}

console.log('[Requests.js] X-CSRFToken:', Cookies.get('csrftoken'))

const signUP = async (formData) => {
    const response = await fetch(HOST_URL + '/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify(formData),
        credentials: 'include',
    });
    return response
}

//user logout
const logout =  async () => {
    const response = await fetch(`${HOST_URL}/api/logout`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': Cookies.get('csrftoken'),
        cookie: `sessionid=${Cookies.get('sessionid')}`,
      },
    });
    return response;
  }

//user login
const signIN = async (formData) => {
    const response = await fetch(HOST_URL + '/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify(formData),
        credentials: 'include',
    });
    return response;
}

//get owner files.
const getFiles =  async () => {
    const response = await fetch(`${HOST_URL}/ownerfiles`, {
      method: 'GET',
      headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
      },
      cookie: `sessionid=${Cookies.get('sessionid')}`,
      credentials: 'include',
    });
    return response;
  }
  //delete owner file
  const deleteFile =  async (id) => {
    const response = await fetch(`${HOST_URL}/ownerfiles/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      cookie: `sessionid=${Cookies.get('sessionid')}`,
      credentials: 'include',
    });
    return response;
  }
  
  //upload file multipart formData.
  const uploadFile =  async (formData) => {
    console.log('[Request.js] formData:',formData)
    console.log('-CSRFToken', Cookies.get('csrftoken'))
    const response = await fetch(HOST_URL + '/ownerfiles/', {
          method: 'POST',
          headers: {
              'X-CSRFToken': Cookies.get('csrftoken'),
          },
          body: formData,
          cookie: `sessionid=${Cookies.get('sessionid')}`,
          credentials: 'include',
      });
      return response;
  }

  //download file
const downloadFile = async (fileID) => {
    console.log('[Request.js] try to download:',fileID)
    const response = await fetch(HOST_URL +`/api/download/${fileID}/`, {
      method: 'GET',
      headers: {
              'X-CSRFToken': Cookies.get('csrftoken'),
          },
      cookie: `sessionid=${Cookies.get('sessionid')}`,
      credentials: 'include',
    });
      return response;
  }

  //get information about file.
//get owner files.
const getFileInfo =  async (file_id) => {
    const response = await fetch(`${HOST_URL}/ownerfiles/${file_id}/`, {
      method: 'GET',
      headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
      },
      cookie: `sessionid=${Cookies.get('sessionid')}`,
      credentials: 'include',
    });
    return response;
  }
  
  const editFile = async(updatedData, file_id) => {
      console.log("[Requsts.js] Data for update:", updatedData)
      const response = await fetch(`${HOST_URL}/ownerfiles/${file_id}/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      cookie: `sessionid=${Cookies.get('sessionid')}`,
      credentials: 'include',
      body: JSON.stringify(updatedData)
  
    });
    return response;
  }

  //Administrators queries.
const getAdminUsers =  async () => {
    const response = await fetch(`${HOST_URL}/adminusers`, {
      method: 'GET',
      headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
      },
      cookie: `sessionid=${Cookies.get('sessionid')}`,
      credentials: 'include',
    });
    return response;
  }

//update
const updateAdminUsers = async(data, user_id) => {
    console.log("[Requsts.js] Data for update:", data)
    const response = await fetch(`${HOST_URL}/adminusers/${user_id}/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken'),
    },
    cookie: `sessionid=${Cookies.get('sessionid')}`,
    credentials: 'include',
    body: JSON.stringify(data)
  });
  return response;
}

//delete user.
const deleteAdminUsers =  async (data, id) => {
    const response = await fetch(`${HOST_URL}/adminusers/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      cookie: `sessionid=${Cookies.get('sessionid')}`,
      credentials: 'include',
      body: JSON.stringify(data)
    });
    return response;
  }

//user info
const getAdminUserInfo =  async (user_id) => {
    const response = await fetch(`${HOST_URL}/adminusers/${user_id}/`, {
      method: 'GET',
      headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
      },
      cookie: `sessionid=${Cookies.get('sessionid')}`,
      credentials: 'include',
    });
    return response;
  }
  
//user registration
const createAdminUser = async (userData) => {
    const response = await fetch(HOST_URL + '/adminusers/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify(userData),
        credentials: 'include',
    });
    return response
}

//получаем список файлов пользователя.
const getAdminUserFiles =  async (user_id) => {
    const response = await fetch(`${HOST_URL}/adminfiles/${user_id}`, {
      method: 'GET',
      headers: {
          'X-CSRFToken': Cookies.get('csrftoken'),
      },
      cookie: `sessionid=${Cookies.get('sessionid')}`,
      credentials: 'include',
    });
    return response;
  }
//delete file by admin
const deleteAdminFile =  async (id) => {
    const response = await fetch(`${HOST_URL}/adminfiles/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      cookie: `sessionid=${Cookies.get('sessionid')}`,
      credentials: 'include',
    });
    return response;
  }

  
export { signUP, logout, signIN }
export { getFiles, deleteFile, uploadFile, downloadFile }
export { getFileInfo, editFile }
export { HOST_URL, getAdminUserInfo, createAdminUser }
export {getAdminUsers, updateAdminUsers, deleteAdminUsers, getAdminUserFiles, deleteAdminFile}