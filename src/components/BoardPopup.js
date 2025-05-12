import React, { useState } from "react";

import hashPassword from "../internal/HashPassword";
import { DecodeJWT } from "../internal/DecodeJWT";

function BoardModal({ modal, setModal, flightData }) {
   const [formData, setFormData] = useState({
      status: "",
      password: ""
   })

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value })
   }

   const handleFlightUpdate = async (e) => {
      e.preventDefault()
      let hashedPassword = hashPassword(formData.password)
      let decoded = DecodeJWT()
      let username = decoded.username
      try {
         const response = await fetch("http://localhost:8081/board/updateBoardStatus", {
            method: "PUT",
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
            alert("Обновлено")
         }
      }
      catch(error) {
         setModal(false)
         alert(error)
      }
   }

   if (flightData != null) {
      return (
         <div className={`modal_background ${modal ? 'active' : ''}`} onClick={() => setModal(false)}>
            <div className="modal_container" onClick={(e) => e.stopPropagation()}>
               <div className="modal_header">
                  <span className="icon cross_icon" onClick={() => setModal(false)} />
               </div>
               <h3>Редактировать рейс номер {flightData.flightNumber}</h3>
   
               <form onSubmit={handleFlightUpdate} className="board_form">
                  <div className="board_form_container dir_column">
                     <label>Изменить статус</label>
                     <select
                        name='status'
                        className='auth_input'
                        value={formData.status}
                        onChange={handleChange}
                     >
                        <option value="По расписанию">По расписанию</option>
                        <option value="Задержан">Задержан</option>
                        <option value="Отменён">Отменён</option>
                     </select>
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

                  <button>Изменить</button>
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