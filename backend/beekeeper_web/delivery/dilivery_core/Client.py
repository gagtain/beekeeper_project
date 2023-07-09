from beekeeper_web import settings


class Configuration(object):
    """
    A class representing the configuration.
    """
    api_url: str = "https://api.edu.cdek.ru/v2/" if settings.DEBUG == True else "https://api.cdek.ru/v2/"

    grant_type = 'client_credentials'
    client_id = 'EMscd6r9JnFiQ3bLoyjJY6eM78JrJceI'
    client_secret = 'PjLZkKBHEiLK3YsjtNrt3TGNG0ahs3kG'

    @classmethod
    def get_auth_params(cls):
        return cls.client_id

class Client
