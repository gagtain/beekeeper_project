import smtplib

from global_modules.email.core.basic import Email


class ContextEmail(Email):

    def __enter__(self):
        self.login()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        super().close()

    def __init__(self, server, port):
        super().__init__(server, port)

