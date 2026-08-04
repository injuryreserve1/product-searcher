import { useNavigate } from "react-router-dom";
const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>404 - Страница не найдена</h1>
      <p>Похоже, вы ошиблись в адресе</p>
      <button onClick={() => navigate("/login")}>Вернуться в чат</button>
    </div>
  );
};

export default NotFoundPage;
