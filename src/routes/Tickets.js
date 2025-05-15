import { useState, useEffect } from "react";
import RegisterTicket from "../components/RegisterTicket";
import { DecodeJWT } from "../internal/DecodeJWT";

function Tickets() {
   const [startData, setStartData] = useState([]);
   const [selectedLocation, setSelectedLocation] = useState({
      startLocation: "",
   });
   const [isButtonAvailable, setIsButtonAvailable] = useState([]);
   const [modal, setModal] = useState(false);

   const handleChange = (e) => {
      const { name, value } = e.target;
      setSelectedLocation(prev => ({ ...prev, [name]: value }));
   };

   const getAllStartsPoint = async () => {
      try {
         const response = await fetch("http://localhost:8081/board/getAllStartLocations");
         if (!response.ok) throw new Error('Ошибка сети');
         
         const data = await response.json()
         setStartData(data.routes)
      }  catch (error) {
         alert(error.message);
      }
   };

   useEffect(() => {
      getAllStartsPoint()
   }, [])

   useEffect(() => {
      setIsButtonAvailable(selectedLocation.startLocation !== "")
   }, [selectedLocation])

   function OpenTicketModal() {
      if (isButtonAvailable === false) return
      setModal(true)
   }

   const hanleCreateTicket = async (e) => {
      e.preventDefault()

      let decoded = DecodeJWT()
      try {
         const response = await fetch("http://localhost:8081/ticket/createUserTickets", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               user_id: Number(decoded.id),
               flight_id: Number(selectedLocation.startLocation),
            }),
         })

         if (response.ok) {
            alert("Билет куплен")
         } else {
            alert(response.error)
         }
      }
      catch (error) {
         alert("Ошибка при отправке формы")
      }
   }

   return (
      <div className="profile_container">
         <div className="buy_ticket_container">
           <div className="board_form buy_ticket">
               <form className="select_route_panel dir_column" onSubmit={hanleCreateTicket}>
                  <label>Выберите рейс</label>
                  <select
                    name="startLocation"
                    onChange={handleChange}
                    value={selectedLocation.startLocation}
                  >
                    <option value="">...</option>
                    {startData.map((startPoint, index) => (
                      <option key={startPoint.id} value={startPoint.id}>
                        {startPoint.appointment}
                      </option>
                    ))}
                  </select>

                  <button
                     className={`${isButtonAvailable ? 'active' : ''}`}
                     // onClick={OpenTicketModal}
                  >
                     Зарегистрироваться
                  </button>
               </form>
            </div>
         </div>

         <RegisterTicket
            modal={modal}
            setModal={setModal}
            appoint={selectedLocation.selectedLocation}
         />
      </div>
   );
}

export default Tickets;