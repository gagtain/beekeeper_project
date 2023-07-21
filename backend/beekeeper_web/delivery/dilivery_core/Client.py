import requests

from beekeeper_web import settings


class Configuration(object):
    """
    A class representing the configuration.
    """
    api_url: str = "https://api.edu.cdek.ru/v2/" if settings.DEBUG == True else "https://api.cdek.ru/v2/"

    grant_type = 'client_credentials'
    client_id = 'EMscd6r9JnFiQ3bLoyjJY6eM78JrJceI'
    client_secret = 'PjLZkKBHEiLK3YsjtNrt3TGNG0ahs3kG'
    token = ''
    time = ''

    @classmethod
    def get_auth_params(cls):
        return {
            'grant_type': cls.grant_type,
            'client_id': cls.client_id,
            'client_secret': cls.client_secret
        }

    @classmethod
    def set_token(cls):
        query_params = cls.get_auth_params()
        token_response = requests.post(url=f'{Configuration.api_url}oauth/token', params=query_params)
        json = token_response.json()
        Configuration.token = json.get('access_token')


def token_verif(token, time):
    def decorator(func):
        if Configuration.token != "" and Configuration.time != "":
            return func
        else:
            Configuration.set_token()
            return func

    return decorator


class Client:

    @token_verif(token=Configuration.token, time=Configuration.time)
    def request(self, func):
        return func()
