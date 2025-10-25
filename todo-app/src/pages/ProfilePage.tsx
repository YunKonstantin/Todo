import type { RootState } from "../store";
import { useSelector } from "react-redux";

const ProfilePage = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <div className="profile-page">
      <h1>Профиль</h1>
      {user ? (
        <div className="profile-info">
          <p>
            <strong>Почта:</strong> {user.email}
          </p>
          {user.age && (
            <p>
              <strong>Возраст:</strong> {user.age}
            </p>
          )}
          {user.createdAt && (
            <p>
              <strong>Member since:</strong>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      ) : (
        <p>Загрузка...</p>
      )}
      {/* ChangePasswordForm */}
    </div>
  );
};
export default ProfilePage;
