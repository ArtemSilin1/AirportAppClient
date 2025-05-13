import React, { useState } from "react";

import hashPassword from "../internal/HashPassword";
import { DecodeJWT } from "../internal/DecodeJWT";

function BoardModal({ modal, setModal, flightData, isDeleteMode }) {
   const [formData, setFormData] = useState({
      status: "",
      password: "",
      confirmFlightNumber: "",
   })

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value })
   }

   const handleFlightUpdate = async (e) => {
      e.preventDefault()
      if (isDeleteMode && formData.confirmFlightNumber !== flightData.flightNumber) {
         setModal(false)
         alert("неверный номер рейса")
         return
      }

      let hashedPassword = hashPassword(formData.password)
      let decoded = DecodeJWT()
      let username = decoded.username

      const url = isDeleteMode ? "http://localhost:8081/board/deleteFlight" : "http://localhost:8081/board/updateBoardStatus"
      const method = isDeleteMode ? "DELETE" : "PUT"

      try {
         const response = await fetch(url, {
            method: method,
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               user: {
                  username: username,
                  password: String(hashedPassword),
               },
               board: {
                  id: flightData.id,
                  status: formData.status,
               },
            }),
         })

         if (!response.ok) {
            alert(response.message)
         }
         else if (response.status === 401) {
            alert("в доступе отказано")
         }
         else {
            setModal(false)
            window.location.reload()
            isDeleteMode ? alert("Удалено") : alert("Обновлено")
         }
      }
      catch(error) {
         setModal(false)
         alert('Ошибка при отправке формы')
      }
   }

   if (flightData != null) {
      return (
         <div className={`modal_background ${modal ? 'active' : ''}`} onClick={() => setModal(false)}>
            <div className="modal_container" onClick={(e) => e.stopPropagation()}>
               <div className="modal_header">
                  <span className="icon cross_icon" onClick={() => setModal(false)} />
               </div>
               <h3>{isDeleteMode ? 'Удалить' : 'Редактировать'} рейс номер {flightData.flightNumber}</h3>
   
               <form onSubmit={handleFlightUpdate} className="board_form">
                  {isDeleteMode ? 
                     <div className="board_form_container dir_column">
                        <label>Подтвердите номер рейса</label>
                        <input
                           name='confirmFlightNumber'
                           type="text"
                           className='auth_input'
                           value={formData.confirmFlightNumber}
                           onChange={handleChange}
                        />
                     </div>
                     :
                     <div className="board_form_container dir_column">
                        <label>Изменить статус</label>
                        <select
                           name='status'
                           className='auth_input auth_selector'
                           value={formData.status}
                           onChange={handleChange}
                        >
                           <option value="По расписанию">По расписанию</option>
                           <option value="Задержан">Задержан</option>
                           <option value="Отменён">Отменён</option>
                        </select>
                     </div>
                  }

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

                  <button>{isDeleteMode ? 'Удалить' : 'Изменить'}</button>
               </form>
            </div>
         </div>
      )
   }
   else {
      setModal(false)
   }
}

export default BoardModal;