import re

from django.core.exceptions import ValidationError


def user_password_validate(value: str):
    if len(value) < 8:
        raise ValidationError("Длинна пароля меньше 8")
    if value.islower():
        raise ValidationError("В пароле нет заглавных букв")
    if value.isupper():
        raise ValidationError("В пароле нет прописных букв")
    if re.search('\d+', value) is None:
        raise ValidationError("В пароле нет чисел")