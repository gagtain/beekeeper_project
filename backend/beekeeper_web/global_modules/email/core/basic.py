import email
import ssl
from socket import socket
from typing import Tuple, Dict, Optional, Union, Sequence, cast

import aiosmtplib
import smtplib
from email.mime.text import MIMEText

from aiosmtplib import SMTPResponse
from aiosmtplib.smtp import DEFAULT_TIMEOUT
from aiosmtplib.typing import SocketPathType
from asgiref.sync import async_to_sync

SENDER_MAIL = 'gagtain@gmail.com'
PASSWORD_MAIL = 'wmwqtejviqtydtsp'


class Email:
    sender = SENDER_MAIL
    password = PASSWORD_MAIL
    text = ''
    subject_message = ''
    __server = None

    def __init__(self, server, port):
        self.__server = smtplib.SMTP(server, port)

    def login(self):
        try:
            self.__server.starttls()
            self.__server.login(self.sender, self.password)
        except BaseException as e:
            print(e)
            raise "Проверьте логин/пароль"

    def close(self):
        self.__server.close()

    def text_in_file(self, file):
        try:
            with open(file) as f:
                self.text = f.read()
        except IOError:
            raise 'путь к файлу не верный'

    def text_in_string(self, string):
        self.text = string

    async def send_message(self, client):
        msg = MIMEText(self.text, 'html')
        msg["Subject"] = self.subject_message
        self.__server.sendmail(self.sender, client, msg.as_string())


class AsyncEmail:
    sender = SENDER_MAIL
    password = PASSWORD_MAIL
    text = ''
    subject_message = ''
    __server = None

    def __init__(self, server, port):
        self.__server = aiosmtplib.SMTP(
            hostname=server,
            port=port,
            username=self.sender,
            password=self.password,
        )

    async def login(self):
        await self.__server.__aenter__()


    def close(self):
        self.__server.close()

    def text_in_file(self, file):
        try:
            with open(file) as f:
                self.text = f.read()
        except IOError:
            raise 'путь к файлу не верный'

    def text_in_string(self, string):
        self.text = string

    async def send_message(self, client):
        msg = MIMEText(self.text, 'html')
        msg["Subject"] = self.subject_message
        await self.__server.sendmail(message=msg.as_string(), sender=self.sender, recipients=client)

    async def __aenter__(self):
        await self.__server.__aenter__()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.__server.__aexit__(exc_type, exc_val, exc_tb)

