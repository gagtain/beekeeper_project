from django.core.exceptions import ValidationError


def not_quotation_mark(string: str):
    print(string)
    if string.count('\'') or string.count('"'):
        raise ValidationError('В названии присутствуют символы кавычек')

def image_ot_quotation_mark(image):
    not_quotation_mark(str(image))