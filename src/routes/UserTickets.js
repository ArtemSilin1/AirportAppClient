import { useState, useEffect } from "react";
import { DecodeJWT } from "../internal/DecodeJWT";

function UserTickets() {
  const [userTickets, setUserTickets] = useState([]);
  const [haveNoTickets, setHaveNoTickets] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getUserTickets = async () => {
    let decoded = DecodeJWT();
    try {
      const response = await fetch("http://localhost:8081/ticket/getUserTickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: Number(decoded.id),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.rows && Array.isArray(data.rows)) {
          setUserTickets(data.rows || []);
          setHaveNoTickets(data.rows.length === 0);
        } else {
          console.error("Некорректный формат ответа:", data);
          setHaveNoTickets(true);
        }
      } else {
        alert(data.error || "Ошибка сервера");
      }
    } catch (error) {
      alert("Ошибка соединения");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserTickets();
  }, []);

  return (
    <div className="profile_container">
      <ul>
        {isLoading ? (
          <li>Загрузка билетов...</li>
        ) : haveNoTickets ? (
          <li>Билетов пока нет</li>
        ) : (
          (userTickets || []).map((ticket) => (
            <li className="ticket" key={`${ticket.flightId}-${ticket.seatNumber}`}>
               <h3>Билет</h3>
               <div className="space_between">
                  <p>Номер рейса: {ticket.flightId}</p>
                  <p>Место: {ticket.seatNumber}</p>
                  <p>Цена: {ticket.price} руб</p>

               </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default UserTickets;