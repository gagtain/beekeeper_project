import aiohttp

from config import BASE_API_URL
from http_api.user.schemas.auth import UserAuthRequest, UserAuthResponseUnauthorized
from http_api.exceptions.exception import CodeDataException, UserUnauthorized, UserNoCode, UserNoValidateCode


class AuthUser:
    login = f"{BASE_API_URL}api/token/"
    set_token = f"{BASE_API_URL}api/v0.1/user/set_token"
    verif_token = f"{BASE_API_URL}api/v0.1/user/token/verif"

    @classmethod
    async def auth_user(cls, user_data: UserAuthRequest) -> dict:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                    url=cls.login,
                    data=user_data.to_dict()
            ) as response:
                if response.status == 401:
                    raise UserUnauthorized(code=response.status
                                           )
                elif response.status == 400:
                    data = await response.json()
                    if data.get('error'):
                        if data['error'] == "Не указано поле token" or\
                                data['error'] == "Токен авторизации не был установлен":
                            raise UserNoCode(code=response.status)
                        elif data['error'] == "Токен неверен":
                            raise UserNoValidateCode(code=response.status)
                else:
                    return await response.json()

    @classmethod
    async def set_token_user(cls, user_data: UserAuthRequest) -> bool:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                    url=cls.set_token,
                    data=user_data.to_dict()
            ) as response:
                data = await response.json()
                if response.status == 401:
                    raise UserUnauthorized(code=response.status
                                           )
                elif response.status == 400 and data.get('error') == "Токен неверен":
                    raise UserNoValidateCode(code=response.status)
                else:
                    return True
    @classmethod
    async def verif_token_user(cls, token) -> dict:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                    url=cls.verif_token,
                    headers={
                        "Authorization": f"Bearer {token}"
                    }
            ) as response:
                return await response.json()
