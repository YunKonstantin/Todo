 # Todo Auth API Server (Блок 3)

 ## Установка
 1. Убедитесь, что установлен Node.js v14+
 2. Установите зависимости:
 ```bash
 npm install express cors jsonwebtoken bcryptjs
 ```
 3. Запустите сервер:
 ```bash
 node server.js
 ```

 ## Базовый URL
 `http:localhost:3001`

 ## Аутентификация

 ### Регистрация
 **POST** `/auth/register`
 ```json
 {
   "email": "user@example.com",
   "password": "securepassword",
   "age": 25  //опционально
 }
 ```
 Ответ:
 ```json
 {
   "accessToken": "JWT_TOKEN",
   "refreshToken": "REFRESH_TOKEN"
 }
 ```

 ### Логин
 **POST** `/auth/login` (аналогичный формат запроса)

 ### Обновление токенов
 **POST** `/auth/refresh`
 ```json
 {
   "refreshToken": "your_refresh_token"
 }
 ```

 ## Профиль

 ### Получить данные
 **GET** `/auth/me`  
 **Требует:** `Authorization: Bearer ACCESS_TOKEN`  
 Ответ:
 ```json
 {
   "id": 1,
   "email": "user@example.com",
   "age": 25,
   "createdAt": "2023-10-20T10:00:00.000Z"
 }
 ```

 ### Смена пароля
 **POST** `/auth/change-password`  
 **Требует:** `Authorization: Bearer ACCESS_TOKEN`  
 Запрос:
 ```json
 {
   "oldPassword": "current_password",
   "newPassword": "new_secure_password"
 }
 ```

 ## Работа с задачами
 Все эндпоинты требуют заголовок `Authorization`

 ### Получить задачи
 **GET** `/todos?page=1&limit=10`  
 Ответ:
 ```json
 {
   "data": [
     {
       "id": 1,
       "text": "Купить молоко",
       "completed": false,
       "createdAt": "2023-10-20T10:00:00.000Z"
     }
   ],
   "pagination": {
     "total": 15,
     "page": 1,
     "limit": 10,
     "totalPages": 2
   }
 }
 ```

 ### Создать задачу
 **POST** `/todos`
 ```json
 {
   "text": "Новая задача"
 }
 ```

 ### Обновить задачу
 **PUT** `/todos/:id`
 ```json
 {
   "text": "Обновленный текст",
   "completed": true
 }
 ```

 ### Удалить задачу
 **DELETE** `/todos/:id`

 ### Переключить статус
 **PATCH** `/todos/:id/toggle`

 ## Хранение данных
 - `users.json` - email, хеш пароля, возраст, дата регистрации
 - `todos.json` - задачи с привязкой к пользователю
 - `refresh-tokens.json` - список активных refresh-токенов

 ## Пример запроса
 ```javascript
  Логин
 const { accessToken } = await fetch('/auth/login', {
   method: 'POST',
   headers: { 'Content-Type': 'application/json' },
   body: JSON.stringify({ 
     email: 'user@example.com',
     password: 'password' 
   })
 }).then(res => res.json());

  Создание задачи
 await fetch('/todos', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${accessToken}`
   },
   body: JSON.stringify({ text: 'Новая задача' })
 });
 ```
