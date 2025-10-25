import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="notFound">
      <h1>404 страница не найдена :(</h1>
      <p>такой хуйни я не создавал (страницы не существуют)</p>
      <Link to="/">НА ГЛАВНУЮ</Link>
    </div>
  );
};
export default NotFoundPage;
