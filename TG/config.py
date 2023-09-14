import os

from sqlalchemy import URL

DEBUG = True


def get_token():
    if DEBUG:
        from env import TOKEN as tk
        return tk
    else:
        return os.getenv("TOKEN")


TOKEN = get_token()

postgres_url = URL.create(
        "postgresql+asyncpg",
        database="beekeeper",
        username="gagtain",
        port=5432,
        host="localhost",
        password="13576422"
    )

BASE_API_URL = "http://localhost:8000/"
