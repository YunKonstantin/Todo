import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { ChangePasswordForm } from "../components/forms/ChangePasswordForm";

const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="profile-page">
      <h1>Профиль</h1>

      {user ? (
        <div className="profile-info">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          {user.age && (
            <p>
              <strong>Возраст:</strong> {user.age}
            </p>
          )}
          {user.createdAt && (
            <p>
              <strong>Зарегистрирован:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString("ru-RU")}
            </p>
          )}
        </div>
      ) : (
        <p>Загрузка профиля...</p>
      )}

      <ChangePasswordForm />
    </div>
  );
};

export default ProfilePage;
