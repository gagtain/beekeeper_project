from db import UserTelegram


async def login_user_telegram(user_id: int, telegram_id: int):
    obj = UserTelegram(
        user_id=user_id,
        telegram_id=str(telegram_id)
    )
    await UserTelegram.objects.create(obj)
