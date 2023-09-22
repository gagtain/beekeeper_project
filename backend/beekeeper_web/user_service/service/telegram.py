import os

from aiogram import Bot

from user_service.env import TOKEN



async def send_message(message: str, from_: str):
    bot = Bot(TOKEN)
    await bot.send_message(from_, message)
    await bot.session.close()
