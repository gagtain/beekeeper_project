from aiogram.fsm.state import StatesGroup, State


class Form(StatesGroup):
    username = State()
    password = State()
    code = State()