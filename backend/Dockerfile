FROM python:3.10.6-alpine3.16

COPY requiments.txt /temp/requiments.txt
COPY beekeeper_web /beekeeper_web

WORKDIR /beekeeper_web

EXPOSE 8000
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
RUN pip install --upgrade pip
RUN pip install -r /temp/requiments.txt