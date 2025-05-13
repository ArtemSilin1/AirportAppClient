import { useState } from "react";

import hashPassword from "../internal/HashPassword";
import { DecodeJWT } from "../internal/DecodeJWT";

function CreateBoardItemModal({ modal, setModal }) {
   const [formData, setFormData] = useState({
      password: "",
      flightNumber: "",
      startLocation: "",
      finalLocation: "",
      startDate: "",
      startTime: "",
   })

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value })
   }

   const validateForm = (data) => {
      const errors = {};
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

      if (!data.flightNumber.trim()) {
        errors.flightNumber = "Введите номер рейса";
      }

      if (!data.startDate) {
        errors.startDate = "Введите дату отправки";
      } else if (!dateRegex.test(data.startDate)) {
        errors.startDate = "Неверный формат даты (требуется ГГГГ-ММ-ДД)";
      } else {
        const date = new Date(data.startDate);
        if (isNaN(date.getTime())) {
          errors.startDate = "Некорректная дата";
        }
      }

      if (!data.startTime) {
        errors.startTime = "Введите время отправки";
      } else if (!timeRegex.test(data.startTime)) {
        errors.startTime = "Неверный формат времени (требуется ЧЧ:ММ)";
      }

      if (!data.password) {
        errors.password = "Введите пароль";
      } else if (data.password.length < 6) {
        errors.password = "Пароль должен быть не менее 6 символов";
      }

      return errors;
   };

   const handleSubmit = async (e) => {
      e.preventDefault()

      
      const validationErrors = validateForm(formData);
      
      if (Object.keys(validationErrors).length > 0) {
         alert(Object.values(validationErrors).join("\n"));
         return;
      }
      
      let hashedPassword = hashPassword(formData.password)
      let decoded = DecodeJWT()
      let username = decoded.username
      
      const appointment = formData.startLocation + " - " + formData.finalLocation
      const departure = formData.startDate + " " + formData.startTime + ":00"

      try {
         const response = await fetch("http://localhost:8081/board/createBoardItem", {
            method: 'POST',
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               user: {
                  username: username,
                  password: String(hashedPassword),
               },
               board: {
                  flightNumber: formData.flightNumber,
                  appointment: appointment,
                  departure: departure,
               },
            }),
         })

         if (!response.ok) {
            setModal(false)
            alert(response.error)
            return
         }
         setModal(false)
         window.location.reload()
         alert("Рейс создан")
         return
      }
      catch(error) {
         setModal(false)
         alert("Ошибка при отправке формы")
      }
   }

   return (
      <div className={`modal_background ${modal ? 'active' : ''}`} onClick={() => setModal(false)}>
         <div className="modal_container" onClick={(e) => e.stopPropagation()}>
            <div className="modal_header">
               <span className="icon cross_icon" onClick={() => setModal(false)} />
            </div>
            <h3>Создание рейса</h3>

            <form onSubmit={handleSubmit}>
               <div className="board_form_container dir_column">
                  <label>Введите номер рейса</label>
                  <input
                     name='flightNumber'
                     type="text"
                     className='auth_input'
                     value={formData.flightNumber}
                     onChange={handleChange}
                     placeholder="AA-123"
                  />
               </div>

               <div className="board_form_container dir_column">
                  <label>Введите откуда рейс вылетает</label>
                  <input
                     name='startLocation'
                     type="text"
                     className='auth_input'
                     value={formData.startLocation}
                     onChange={handleChange}
                  />
               </div>

               <div className="board_form_container dir_column">
                  <label>Введите куда рейс прилетит</label>
                  <input
                     name='finalLocation'
                     type="text"
                     className='auth_input'
                     value={formData.finalLocation}
                     onChange={handleChange}
                  />
               </div>

               <div className="board_form_container dir_column">
                  <label>Введите дату отправки</label>
                  <input
                     name='startDate'
                     type="text"
                     className='auth_input'
                     value={formData.startDate}
                     onChange={handleChange}
                     placeholder="ГГГГ-ММ-ДД"
                  />
               </div>

               <div className="board_form_container dir_column">
                  <label>Введите время отправки</label>
                  <input
                     name='startTime'
                     type="text"
                     className='auth_input'
                     value={formData.startTime}
                     onChange={handleChange}
                     placeholder="18:00"
                  />
               </div>

               <div className="board_form_container dir_column">
                  <label>Подтвердите пароль</label>
                  <input
                     name='password'
                     type="password"
                     className='auth_input'
                     value={formData.password}
                     onChange={handleChange}
                  />
               </div>

               <button>Создать</button>
            </form>
         </div>
      </div>
   )
}

export default CreateBoardItemModal;