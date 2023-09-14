import importlib
import inspect
import sys

from sqlalchemy import select, ColumnExpressionArgument, Result
from sqlalchemy.sql.selectable import _MemoizedSelectEntities

from db import get_session_maker, create_async_engine, BaseModel
from config import postgres_url


class EngineManager:
    async_engine = create_async_engine(postgres_url)


class SessionMakerManager:
    session = get_session_maker(EngineManager.async_engine)


class ObjectsManager:
    model = None

    def __init__(self, model):
        self.model = model

    async def filter(self, *criteria) -> Result:
        async with SessionMakerManager.session() as session:
            async with session.begin():
                result = await session.execute(select(self.model).filter(*criteria))
                session.expunge_all()

        return result




    async def get(self, *criteria):
        filter = await self.filter(*criteria)
        result = filter.one_or_none()
        if result:
            return result[0]
        else:
            raise AttributeError


class ManagerAnnotate:
    objects: ObjectsManager = None


def init_manager_model(url='db.models'):
    module = importlib.import_module(url)
    classes = [
        value
        for value in (
            getattr(module, name)
            for name in dir(module)
        )
        if isinstance(value,
                      type) and getattr(value,
                                        '__module__',
                                        None) == module.__name__ and issubclass(value, BaseModel)
    ]
    for i in classes:
        try:
            if not i.objects.model:
                i.objects.model = i
        except AttributeError:
            i.objects = ObjectsManager(model=i)
