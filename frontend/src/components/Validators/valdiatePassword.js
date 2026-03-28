const validatePassword = (password) => {
  const numberPattern = /\d/;
  const specialLettersPattern = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;

  if(!password || password.trim().length === 0) {
    return {
        'status': false,
        'message' : 'Пароль не может быть пустым.'
    };
  }

  if (password.length < 6) {
    return {
        'status': false, 
        'message': 'Длинна пароля должна быть больше 6 символов'};
  }

  if (password === password.toLowerCase()) {
    return {
        'status': false, 
        'message': 'Пароль должен содержать заглавные буквы'};
  }

  if (!numberPattern.test(password)) {
    return {
        'status': false, 
        'message': 'Пароль должен содержать цифры'};
  }

  if (!specialLettersPattern.test(password)) {
    return {
        'status': false, 
        'message': 'Пароль должен содержать спецсимволы'};
  }
return { status: true };

};
export { validatePassword }