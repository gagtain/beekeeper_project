from rest_framework.request import Request
from yookassa.domain.common import SecurityHelper


def examination_notifications(request: Request):
    try:
        print(request.headers)
        ip = request.headers.get('X-Real-IP')
        if SecurityHelper().is_ip_trusted(ip):
            return True
        else:
            return False
    except KeyError:
        return False
