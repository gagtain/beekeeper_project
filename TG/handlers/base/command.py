from aiogram import Router, F, types

from keyboard import kb_reg

router = Router()


@router.message(F.text.in_(['/start']))
async def echo_handler(message: types.Message) -> None:
    await message.answer(text="Пчелиная артель", reply_markup=kb_reg)




@router.message()
async def not_command(message: types.Message) -> None:
    await message.answer(text="Неверная команда")