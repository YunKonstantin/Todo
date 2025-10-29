import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="notFound">
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "red",
        }}
      >
        404
      </h1>
      <h2 className="notFound_twoText">страница не найдена :(</h2>
      <p
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Такой страницы не существует
      </p>
      <Link
        to="/"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "grey",
        }}
      >
        На Главную
      </Link>
    </div>
  );
};
export default NotFoundPage;
