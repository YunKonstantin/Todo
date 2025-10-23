 ## Блок 3: Роутинг и авторизация с JWT

 ### Задача
 Реализовать систему аутентификации с защищенными маршрутами и возможностью:
 - Регистрации с указанием возраста
 - Входа в систему
 - Просмотра и редактирования профиля
 - Обновления пароля
 - Работы с персональными задачами

 ---

 ### Требования

 #### 1. Роутинг (React Router v6)
 | Маршрут | Доступ | Компоненты |
 |---------|--------|------------|
 | `/` | Только авторизованные | `HomePage` (список задач) |
 | `/login` | Гости | `LoginForm` (форма входа) |
 | `/register` | Гости | `RegisterForm` (форма регистрации с полем возраста) |
 | `/profile` | Только авторизованные | `ProfilePage` (данные пользователя + форма смены пароля) |
 | `*` | Все | `NotFoundPage` |

 #### 2. Авторизация (JWT)
 **Эндпоинты:**
 - `POST /auth/register` - Регистрация
   ```json
   {
     "email": "user@example.com",
     "password": "securepass",
     "age": 25  опционально
   }
   ```
   
 - `POST /auth/login` - Вход (аналогичный формат)
   
 - `GET /auth/me` - Получение профиля
   ```json
   {
     "id": 1,
     "email": "user@example.com",
     "age": 25,
     "createdAt": "2023-10-20T10:00:00.000Z"
   }
   ```

 - `POST /auth/change-password` - Смена пароля
   ```json
   {
     "oldPassword": "current",
     "newPassword": "newpass"
   }
   ```

 #### 3. Защищенные маршруты
 Реализовать компонент `ProtectedRoute`:
 ```jsx
 <Route 
   path="/profile" 
   element={
     <ProtectedRoute>
       <ProfilePage />
     </ProtectedRoute>
   } 
 />
 ```

 #### 4. Redux (authSlice)
 ```typescript
 interface AuthState {
   user: {
     id: number;
     email: string;
     age?: number;
   } | null;
   token: string | null;
   status: 'idle' | 'loading' | 'failed';
 }

  Actions:
 - registerUser
 - loginUser
 - logoutUser
 - fetchUserProfile
 - changePassword
 ```

 #### 5. Формы
 1. **Регистрация**:
    - Поля: Email, Password, Age (опционально)
    - Валидация email и пароля (мин. 6 символов)

 2. **Профиль**:
    - Отображение: Email, Age, Дата регистрации
    - Форма смены пароля:
      - Поля: Старый пароль, Новый пароль, Подтверждение
      - Валидация совпадения новых паролей

 #### 6. Интеграция с задачами
 - Все запросы к `/todos` требуют заголовок `Authorization: Bearer <token>`
 - Задачи автоматически привязываются к ID пользователя

 ---

 ### Дополнительные требования
 1. **Refresh Token**:
    - Access Token срок жизни 15 минут
    - Refresh Token срок жизни 7 дней
    - Автоматическое обновление токенов при истечении

 2. **Обработка ошибок**:
    - Отображение ошибок форм
    - Глобальный обработчик ошибок API

 3. **Валидация**:
    - Формат email
    - Минимальная длина пароля
    - Подтверждение нового пароля

 ---

 ### Ресурсы
 1. [Документация React Router](https://reactrouter.com/)
 2. [Видео-гайд по React Router](https://www.youtube.com/watch?v=RvvNL6lsoHI&ab_channel=CodeHorizon)
 3. [JWT](https://habr.com/ru/articles/340146/)
