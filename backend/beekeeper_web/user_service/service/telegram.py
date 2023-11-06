import os

from aiogram import Bot

from django.conf import settings



async def send_message(message: str, from_: str):
    bot = Bot(settings.TOKEN)
    await bot.send_message(from_, message)
    await bot.session.close()
