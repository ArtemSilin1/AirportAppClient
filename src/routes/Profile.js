import React, { useState } from "react";
import { DecodeJWT } from "../internal/DecodeJWT";
import { Link } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";

function Profile() {
   const [modal, setModal] = useState(false)

   const decodedJWT = DecodeJWT()

   return (
      <div className="profile_container">
         <div className="profile_container_header space_between">
            <h2>Здравствуйте, {decodedJWT.name}</h2>
            {decodedJWT.role === true ? 
               null
               :
               <button onClick={() => setModal(true)}>Я сотрудник</button>
            }
         </div>

         <div className="profile_container_content">
            <div>
               <p>Логин</p>
               <p className="profile_container_content_item centered">{decodedJWT.username}</p>
            </div>
            <div>
               <p>Имя</p>
               <p className="profile_container_content_item centered">{decodedJWT.name}</p>
            </div>
            <div>
               <p>Роль</p>
               <p className="profile_container_content_item centered">{decodedJWT.role ? 'Сотрудник' : 'Пользователь'}</p>
            </div>
            <div>
               <p>Почта</p>
               <p className="profile_container_content_item centered">{decodedJWT.email}</p>
            </div>
         </div>

         <Link to='/tickets' className="nav_bar_item active">Мои билеты</Link>

         <EditProfileModal modal={modal} setModal={setModal} />
      </div>
   )
}

export default Profile;