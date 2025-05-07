import React, { useState } from "react";

import hashPassword from '../internal/HashPassword';

function Auth() {
   const [isLogin, setIsLogin] = useState(false)
   const [formData, setFormData] = useState({
      username: "",
      name: "",
      password: "",
      email: "",
      userRole: "",
      confirmPassword: ""
   })

   const validateForm = () => {
      const { name, password } = formData;

      if (!isLogin) {
         if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(name)) {
            return 'Имя должно содержать только буквы.';
         }
         if (password.length < 6) {
            return 'Пароль должен содержать более 6 символов.';
         }
      } else {
         if (password.length < 6) {
            return 'Пароль должен содержать более 6 символов.';
         }
      }
      return '';
   }

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value })
   }

   const handleSubmit = async (e) => {
      e.preventDefault();
      const validationError = validateForm()
      if (validationError) {
         alert(validationError)
      } else {
         if (!isLogin && formData.password !== formData.confirmPassword) {
            alert("пароли не совпадают")
            return
         }
         const url = isLogin ? "http://localhost:8081/users/login" : "http://localhost:8081/users/registration";

         let hashedPassword = hashPassword(formData.password)

         try {
            const response = await fetch(url, {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({
                  username: formData.username,
                  name: formData.name,
                  password: String(hashedPassword),
                  email: formData.email,

               }),
            })

            const data = await response.json();
            if (response.ok) {
               localStorage.setItem("air_port_token", data.token)
               window.location.reload()
            } else {
               alert(data.message)
            }
         } catch (error) {
            alert('Ошибка при отправке формы', false)
         }
      }
   }

   return (
      <div className="auth_background">
         <div className="auth_container">
            <h2>{isLogin ? 'Войдите в аккаунт' : 'Зарегистрируйтесь'}</h2>
            
            <form onSubmit={handleSubmit}>
               <div className="form_input_container dir_column">
                  <label>Введите логин</label>
                  <input
                     className="auth_input"
                     name="username"
                     type="text"
                     value={formData.username}
                     onChange={handleChange}
                     required
                  />
               </div>

               {!isLogin && (
                  <div className="form_input_container dir_column">
                     <label>Введите имя</label>
                     <input
                        className="auth_input"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                     />
                  </div>
               )}

               {!isLogin && (
                  <div className="form_input_container dir_column">
                     <label>Введите электронную почту</label>
                     <input
                        className="auth_input"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                     />
                  </div>
               )}

               <div className="form_input_container dir_column">
                  <label>Введите пароль</label>
                  <input
                     className="auth_input"
                     name="password"
                     type="password"
                     value={formData.password}
                     onChange={handleChange}
                     required
                  />
               </div>

               {!isLogin && (
                  <div className="form_input_container dir_column">
                     <label>Подтвердите пароль</label>
                     <input
                        className="auth_input"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                     />
                  </div>
               )}

               {!isLogin && (
                  <div className="form_input_container dir_column">
                     <legend>Выберите роль</legend>
                        <select
                           name='userRole'
                           className='auth_input'
                           value={formData.userRole}
                           onChange={handleChange}
                        >
                           <option value={false}>Пользователь</option>
                           <option value={true}>Сотрудник</option>
                        </select>
                  </div>
               )}

               <button type="submit" className="auth_button">
                  {isLogin ? 'Войти' : 'Зарегистрироваться'}
               </button>
            </form>

            <p className="change_auth" onClick={() => setIsLogin(!isLogin)}>
               {isLogin ? 'Нет аккаунта? Зарегистрируйтесь!' : 'Уже есть аккаунт? Войдите!'}
            </p>
         </div>
      </div>
   )
}

export default Auth;