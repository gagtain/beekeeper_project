import asyncio

from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from sqlalchemy import URL, select
from sqlalchemy.ext.asyncio import async_sessionmaker

from config import TOKEN, postgres_url
from db.manager import init_manager_model, EngineManager, SessionMakerManager
from handlers.user import register
from handlers.base import command
from handlers.order import get_data
from db import create_async_engine, get_session_maker, proceed_schemas, BaseModel, MainUser


async def main() -> None:
    init_manager_model()
    dp = Dispatcher()
    bot = Bot(TOKEN, parse_mode=ParseMode.HTML)
    dp.include_routers(register.router,get_data.router, command.router)

    await test(SessionMakerManager.session)
    await proceed_schemas(EngineManager.async_engine, BaseModel.metadata)
    await dp.start_polling(bot)


async def test(session_maker: async_sessionmaker):
    a = await MainUser.objects.get(MainUser.id == 1)
    print(a)

if __name__ == "__main__":
    asyncio.run(main())
