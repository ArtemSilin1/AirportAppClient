import React, { useState, useEffect } from "react";
import BoardModal from "../components/BoardPopup";

function Board({ isAdmin }) {
   const [boardTable, setBoardTable] = useState([])
   const [notFoundMessage, setNotFoundMessage] = useState(false)
   const [isEditMode, setIsEditMode] = useState(false)
   const [modal, setModal] = useState(false)
   const [flightToEdit, setFlightToEdit] = useState(null)

   function ChangeEditMode() {
      setIsEditMode(!isEditMode)
   }

   const handleFlightEdit = (item) => {
      if (isEditMode === false) return
      setFlightToEdit(item)
      setModal(true)
   }

   const getBoard = async () => {
      try {
         const response = await fetch("http://localhost:8081/board/getBoard", {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
            },
         });
         
         if (!response.ok) {
            alert(response.error)
         }
         else if (response.ok) {
            const data = await response.json()
            setBoardTable(data)
         }
         else if (response.status === 404) {
            setNotFoundMessage(true)
         }
      } catch (error) {
         alert(error);
      }
   };

   useEffect(() => {
      getBoard();
   }, []);

   return (
      <div className="board_container">
         <div className="space_between board_list_title">
            <p>РЕЙС</p>
            <p>НАЗНАЧЕНИЕ</p>
            <p>ДАТА И ВРЕМЯ ОТПРАВКИ</p>
            <p>СТАТУС</p>
         </div>
         <ul className="board_list">
            {boardTable.map((item) => (
               <li
                  key={item.Id}
                  className={`board_list_item space_between ${isEditMode ? 'can_edit' : ''}`}
                  onClick={() => handleFlightEdit(item)}
               >
                  <p>{item.flightNumber}</p>
                  <p>{item.appointment}</p>
                  <p>{item.departure.replace(/(:\d{2})$/, '')}</p>
                  <p>{item.status}</p>
                  
               </li>
            ))}
         </ul>

         {notFoundMessage ? <p>Рейсов пока нет</p> : null}

         <div className={`help_text centered ${isEditMode ? 'active' : ''}`}>
            <div className="help_text_header">
               <span className="icon edit_icon" />
            </div>
            <p>Режми редактирования.<br />Нажмите на рейс который хотите редактировать.</p>
         </div>

         {isAdmin ? 
            <div className="board_admin_panel">
               <button className="add_flight_admin_button">Новый рейс</button>
               <button className="add_flight_admin_button" onClick={() => ChangeEditMode()}>Редактировать</button>
               <button className="add_flight_admin_button">Удалить</button>
            </div>
            :
            null
         }

         <BoardModal
            setModal={setModal}
            modal={modal}
            flightData={flightToEdit}
         />
      </div>
   );
}

export default Board;
