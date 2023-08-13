from django.db.models import QuerySet


class OnlyOptimize:
    """Класс необходимый для финального указания .only()"""

    _query = QuerySet
    _only = []

    def __init__(self, query):
        self._query = query
        self._only = []

    def add_only(self, *fields: str):
        self._only += fields

    def finely(self):
        print(self._only)
        return self._query.only(*self._only)


    def get_only(self):
        return self._only