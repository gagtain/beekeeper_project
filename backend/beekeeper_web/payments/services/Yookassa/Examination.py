

from yookassa.domain.common import SecurityHelper


def examination_notifications(request):
    try:
        ip = '77.75.156.11'
        if SecurityHelper().is_ip_trusted(ip):
            return True
        else:
            return False
    except KeyError:
        return False
