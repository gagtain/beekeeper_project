import asyncio
import smtplib
from email.mime.text import MIMEText


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

    def send_message(self, client):
        msg = MIMEText(self.text, 'html')
        msg["Subject"] = self.subject_message
        print(self.sender)
        self.__server.sendmail(self.sender, client, msg.as_string())


