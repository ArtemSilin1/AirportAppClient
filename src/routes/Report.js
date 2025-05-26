import { useState } from "react";
import { DecodeJWT } from "../internal/DecodeJWT";
import hashPassword from "../internal/HashPassword";

function Report() {
    const [formData, setFormData] = useState({
        interval: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const sendReportData = async (e) => {
        e.preventDefault();

        let decoded = DecodeJWT();
        let hashedPassword = hashPassword(formData.password);

        try {
            const response = await fetch('http://localhost:8081/report/generateReport', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    interval: Number(formData.interval),
                    user_id: Number(decoded.id),
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || errorData.error || "Ошибка сервера");
            }

            const blob = await response.blob();
            
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `report_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            alert("Отчёт успешно скачан");
        } catch (error) {
            alert(error.message || "Ошибка при отправке формы");
        }
    };

    return (
        <div className="profile_container admin_panel_container">
            <form className="select_route_panel dir_column" onSubmit={sendReportData}>
                <h2>Отчёт</h2>

                <select
                    name="interval"
                    onChange={handleChange}
                    value={formData.interval}
                    required
                >
                    <option value="">Выберите промежуток времени</option>
                    <option value="1">Неделя</option>
                    <option value="2">Месяц</option>
                    <option value="3">Год</option>
                </select>

                <button
                    type="submit"
                    className="generate_report_button"
                >
                    Сгенерировать отчёт
                </button>
            </form>
        </div>
    );
}

export default Report;