import { useEffect, useState } from "react";
import GenerateTokenModal from "../components/GenerateToken";

function AdminPanel() {
  const [modal, setModal] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [noTokens, setNoTokens] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getAllTokens = async () => {
      try {
        const response = await fetch('http://localhost:8081/control/getTokens');
        
         if (response.ok) {
            const data = await response.json();
            if (data === null) return
            if (data.length === 0) {
              setNoTokens(true);
              setTokens([]);
            } else {
              setNoTokens(false);
              setTokens(data);
            }
         }  else if (response.status === 404) {
            setNoTokens(true);
            setTokens([]);
         }  else {
            throw new Error(`Ошибка HTTP: ${response.status}`);
         }
      } catch (error) {
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
  }

  useEffect(() => {
    getAllTokens();
  }, []);

  return (
    <div className="profile_container admin_panel_container">
      <div className="active_tokens_container admin_panel_container_item">
        <h3>Активные токены</h3>
        {isLoading ? (
          <p>Загрузка...</p>
        ) : noTokens ? (
          <p>Токенов нет</p>
        ) : (
          <ul 
            className="active_tokens_list" 
            style={{ maxHeight: '400px', overflowY: 'auto' }}
          >
            {tokens.map((token, index) => (
              <li key={index} className="active_tokens_item">
                <p>{token}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="active_tokens_control_container admin_panel_container_item">
        <button 
          className="generate_new_token" 
          onClick={() => setModal(true)}
        >
          Сгенерировать новый токен
        </button>
      </div>

      <GenerateTokenModal
        setModal={setModal}
        modal={modal}
        onTokenGenerated={getAllTokens}
      />
    </div>
  );
}

export default AdminPanel;