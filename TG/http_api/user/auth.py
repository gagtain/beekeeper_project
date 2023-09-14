import aiohttp

from config import BASE_API_URL
from http_api.user.schemas.auth import UserAuthRequest, UserAuthResponseUnauthorized
from http_api.exceptions.exception import CodeDataException, UserUnauthorized


class AuthUser:
    register = f"{BASE_API_URL}api/token/"

    @classmethod
    async def auth_user(cls, user_data: UserAuthRequest):
        async with aiohttp.ClientSession() as session:
            async with session.post(
                    url=cls.register,
                    data=user_data.to_dict()
            ) as response:
                if response.status == 401:
                    raise UserUnauthorized(code=response.status
                                           )
                print("Content-type:", response.headers['content-type'])
