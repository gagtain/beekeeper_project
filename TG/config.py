import os

from redis.asyncio import Redis
from sqlalchemy import URL
from dotenv import load_dotenv
DEBUG = True


def get_token():
    load_dotenv()
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

redis_url = Redis(
        host="localhost",
        port=6379,
        db=4


    )