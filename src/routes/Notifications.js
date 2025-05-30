import { useState, useEffect } from "react";
import { DecodeJWT } from "../internal/DecodeJWT";

function Notifications() {
    const [notificationsData, setNotificationsData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const getAllNofifications = async () => {
        let decoded;
        try {
            decoded = DecodeJWT();
        } catch (jwtError) {
            setError("Ошибка авторизации");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:8081/user/get_user_notifications", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: Number(decoded.id),
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const notifications = data.notifications || [];
                    
            if (!Array.isArray(notifications)) {
                throw new Error("Некорректный формат данных уведомлений");
            }
            
            setNotificationsData(notifications);
        } catch (error) {
            setError(error.message || "Ошибка при получении уведомлений");
            setNotificationsData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getAllNofifications();
    }, []);

    return (
        <div className="notifications">
            <div className="profile_container">
                <h2>Уведомления</h2>

                {isLoading ? (
                    <div className="loading">Загрузка уведомлений...</div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : (
                    <ul className="notifications_list">
                        {notificationsData.map((notification, index) => (
                            <li key={index} className="notifications_list_item">
                                {notification.SeatNumber || `Уведомление ${index + 1}`}
                                {notification.Date && (
                                    <span className="notification-time">
                                        {new Date(notification.Date).toLocaleString()}
                                    </span>
                                )}
                            </li>
                        ))}
                        {notificationsData.length === 0 && (
                            <li className="notifications_list_item">Уведомлений нет</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Notifications;