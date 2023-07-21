FROM node:18.16.0


# делаем каталог 'app' текущим рабочим каталогом
WORKDIR /app


# копируем файлы и каталоги проекта в текущий рабочий каталог (т.е. в каталог 'app')
COPY ./admin/.output .

# собираем приложение для production с минификацией

CMD node server/index.mjs
