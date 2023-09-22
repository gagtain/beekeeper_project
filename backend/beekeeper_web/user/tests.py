import random
import string

from django.test import TestCase
from django.urls import reverse

from rest_framework.test import APITestCase

from user.models import MainUser
from user.serializers import UserRegisterSerializers


# Create your tests here.
class UserTests(APITestCase):
    username = ''
    password = ''

    def get_random_string(self, count, choice=string.ascii_uppercase + string.ascii_lowercase):

        return "".join(random.choice(
            choice
        ) for x in range(1, count))

    def get_password(self):
        return f"{self.get_random_string(5)}{self.get_random_string(count=2, choice=string.ascii_uppercase)}345Aa"

    def create_user(self, data=None):
        url_register = reverse('register')
        password = self.get_password()
        if data is None:
            register_serializer = UserRegisterSerializers(data={
                'username': self.get_random_string(11),
                'email': f"{self.get_random_string(5)}@yandex.ru",
                'FIO': self.get_random_string(11),
                'password': password,
                'password2': password

            })
        else:
            register_serializer = UserRegisterSerializers(data=data)

        response = self.client.post(url_register, register_serializer.initial_data)
        if response.status_code == 201:
            self.set_user(register_serializer.initial_data.get('username'),
                          register_serializer.initial_data.get('password'))
        return response

    def test_create_user(self):
        response = self.create_user()
        self.assertEquals(response.status_code, 201)

    def test_not_validate_create_user(self):
        password = self.get_password()
        response = self.create_user(data={
                'username': self.get_random_string(11),
                'email': f"{self.get_random_string(5)}yandex.ru",
                'FIO': self.get_random_string(11),
                'password': password,
                'password2': password

            })
        self.assertEquals(response.status_code, 400)
        response = self.create_user(data={
                'username': self.get_random_string(11),
                'email': f"{self.get_random_string(5)}@yandex.ru",
                'FIO': self.get_random_string(11),
                'password': password,
                'password2': '2'

            })
        self.assertEquals(response.status_code, 400)
        response = self.create_user(data={
                'username': self.get_random_string(11),
                'email': f"{self.get_random_string(5)}@yandex.ru",
                'FIO': self.get_random_string(11),
                'password': '333',
                'password2': '333'

            })
        self.assertEquals(response.status_code, 400)
        response = self.create_user(data={
                'username': self.get_random_string(11),
                'email': f"{self.get_random_string(5)}@yandex.ru",
                'FIO': self.get_random_string(11),
                'password': '33333333ф',
                'password2': '33333333ф'

            })
        self.assertEquals(response.status_code, 400)
        self.assertEquals(response.status_code, 400)
        response = self.create_user(data={
                'username': self.get_random_string(11),
                'email': f"{self.get_random_string(5)}@yandex.ru",
                'FIO': self.get_random_string(11),
                'password': '33333333Ф',
                'password2': '33333333Ф'

            })
        self.assertEquals(response.status_code, 400)

    def test_login_user(self):
        self.create_user()
        url = reverse('token_obtain_pair')
        data = {
            'username': self.username,
            'password': self.password
        }
        response = self.client.post(url, data)
        self.assertEquals(response.status_code, 200)

    @classmethod
    def set_user(cls, username, password):
        cls.username = username
        cls.password = password


    def test_token_verif(self):
        self.create_user()
        url = reverse('token_obtain_pair')
        data = {
            'username': self.username,
            'password': self.password
        }
        response = self.client.post(url, data)
        token = response.json()['access']
        url = reverse('verif')
        response_verif = self.client.post(url, headers={'Authorization': f'Bearer {token}'})
        self.assertEquals(response_verif.status_code, 200)

