# Веб сервис "Уварово Пасечник"
## Стек на данный момент:
1. Python
   1. Django
   2. DRF
   3. Celery
2. JS
   1. Vue.js
   2. Nuxt.js
3. Кэш
   1. RambitMQ
   2. Redis (?)
## Что представляет из себя
Данный сервис представляет из себя фронтенд часть написанная на js (Vue.js и Nuxt.js) и backend часть написанная на Python (Django, DRF).
По итогу будет представлено 9 систем
1. frondend
   1. Интернет магазин
   2. Новости
   3. Админ панель
2. backend
   1. Интернет магазин
   2. Новости
   3. Заказы
   4. Платежи
   5. Доставки
   6. Рассылка

Система платежей на данный момент представляет собой интеграцию только с Юкассой

Система доставок на данный момент представляет собой интеграцию только со СДЭК
___
## Ближайшие задачи
1. Интеграция с системой доставой "СДЕК"
2. Рефакторинг
3. Добавление новых функций в админ панель
4. Написание собственной библиотеки для интеграции со "СДЕК"
5. Добавление кэширования через Redis
6. Полная адаптация frontend для мобильных телефонов
___
## Реализованные задачи
1. Интеграция с платежной системой "Юкасса"
2. Частичная интеграция с системой доставок "СДЕК"
3. Оформление заказов
4. Взаимодействия с товарами
   1. Добавление и удаление из избранных
   2. Добавление и удаление из корзины
   3. Выбор характеристик товара
   4. Регистрация/Авторизация пользователей
5. Email рассылка (частично)
6. Создание tasks через Celery
7. Подключение RabbitMQ
8. Frontend часть (частично)
9. Частично реализованная админ панель(70%)
10. Новости
11. Настройка nginx
12. websocket - уведомления
13. websocket - отслеживание товаров
___
### сайт доступен по адресу https://gagtain.ru (на данный момет отключен)
По ходу разработки будут добавляется документации к API и пояснения структур кода