import { useState } from "react";

import hashPassword from "../internal/HashPassword";
import { DecodeJWT } from "../internal/DecodeJWT";

function GenerateTokenModal({ modal, setModal }) {
   const [formData, setFormData] = useState({
      confirmPassword: "",
   })

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value })
   }

   const handleCreateNewToken = async (e) => {
      e.preventDefault()

      let decoded = DecodeJWT()
      let hashedPassword = hashPassword(formData.confirmPassword)

      try {
         const response = await fetch("http://localhost:8081/control/generateToken", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               user: {
                  username: decoded.username,
                  password: String(hashedPassword),
               },
               token: {}
            }),
         })

         if (!response.ok) {
            alert(response.message)
            return
         }
         
         setModal(false)
         window.location.reload()
         alert("токен создан")
      }
      catch(error) {
         setModal(false)
         alert('Ошибка при отправке формы')
      }
   }

   return (
      <div className={`modal_background ${modal ? 'active' : ''}`} onClick={() => setModal(false)}>
         <div className="modal_container" onClick={(e) => e.stopPropagation()}>
            <div className="modal_header">
               <span className="icon cross_icon" onClick={() => setModal(false)} />
            </div>
            <h3>Генерация нового токена</h3>

         <form onSubmit={handleCreateNewToken} className="board_form">
            <div className="board_form_container dir_column">
               <label>Подтвердите пароль</label>
               <input
                  name='confirmPassword'
                  type="password"
                  className='auth_input'
                  value={formData.confirmPassword}
                  onChange={handleChange}
               />
            </div>
            <button>Сгенерировать</button>
         </form>
         </div>
      </div>
   )
}

export default GenerateTokenModal;