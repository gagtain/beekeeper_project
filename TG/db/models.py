from sqlalchemy import Column, Integer, ForeignKey, VARCHAR, BOOLEAN
from sqlalchemy.orm import relationship

from .base import BaseModel
from .manager import ManagerAnnotate


class MainUser(BaseModel, ManagerAnnotate):
    __tablename__ = 'user_mainuser'

    id = Column(Integer, primary_key=True)
    telegram = relationship("UserTelegram", back_populates="user")
    username = Column(VARCHAR(50), unique=True)


class UserTelegram(BaseModel, ManagerAnnotate):
    __tablename__ = 'user_service_usertelegram'


    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("user_mainuser.id"), unique=True, )
    user = relationship("MainUser", back_populates="telegram")
    telegram_id = Column(VARCHAR(150))
    is_sending_code = Column(BOOLEAN(), default=False)
