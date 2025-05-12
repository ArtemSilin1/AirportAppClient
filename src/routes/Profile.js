import React, { useState, useEffect } from "react";
import { DecodeJWT } from "../internal/DecodeJWT";
import { Link } from "react-router-dom";
import EditProfileModal from "../components/EditProfileModal";

function Profile() {
   const [currentDate, setCurrentDate] = useState('')
   const [currentTime, setCurrentTime] = useState('')
   const [modal, setModal] = useState(false)

   const decodedJWT = DecodeJWT()

   useEffect(() => {
      const updateDateTime = () => {
      const now = new Date()
       
      // Форматирование даты
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      const day = String(now.getDate()).padStart(2, '0')
      setCurrentDate(`${year}-${month}-${day}`)
      
      // Форматирование времени
      const hours = String(now.getHours()).padStart(2, '0')
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const seconds = String(now.getSeconds()).padStart(2, '0')
      setCurrentTime(`${hours}:${minutes}:${seconds}`)
     }

     updateDateTime();
     const intervalId = setInterval(updateDateTime, 1000);
     
     return () => clearInterval(intervalId)
   }, []);

   return (
      <div className="profile_container">
         <div className="profile_container_header space_between">
            <h2>Здравствуйте, {decodedJWT.name}</h2>
            <button onClick={() => setModal(true)}>Изменить</button>
         </div>

         <div className="profile_clock">
            <p>
               {currentDate}
            </p>
            <p>
               {currentTime}
            </p>
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