const validateLogin = (username) => {
    const regex = /^[a-zA-Z[0-9]{4,20}/g;
    if(!regex.test(username)) {
        return {
            status: false,
            message: 'Пользователь может быть из букв и цифр длиной от 4 до 20 символов.'
            }
    }
    return true;
}
export {validateLogin}