from aiogram import Router, F, types

from keyboard import kb_log, kb_sending_examination
from services.Permissions import allow_only
from services.auth import AuthServices

router = Router()


@router.message(F.text.in_(['/start']))
@AuthServices.user_auth(auth=allow_only)
async def echo_handler(message: types.Message, user_id, **kwargs) -> None:
    if user_id:
        await message.answer(text=
                             "Пчелиная артель\nДанный бот необходим для получения кода авторизации",
                             reply_markup=kb_sending_examination
                             )
    else:
        await message.answer(text="Пожалуйста войдите в свой аккаунт", reply_markup=kb_log)




@router.message()
async def not_command(message: types.Message) -> None:
    await message.answer(text="Неверная команда")