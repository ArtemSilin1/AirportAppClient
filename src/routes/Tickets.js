import { useState, useEffect } from "react";
import RegisterTicket from "../components/RegisterTicket";
import { DecodeJWT } from "../internal/DecodeJWT";

function Tickets() {
  const [startData, setStartData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({
    startLocation: "",
  });
  const [isButtonAvailable, setIsButtonAvailable] = useState(false);
  const [modal, setModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedLocation((prev) => ({ ...prev, [name]: value }));
  };

  const getAllStartsPoint = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/board/getAllStartLocations"
      );
      if (!response.ok) throw new Error("Ошибка сети");

      const data = await response.json();
      setStartData(data.routes || []);
    } catch (error) {
      alert(error.message);
      setStartData([])
    }
  };

  useEffect(() => {
    getAllStartsPoint();
  }, []);

  useEffect(() => {
    setIsButtonAvailable(selectedLocation.startLocation !== "");
  }, [selectedLocation]);

  const hanleCreateTicket = async (e) => {
    e.preventDefault();

    
    let decoded = DecodeJWT();
    console.log(decoded.id, selectedLocation.startLocation)
    try {
      const response = await fetch(
        "http://localhost:8081/ticket/createUserTickets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: Number(decoded.id),
            flight_id: Number(selectedLocation.startLocation),
          }),
        }
      );

      if (response.ok) {
        alert("Билет куплен");
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Произошла ошибка");
      }
    } catch (error) {
      alert("Ошибка при отправке формы");
    }
  };

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
              {startData?.map((startPoint) => (
                <option key={startPoint.id} value={startPoint.id}>
                  {startPoint.appointment}
                </option>
              ))}
            </select>

            <button
              className={isButtonAvailable ? "active" : ""}
              disabled={!isButtonAvailable}
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