import datetime
import smtplib

from global_modules.email.core.basic import Email


class ContextEmail(Email):

    async def __aenter__(self):
        time = datetime.datetime.now()
        await self.login()
        print(datetime.datetime.now() - time, 355)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        time = datetime.datetime.now()
        await super().close()
        print(datetime.datetime.now() - time, 33333)

    def __enter__(self):
        self.login()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        super().close()


    def __init__(self, server, port):
        super().__init__(server, port)

