import asyncio
import datetime

from aiogram import Bot, Dispatcher
from aiogram.enums import ParseMode
from aiogram.fsm.storage.redis import RedisStorage
from redis.asyncio.client import Redis
from config import TOKEN, redis_url
from db.manager import init_manager_model, EngineManager
from handlers.user import login, code
from handlers.base import command
from handlers.order import get_data
from db import proceed_schemas, BaseModel




async def main() -> None:
    init_manager_model()
    dp = Dispatcher(storage=RedisStorage(redis=redis_url))
    bot = Bot(TOKEN, parse_mode=ParseMode.HTML)
    await bot.delete_webhook(drop_pending_updates=True)
    dp.include_routers(login.router, get_data.router, code.router, command.router)

    await proceed_schemas(EngineManager.async_engine, BaseModel.metadata)
    await dp.start_polling(bot)



if __name__ == "__main__":
    asyncio.run(main())
