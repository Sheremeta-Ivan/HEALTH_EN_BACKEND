# Backend - Healthy Hub - FS84 - ProjectGroup 3

Ця документація надає огляд функціоналу бекенд-додатка, включаючи аутентифікацію, вхід, зміну пароля, керування аватаром та щоденні обчислення кількості калорій, мікроелементів та води. Також охоплено ведення та обробку інформації щодо ваги, прийому їжі, кількості води та калорій.

- 🔗 API_URL - [https://healthy-hub-backend-fs5j.onrender.com](https://healthy-hub-backend-fs5j.onrender.com)
- 📄 API_DOCS(Swagger) - [https://healthy-hub-backend-fs5j.onrender.com/api-docs](https://healthy-hub-backend-fs5j.onrender.com/api-docs)

- 🖼️ FRONTEND - [https://songlad.github.io/HEALTH_EN/](https://songlad.github.io/HEALTH_EN/)
- ✨ FRONTEND REPO - [https://github.com/SonGlad/HEALTH_EN](https://github.com/SonGlad/HEALTH_EN)

## Розробники

- **Team-lead:** [Іван Шеремета](https://github.com/Sheremeta-Ivan)
- **Розробник:** [Даниїл Дрозд](https://github.com/DaniilDrozd)

## Технології

<p align="center">
  <b>Бекенд HealthyHub побудований за допомогою наступних технологій та інструментів:</b>
</p>
<p align="center">
  <img alt="Node.js" src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white">&nbsp;
  <img alt="Express" src="https://img.shields.io/badge/Express-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white">&nbsp;
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white">&nbsp;
  <img alt="Swagger" src="https://img.shields.io/badge/Swagger-%2385EA2D.svg?style=for-the-badge&logo=swagger&logoColor=white">&nbsp;
  <img alt="JWT" src="https://img.shields.io/badge/JWT-%23000000.svg?style=for-the-badge&logo=json-web-tokens&logoColor=white">&nbsp;
  <img alt="Postman" src="https://img.shields.io/badge/Postman-%23FF6C37.svg?style=for-the-badge&logo=postman&logoColor=white">&nbsp;
  <img alt="Mongoose" src="https://img.shields.io/badge/Mongoose-%23880000.svg?style=for-the-badge&logo=mongoose&logoColor=white">&nbsp;
  <img alt="Bcrypt" src="https://img.shields.io/badge/Bcrypt-%23FF6C37.svg?style=for-the-badge&logo=bcrypt&logoColor=white">&nbsp;
</p>

## Зміст

- [Аутентифікація](#аутентифікація)
- [Вхід](#вхід)
- [Зміна Пароля](#зміна-пароля)
- [Керування Аватаром](#керування-аватаром)
- [Щоденне Обчислення](#щоденне-обчислення)
- [Ведення Ваги](#ведення-ваги)
- [Запис Їжі](#запис-їжі)
- [Запис Кількості Води](#запис-кількості-води)
- [Запис Кількості Калорій](#запис-кількості-калорій)
- [Swagger Документація](#swagger-документація)

## Аутентифікація

Бекенд реалізує аутентифікацію користувача за допомогою JSON Web Tokens (JWT). Під час реєстрації або входу користувача генерується токен і відправляється клієнту. Подальші запити до аутентифікованих ендпоінтів повинні включати цей токен у заголовках для авторизації користувача.

## Вхід

Користувачі можуть увійти за допомогою своєї електронної пошти та пароля. Бекенд перевіряє дані для входу, і при успішному вході надає токен JWT для авторизації.

## Зміна Пароля

Користувачі можуть змінити свій пароль, надаючи поточний пароль та новий пароль. Бекенд перевіряє поточний пароль і оновлює його, якщо перевірка успішна.

## Керування Аватаром

Користувачі можуть завантажувати та керувати своїми аватарами. Бекенд зберігає зображення аватара та надає ендпоінти для отримання та оновлення аватара користувача.

## Щоденне Обчислення

Додаток обчислює щоденні потреби користувача в калоріях, мікроелементах та воді на основі таких факторів, як вік, вага, зріст, рівень активності та цілі. Ця інформація використовується для надання персоналізованих рекомендацій користувачеві.

## Ведення Ваги

Користувачі можуть вести і відстежувати свою вагу з часом. Бекенд зберігає записи ваги з відмітками часу, що дозволяє користувачам візуалізувати прогрес зміни ваги.

## Запис Їжі

Додаток дозволяє користувачам записувати та відстежувати свій прийом їжі. Користувачі можуть фіксувати прийоми їжі, і бекенд оброблює цю інформацію для розрахунку кількості калорій та розподілу поживних речовин.

## Запис Кількості Води

Користувачі можуть фіксувати кількість води, яку вони вживають щоденно. Бекенд відстежує записи про вживання води, надаючи інформацію про щоденний рівень гідратації.

## Запис Кількості Калорій

Окрім розрахунку щоденного вживання калорій, додаток реєструє кількість калорій, які вжиті користувачем з прийому їжі. Ця інформація корисна для тих, хто веде облік свого калорійного балансу.

## Swagger Документація

![Preview](./assets/swagger.png)
