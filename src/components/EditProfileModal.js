import { useState } from "react";
import { DecodeJWT } from "../internal/DecodeJWT";

function EditProfileModal({ modal, setModal }) {
   const [formData, setFormData] = useState({
      masterToken: "",
   })

   const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value })
   }

   const handleChangeRole = async (e) => {
      e.preventDefault()

      let decoded = DecodeJWT()
      let username = decoded.username

      try {
         const response = await fetch("http://localhost:8081/control/checkValidToken", {
            method: 'POST',
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               user: {
                  username: username,
               },
               token: {
                  masterToken: formData.masterToken,
               },
            }),
         })

         if (response.ok) {
            localStorage.setItem("air_port_token", response.token)
            setModal(false);
         } else if (!response.ok) {
            setModal(false)
            // alert("неверный токен")
            window.location.reload()
         }
      }
      catch(error) {
         alert("ошибка при отправке формы")
      }
   }

   return (
      <div className={`modal_background ${modal ? 'active' : ''}`} onClick={() => setModal(false)}>
         <div className="modal_container" onClick={(e) => e.stopPropagation()}>
            <div className="modal_header">
               <span className="icon cross_icon" onClick={() => setModal(false)} />
            </div>

            <h3>Введите код сотрудника. Он у мастер админа.</h3>

            <form className="board_form" onSubmit={handleChangeRole}>
               <div className="board_form_container dir_column">
                  <label>Код сотрудника</label>
                  <input
                     name='masterToken'
                     type="text"
                     className='auth_input'
                     value={formData.masterToken}
                     onChange={handleChange}
                  />
               </div>
               
               <button>Отправить</button>
            </form>
         </div>
      </div>
   )
}

export default EditProfileModal;