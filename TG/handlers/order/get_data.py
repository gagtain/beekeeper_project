from aiogram import Router, F, types

from services.auth import AuthServices

router = Router()


@router.message(F.text == "Оформить заказ")
@AuthServices.user_auth
async def start_order(message: types.Message, user):
    await message.answer(text=f"Да {user}")
